const { GoogleGenAI } = require('@google/genai');

async function test() {
  const activeApiKey = process.env.GEMINI_API_KEY;
  if (!activeApiKey) {
     console.log("No key"); return;
  }
  const aiClient = new GoogleGenAI({ apiKey: activeApiKey });
  const evaluationPrompt = `
あなたは、採点基準には厳密ですが、生徒を超ポジティブに褒めて伸ばす大人気の予備校講師です。
以下の【問題】と【配点基準】に従って、生徒の「回答」と「理由」を採点・評価してください。

【問題文】
If the homework is not done in a satisfactory way, you ______ again.

【正解の選択肢】
④ will have to do it

【評価・配点基準（合計100点）】
採点（点数算出）の際は、この基準に書かれた要素が理由に含まれているかを厳密にチェックし、記述されていなければ該当配点を与えずに合計点を出してください。
[
  {
    "element": "選択肢が正解であること",
    "points": 20
  },
  {
    "element": "空所がif節（副詞節）の中ではなく、主節であることに気づいていること",
    "points": 40
  },
  {
    "element": "主節なので未来形を用いること",
    "points": 40
  }
]

【生徒が選んだ選択肢】
have to be doing （正誤: 不正解）
【生徒の理由】
現在形はないが未来完了はhaveを伴い文法上セーフ

【フィードバックの構成とトーン】
1. 100点満点でない（減点された）場合は、必ず「どの基準が満たされていなかったのか（何がダメだったのか）」を \`evaluation\` フィールドの文章の冒頭で具体的に指摘・解説してください。
2. その解説に続いて、文章の後半で「モチベーションが上がる前向きなフォローの言葉」を添えてください。
3. トーンは「厳しすぎず甘すぎない」的確な指導スタイルとしてください。
4. **絶対にJSON以外のテキストは出力しないでください。** 解説も励ましもすべて \`evaluation\` の中に含めてください。

以下の2つのキーを持つJSONのみを出力してください（Markdown装飾等は不要です）。
{
  "score": 0〜100の整数,
  "evaluation": "解説から入り最後にフォローを入れるフィードバック（最大300文字以内）"
}
`;
  
  const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: evaluationPrompt,
        config: { 
          temperature: 0.1,
          responseMimeType: "application/json" 
        }
  });

  console.log("RAW TEXT:", response.text);
}
test();
