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
      const transcribePrompt = `以下は生徒が文法問題の解答理由を録音した音声です。
聞こえた内容を一言一句そのまま正確に文字起こししてください。
ただし、「あー」「えーと」などの不要なフィラーのみ除去してください。
【重要】絶対に発言内容を要約したり、表現を書き換えたりしないでください。文字起こししたテキストのみを出力してください。`;
      const transcribeRes = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash-lite',
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
・音声入力による誤字や脱字について指摘することは固く禁じます
・些細な表現の違いにはこだわらず、「生徒がこの問題に必要な文法事項を本質的に理解していると判断できるか」という視点で文脈を寛容に汲み取って採点すること
・100点でない場合は何が不足していたかをしっかりと短文を重ねて具体的に指摘・解説すること
・見やすさのために適宜箇条書き（・）や改行を使用すること
・文末の励ましやフォローの言葉は一切不要（純粋に解説のみを出力する）
・的確な指導トーンで

以下のJSONのみを出力してください（Markdownタグ不要）:
{
  "score": 0〜100の整数,
  "evaluation": "基準に基づく具体的な解説（フォローの言葉は含めない。最大350文字）"
}`;

    const evalRes = await aiClient.models.generateContent({
      model: 'gemini-3.1-flash-lite-preview',
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
      JSON.stringify({ error: '音声処理エラー: ' + (error.message || '処理中にエラーが発生しました。') }),
      { status: 500 }
    );
  }
}
