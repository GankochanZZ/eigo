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
    const prompt = `Transcribe the speech in this audio exactly as spoken in Japanese.
Only remove filler words like "えーと", "あー", "そのー", "うーん".
Do NOT rephrase, summarize, interpret, or change any words.
Output only the transcribed Japanese text, nothing else.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.1-flash-lite-preview',
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
