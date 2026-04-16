import { GoogleGenAI } from '@google/genai';
import fs from 'fs/promises';

const CACHE_FILE = '/tmp/criteria_cache.json';

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

      const criteriaRes = await aiClient.models.generateContent({
        model: 'gemma-4-31b-it',
        contents: criteriaPrompt,
        config: { temperature: 0.1 }
      });

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
      const transcribePrompt = `以下は生徒が文法問題の解答理由を録音した音声です。「あー」「えーと」などのフィラーを除去し、生徒が意図している解答理由を簡潔な文章で出力してください。要約されたテキストのみを出力してください。`;
      const transcribeRes = await aiClient.models.generateContent({
        model: 'gemini-3.1-flash-lite-preview',
        contents: [
          transcribePrompt,
          { inlineData: { mimeType: mimeType || 'audio/webm', data: audioData } }
        ]
      });
      transcribedText = transcribeRes.text.trim();
    }

    // ── フェーズ2-B: テキスト採点とフィードバック出力 (Gemma 4 26B) ──
    const rubricString = typeof aiCriteria === 'string'
      ? aiCriteria
      : JSON.stringify(aiCriteria, null, 2);

    const isOptionCorrect = selectedAnswer === correctAnswer;

    const evalPrompt = `あなたは受験英語の採点・指導を行うAIです。
以下の生徒の解答理由を配点基準に照らし合わせて採点し、フィードバックを生成してください。

【問題文】
${question}
【正解の選択肢】
${correctAnswer}（正誤: ${isOptionCorrect ? '正解' : '不正解'}）

【配点基準（合計100点）】
${rubricString}

【生徒の解答理由】
${transcribedText || '(理由なし)'}

【フィードバックのルール】
・100点でない場合は何が不足していたかを具体的に指摘する
・箇条書き（・）と改行で見やすくまとめる
・最後に短い励ましの言葉を添える
・厳しすぎず甘すぎないトーンで

以下のJSONのみを出力してください（Markdownタグ不要）:
{
  "score": 0〜100の整数,
  "evaluation": "改行\\nを使った見やすいフィードバック（最大400文字）"
}`;

    const evalRes = await aiClient.models.generateContent({
      model: 'gemma-4-26b-a4b-it',
      contents: evalPrompt,
      config: { temperature: 0.1, responseMimeType: 'application/json' }
    });

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
      JSON.stringify({ error: error.message || '処理中にエラーが発生しました。' }),
      { status: 500 }
    );
  }
}
