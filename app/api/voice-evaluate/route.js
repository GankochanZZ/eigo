import { GoogleGenAI } from '@google/genai';
import fs from 'fs/promises';

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
        const delay = 1000 * Math.pow(2, attempt - 1);
        console.log(`[Retry] Attempt ${attempt} failed (${msg}). Retrying in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      throw err;
    }
  }
}

export const maxDuration = 60;

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      audioData, mimeType, apiKey,
      // 問題データ
      id, question, selectedAnswer, correctAnswer, correctElements
    } = body;

    const activeApiKey = apiKey || process.env.GEMINI_API_KEY;

    if (!activeApiKey) {
      return new Response(JSON.stringify({ error: 'APIキーが設定されていません。' }), { status: 400 });
    }

    const aiClient = new GoogleGenAI({ apiKey: activeApiKey });

    // ── フェーズ1: 採点基準キャッシュ読み込み ──
    let cache = {};
    try {
      const data = await fs.readFile(CACHE_FILE, 'utf-8');
      cache = JSON.parse(data);
    } catch (_) {}

    let aiCriteria = cache[id];

    if (!aiCriteria) {
      const elementsList = (correctElements || []).map((el, i) => `${i + 1}. ${el}`).join('\n');
      const criteriaPrompt = `あなたは優秀な予備校の英語科教務主任です。
以下の問題と解説要素をもとに、生徒の解答理由を採点するための配点基準表（合計100点）を作成してください。

【問題文】
${question}
【正解の選択肢】
${correctAnswer}
【解説要素】
${elementsList}

注意：採点項目は「選択肢が正解であること」と上記の「解説要素」のみとし、合計100点になるよう配点してください。
出力はJSON配列のみです（Markdownタグ不要）:
[
  { "element": "採点項目", "points": 20 },
  ...
]`;

      const criteriaRes = await callWithRetry(() => aiClient.models.generateContent({
        model: 'gemma-4-31b-it',
        contents: criteriaPrompt,
        config: { temperature: 0.1 }
      }));

      let textCriteria = criteriaRes.text.trim().replace(/^```json\n?/, '').replace(/```$/, '');
      try {
        aiCriteria = JSON.parse(textCriteria);
      } catch (_) {
        aiCriteria = textCriteria;
      }

      cache[id] = aiCriteria;
      await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
    }

    // ── フェーズ2-A: 音声の文字起こし (Gemini 3.1 Flash Lite) ──
    let transcribedText = '';
    if (audioData) {
      const transcribePrompt = `Transcribe the speech in this audio exactly as spoken in Japanese.\nOnly remove filler words like "えーと", "あー", "そのー", "うーん".\nDo NOT rephrase, summarize, interpret, or change any words.\nOutput only the transcribed Japanese text, nothing else.`;
      const transcribeRes = await callWithRetry(() => aiClient.models.generateContent({
        model: 'gemini-3.1-flash-lite-preview',
        contents: [
          transcribePrompt,
          { inlineData: { mimeType: mimeType || 'audio/webm', data: audioData } }
        ]
      }));
      transcribedText = transcribeRes.text.trim();
    }

    // ── フェーズ2-B: テキスト採点とフィードバック出力 (Gemma 4 26B) ──
    const rubricString = typeof aiCriteria === 'string'
      ? aiCriteria
      : JSON.stringify(aiCriteria, null, 2);

    const isOptionCorrect = selectedAnswer === correctAnswer;

    const evalPrompt = `あなたは高校の英語教師です。
以下の生徒の解答理由を配点基準に照らし合わせて採点し、フィードバックを生成してください。
なお、生徒の解答は音声入力によるもののため、多少の誤字脱字が含まれる前提で対応し、表現のブレを柔軟に解釈してください。

【問題文】
${question}
【正解の選択肢】
${correctAnswer}（正誤: ${isOptionCorrect ? '正解' : '不正解'}）

【配点基準（合計100点）】
${rubricString}

【生徒の解答理由】
${transcribedText || '(理由なし)'}

【採点とフィードバックのルール】
・生徒の理由は音声入力のため誤字・脱字が含まれている場合があります。誤字があっても自分の中で正しく読み替えた上で採点してください。誤字・脱字・表記の揺れについてフィードバックで一切言及してはなりません。
・「生徒がこの問題に必要な文法事項を本質的に理解していると判断できるか」という視点で文脈を寛容に汲み取って採点すること
・100点でない場合は何が不足していたかをしっかりと短文を重ねて具体的に指摘・解説すること
・見やすさのために適宜箇条書き（・）や改行を使用すること
・文末の励ましやフォローの言葉は一切不要（純粋に解説のみを出力する）
・的確な指導トーンで

以下のJSONのみを出力してください（Markdownタグ不要）:
{
  "score": 0〜100の整数,
  "evaluation": "基準に基づく具体的な解説（フォローの言葉は含めない。最大350文字）"
}`;

    const evalRes = await callWithRetry(() => aiClient.models.generateContent({
      model: 'gemini-3.1-flash-lite-preview',
      contents: evalPrompt,
      config: { temperature: 0.1, responseMimeType: 'application/json' }
    }));

    let text = evalRes.text.trim().replace(/^```json\n?/, '').replace(/```$/, '');
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('JSON抽出失敗: ' + text.substring(0, 80));

    const parsed = JSON.parse(match[0]);

    return new Response(JSON.stringify({
      transcribed: transcribedText,
      score: parsed.score ?? NaN,
      evaluation: parsed.evaluation || '',
      isOptionCorrect
    }), { headers: { 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('voice-evaluate error:', error);
    return new Response(
      JSON.stringify({ error: '音声処理エラー: ' + (error.message || '処理中にエラーが発生しました。') }),
      { status: 500 }
    );
  }
}
