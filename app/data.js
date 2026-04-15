import styles from './page.module.css';

const tsvData = `006	時制	We'll be late unless we (　　) now.	① leave	② don't leave	③ have left	④ will leave	1	unlessが「時・条件を表す副詞節」を作るため現在形になること。|unless自体に否定の意味が含まれるためnotは不要であること。	006 正解：① ▷時・条件を表す副詞節の中では？	unlessから副詞節を作るので、現在形を選びます。unlessは「〜しない限り」という意味なので、②don't leaveのようにnotは不要です。		今出なければ遅れてしまう。
007	時制	I will return your notes as soon as (　　) copying them.	① I will finish	② I finish	③ I finished	④ my finishing	2	as soon asが「時・条件を表す副詞節」を作るため現在形になること。	007 正解：② ▷副詞節を見抜けるか？	as soon asが従属接続詞なので、副詞節を作ることに注意してください。副詞節の中なので、現在形を選びます。		コピーしたらすぐにノートを返すよ。
008	時制	If the homework is not done in a satisfactory way, you (　　) it again.	① did	② have to be doing	③ will have done	④ will have to do	4	空所がif節（副詞節）の中ではなく、主節であることに気づいていること。|主節なので未来形を用いること。	008 正解：④ ▷逆パターン（主節が狙われる）の問題	今回は副詞節ではなく「主節」が空所になっています。あくまで「副詞節の中では現在形」なので、主節は「未来のことは未来のまま」でOKです。③will have done「（宿題をやっていなければ）またやり終えるだろう」は意味が変ですね。	このようにウラをかいて「主節」も狙われます。	指示どおりのやり方で宿題をやってこなければ、やり直しになります。
009	時制	You may go home if you (　　) your report.	① finishing	② have finished	③ finished	④ will have finished	2	if節（副詞節）の中なので未来のことも現在形（または現在完了形）を用いること。	009 正解：② ▷現在形はないけど…	ifから副詞節を作ります。「現在形」を選びたいところですが、選択肢にfinishがありません。今回は「未来完了(will have finished)」の代わりに現在完了(have finished)を使えばOKです。	このパターンでは、finishとdoが狙われる！	レポートを仕上げたら、帰ってもよろしい。
010	時制	I can't tell if it (　　) tomorrow.	① will rain	② rain	③ has rained	④ rained	1	tellの目的語になっているため、if節は名詞節（〜かどうか）であると指摘していること。|名詞節の中では、未来の出来事（tomorrow）は未来形（will）を用いると指摘していること。	010 正解：① ▷名詞節を見抜けるか？	tellは他動詞です（「何を？」とツッコミが入りますね）。他動詞の後ろには「名詞」がくるので、if it ( ) tomorrow というカタマリは「名詞節」になります。<br><br>「時・条件を表す副詞節の中では現在形」なので、「名詞節」のときは普通に「未来を表す形のまま」でOKです。	ifとwhenは名詞節になることがある！	明日雨が降るかどうかわからない。`;

export const questions = tsvData.trim().split('\n').map(line => {
  const cols = line.split('\t');
  return {
    id: cols[0],
    genre: cols[1],
    // UIのパースに合わせるために (　　) を ______ に置換
    sentence: cols[2].replace(/\s*\([　 ]*\)\s*/g, ' ______ '),
    // 先頭の ①〜④ を除去
    options: [cols[3], cols[4], cols[5], cols[6]].map(opt => opt.replace(/^[①②③④]\s*/, '')),
    correctOption: parseInt(cols[7], 10) - 1,
    correctElements: cols[8].split('|'),
    explanation: {
      title: cols[9],
      body: cols[10]?.replace(/<br>/g, '\n'),
      note: cols[11],
      translation: cols[12]
    }
  };
});

export async function getQuestions() {
  return questions;
}
