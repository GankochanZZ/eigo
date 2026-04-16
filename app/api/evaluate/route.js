import { GoogleGenAI } from '@google/genai';
import fs from 'fs/promises';
import path from 'path';

const CACHE_FILE = '/tmp/criteria_cache.json';

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, question, selectedAnswer, correctAnswer, reasonText, correctElements, apiKey } = body;

    const activeApiKey = apiKey || process.env.GEMINI_API_KEY;

    if (!question || !selectedAnswer || !reasonText) {
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
      const criteriaPrompt = `
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
      const criteriaRes = await aiClient.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: criteriaPrompt,
        config: { temperature: 0.1 }
      });
      
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
    const isOptionCorrect = selectedAnswer === correctAnswer;
    const rubricString = typeof aiCriteria === 'string' ? aiCriteria : JSON.stringify(aiCriteria, null, 2);

    const evaluationPrompt = `
あなたは、採点基準には厳密ですが、生徒を超ポジティブに褒めて伸ばす大人気の予備校講師です。
以下の【問題】と【配点基準】に従って、生徒の「回答」と「理由」を採点・評価してください。

【問題文】
${question}
【正解の選択肢】
${correctAnswer}

【評価・配点基準（合計100点）】
採点（点数算出）の際は、この基準に書かれた要素が理由に含まれているかを厳密にチェックし、記述されていなければ該当配点を与えずに合計点を出してください。
${rubricString}

【生徒が選んだ選択肢】
${selectedAnswer} （正誤: ${isOptionCorrect ? '正解' : '不正解'}）
【生徒の理由】
${reasonText}

【フィードバックの構成と見やすさ】
1. 100点満点でない（減点された）場合は、必ず「どの基準が満たされていなかったのか（何がダメだったのか）」を具体的に指摘・解説してください。
2. その解説のあとに必ず空行を入れて段落を分け、最後に「モチベーションが上がる前向きなフォローの言葉」を添えてください。
3. トーンは「厳しすぎず甘すぎない」的確な指導スタイルとしてください。
4. **見やすさを重視し、解説のポイントが複数ある場合は「・」を使った箇条書きや、適宜改行（\\n）を使って読みやすくしてください。** 文字が詰まった長文は避けてください。
5. 絶対にJSON以外のテキストは出力しないでください。解説も励ましも長めの改行を含めてすべて \`evaluation\` の中に含めてください。

以下の2つのキーを持つJSONのみを出力してください（Markdownのコードブロック記号等の独自の装飾は不要ですが、内部の文字列における改行記号\\nは有効です）。
{
  "score": 0〜100の整数,
  "evaluation": "解説や箇条書き、適切な改行\\nを含み、最後にフォローを入れる見やすいフィードバック（最大400文字程度）"
}
`;

    const response = await aiClient.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: evaluationPrompt,
        config: { 
          temperature: 0.1,
          responseMimeType: "application/json" 
        }
    });

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
