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
聞こえた内容から「あー」「えーと」「そのー」などの不要なフィラー（言い淀み）や不要な繰り返しを排除し、
生徒が意図している解答理由を簡潔かつ綺麗な文章に要約（クリーンアップ）して出力してください。
装飾や「要約すると」などの前置きは一切不要で、要約された理由のテキストのみを出力してください。`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-live-2.5-flash-native-audio',
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
