import { GoogleGenAI } from '@google/genai';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // 音声データ受信用
    },
  },
};

export async function POST(req) {
  try {
    const body = await req.json();
    const { audioData, mimeType, apiKey } = body;

    const activeApiKey = apiKey || process.env.GEMINI_API_KEY;

    if (!audioData || !activeApiKey) {
      return new Response(JSON.stringify({ error: 'Missing audio data or API key' }), { status: 400 });
    }

    const aiClient = new GoogleGenAI({ apiKey: activeApiKey });
    const prompt = `以下は生徒が文法問題の解答理由を吹き込んだ音声です。
聞こえた内容を一言一句そのまま正確に文字起こししてください。
ただし、「あー」「えーと」「そのー」などの不要なフィラー（言い淀み）のみ除去してください。
【重要】絶対に発言内容を要約したり、生徒が言っていない言葉を補ったり、別の表現に書き換えたりしないでください。文字起こししたテキストのみを出力してください。`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: [
        prompt,
        {
          inlineData: {
            mimeType: mimeType || 'audio/webm',
            data: audioData // Base64 エンコードされた音声
          }
        }
      ]
    });

    const transcribedText = response.text.trim();
    return new Response(JSON.stringify({ text: transcribedText }), { headers: { 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('Transcription API error:', error);
    return new Response(JSON.stringify({ error: '文字起こし失敗: ' + (error.message || error) }), { status: 500 });
  }
}
