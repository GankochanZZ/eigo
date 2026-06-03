import { GoogleGenAI } from '@google/genai';
import fs from 'fs/promises';
import path from 'path';

const CACHE_FILE = '/tmp/criteria_cache.json';

// Gemini API の一時的な500エラーに対するリトライヘルパー
async function callWithRetry(fn, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const msg = err?.message || '';
      const isRetryable = msg.includes('500') || msg.includes('INTERNAL') || msg.includes('503') || msg.includes('UNAVAILABLE');
      if (isRetryable && attempt < maxRetries) {
        const delay = 1000 * Math.pow(2, attempt - 1); // 1s, 2s, 4s
        console.log(`[Retry] Attempt ${attempt} failed (${msg}). Retrying in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      throw err;
    }
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, category, question, selectedAnswer, correctAnswer, reasonText, correctElements, explanation, apiKey } = body;

    const activeApiKey = apiKey || process.env.GEMINI_API_KEY;
    const isInterpretation = category === '解釈';

    if (!question || (!isInterpretation && !selectedAnswer) || !reasonText) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    if (!activeApiKey) {
      // APIキーがない場合のモック
      await new Promise(r => setTimeout(r, 1500));
      return new Response(JSON.stringify({
        score: selectedAnswer === correctAnswer ? 85 : 10,
        evaluation: "（キー未設定のデモ表示）"
      }), { headers: { 'Content-Type': 'application/json' } });
    }

    const aiClient = new GoogleGenAI({ apiKey: activeApiKey });
    
    // --- 【フェーズ1】キャッシュの読み込みと独自の評価基準(AI Criteria)の生成 ---
    let cache = {};
    try {
      const data = await fs.readFile(CACHE_FILE, 'utf-8');
      cache = JSON.parse(data);
    } catch (e) {
      // read fail (file doesn't exist)
    }

    let aiCriteria = cache[id];

    if (!aiCriteria) {
      const elementsList = correctElements.map((el, i) => `${i + 1}. ${el}`).join('\n');
      
      const criteriaPrompt = isInterpretation ? `
あなたは優秀な予備校の英語科教務主任です。
以下の「英文和訳問題」と「教員が用意した採点基準・模範解答」をもとに、
生徒の『和訳』を厳密に採点するための「大学受験レベルの配点基準表」を作成してください。

【問題文（英文）】
${question}
【模範解答（和訳）】
${explanation?.translation || ''}
【教員が用意した採点基準要素】
${elementsList}

【タスク】
生徒の和訳を採点するための配点基準表（合計100点）を作成してください。
注意：あなたが独自に細かすぎる採点項目を新しく追加しないでください。
上記の「教員が用意した採点基準要素」と、「文全体の意味が通っていること」などを基準として、合計100点になるように配点を割り振ってください。

出力は以下の配列を含むJSONのみを出力してください（Markdown装飾の \`\`\`json などのタグは一切不要です）。
[
  { "element": "採点項目1（例：形式主語Itを正しく訳出している）", "points": 40 },
  { "element": "採点項目2", "points": 60 },
  ...
]
` : `
あなたは優秀な予備校の英語科教務主任です。
以下の「文法問題」と「教員が用意した解説要素」をもとに、
生徒の『解答理由（記述）』を厳密に採点するための「大学受験レベルの配点基準表」を作成してください。

【問題文】
${question}
【正解の選択肢】
${correctAnswer}
【教員が用意した解説要素】
${elementsList}

【タスク】
生徒の解答理由を採点するための配点基準表（合計100点）を作成してください。
注意：あなたが独自に細かすぎる採点項目を新しく追加しないでください。
「選択肢が正解であること（例えば20〜40点）」と、上記の「教員が用意した解説要素」のみを採点項目として、合計100点になるように配点を割り振ってください。他の周辺知識は採点基準には含めず、あくまで解説で強めるものとして扱ってください。

出力は以下の配列を含むJSONのみを出力してください（Markdown装飾の \`\`\`json などのタグは一切不要です）。
[
  { "element": "採点項目1（例：選択肢が正解である）", "points": 20 },
  { "element": "採点項目2", "points": 40 },
  ...
]
`;
      const criteriaRes = await callWithRetry(() => aiClient.models.generateContent({
        model: 'gemma-4-31b-it',
        contents: criteriaPrompt,
        config: { temperature: 0.1 }
      }));
      
      let textCriteria = criteriaRes.text.trim();
      if (textCriteria.startsWith('\`\`\`json')) {
        textCriteria = textCriteria.replace(/\`\`\`json\n?/, '').replace(/\`\`\`$/, '');
      }
      
      try {
        aiCriteria = JSON.parse(textCriteria);
      } catch (e) {
        // フォールバック
        aiCriteria = textCriteria;
      }

      // キャッシュに保存
      cache[id] = aiCriteria;
      await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
      console.log(`[Cache] Generated new AI criteria for Question ${id}:`, aiCriteria);
    }

    // --- 【フェーズ2】生成・保存された基準を用いたユーザーの評価 ---
    const isOptionCorrect = isInterpretation ? null : (selectedAnswer === correctAnswer);
    const rubricString = typeof aiCriteria === 'string' ? aiCriteria : JSON.stringify(aiCriteria, null, 2);

    const evaluationPrompt = isInterpretation ? `あなたは高校の英語教師です。
以下の【問題】と【配点基準】に従って、生徒の「和訳」を採点・評価してください。
なお、生徒の入力は音声入力を使っている場合があるため、多少の誤字脱字が含まれる前提で対応し、表現のブレを柔軟に解釈してください。

【問題文（英文）】
${question}
【模範解答】
${explanation?.translation || ''}

【評価・配点基準（合計100点）】
採点（点数算出）の際は、この基準に書かれた要素が和訳に含まれているかを厳密にチェックして合計点を出してください。
${rubricString}

【生徒の和訳】
${reasonText}

【採点とフィードバックのルール】
1. 生徒の和訳は音声入力のため誤字・脱字が含まれている場合があります。誤字があっても自分の中で正しく読み替えた上で採点してください。
2. 意訳でも英文の構造を正しく捉えられていれば正解としてください。
3. 100点満点でない場合は、「どの基準が満たされていなかったのか」「どこを誤訳しているか」を具体的に指摘・解説してください。
4. 見やすさのため適宜「・」の箇条書きや改行\\nを使用し、読みやすく文章を整理してください。
5. 文末の励まし・フォローの言葉は一切不要です。（純粋に採点の解説だけを行ってください）
6. トーンは的確な指導スタイルとし、絶対にJSON以外のテキストは出力しないでください。

以下の2つのキーを持つJSONのみを出力してください。
{
  "score": 0〜100の整数,
  "evaluation": "箇条書きなどを活用した、基準に基づく具体的な解説（フォローは含めない。最大350文字程度）"
}
` : `あなたは高校の英語教師です。
以下の【問題】と【配点基準】に従って、生徒の「回答」と「理由」を採点・評価してください。
なお、生徒の理由は音声入力を使っている場合があるため、多少の誤字脱字が含まれる前提で対応し、表現のブレを柔軟に解釈してください。

【問題文】
${question}
【正解の選択肢】
${correctAnswer}

【評価・配点基準（合計100点）】
採点（点数算出）の際は、この基準に書かれた要素が理由に含まれているかをチェックして合計点を出してください。
${rubricString}

【生徒が選んだ選択肢】
${selectedAnswer} （正誤: ${isOptionCorrect ? '正解' : '不正解'}）
【生徒の理由】
${reasonText}

【採点とフィードバックのルール】
1. 生徒の理由は音声入力のため誤字・脱字が含まれている場合があります。誤字があっても自分の中で正しく読み替えた上で採点してください。誤字・脱字・表記の揺れについてフィードバックで一切言及してはなりません。
2. 「生徒が必要な文法事項を本質的に理解していると判断できるか」という視点で文脈を寛容に汲み取って採点してください。
3. 100点満点でない場合は、「どの基準が満たされていなかったのか」をしっかりと文字数を割いて具体的に指摘・解説してください。
4. 見やすさのため適宜「・」の箇条書きや改行\\nを使用し、読みやすく文章を整理してください。
5. 文末の励まし・フォローの言葉は一切不要です。（純粋に採点の解説だけを行ってください）
6. トーンは的確な指導スタイルとし、絶対にJSON以外のテキストは出力しないでください。

以下の2つのキーを持つJSONのみを出力してください（Markdownのコードブロック記号等の独自の装飾は不要ですが、内部の文字列における改行記号\\nは有効です）。
{
  "score": 0〜100の整数,
  "evaluation": "箇条書きなどを活用した、基準に基づく具体的な解説（フォローは含めない。最大350文字程度）"
}
`;

    const response = await callWithRetry(() => aiClient.models.generateContent({
        model: 'gemini-3.1-flash-lite-preview',
        contents: evaluationPrompt,
        config: { 
          temperature: 0.1,
          responseMimeType: "application/json" 
        }
    }));

    let textResponse = response.text;
    if (textResponse.startsWith('```json')) {
      textResponse = textResponse.replace(/```json\n?/, '').replace(/```$/, '');
    }

    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error("JSON抽出エラー: " + textResponse.substring(0, 50));
    }
    
    let parsed = JSON.parse(jsonMatch[0]);
    if (Array.isArray(parsed)) parsed = parsed[0];
    if (parsed && typeof parsed.score === 'undefined' && parsed.evaluation === undefined) {
      // 見つからない場合は全体のキーを探す
      const keys = Object.keys(parsed);
      if (keys.length > 0 && typeof parsed[keys[0]] === 'object') {
        parsed = parsed[keys[0]];
      }
    }

    return new Response(JSON.stringify(parsed), { headers: { 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('AI API error:', error);
    return new Response(JSON.stringify({ error: error.message || 'AI判定の処理中にエラーが発生しました。' }), { status: 500 });
  }
}
