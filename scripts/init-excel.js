/**
 * scripts/init-excel.js
 * 現在の app/data.js の内容を読み出して questions.xlsx を初回生成するスクリプト。
 * 一度だけ実行すれば OK。以降は questions.xlsx を直接Excelで編集してください。
 *
 * 使い方: node scripts/init-excel.js
 */

const XLSX = require('xlsx');
const path = require('path');

const OUTPUT_PATH = path.join(__dirname, '..', 'questions.xlsx');

const headers = [
  'id', 'genre', 'sentence', 'option1', 'option2', 'option3', 'option4',
  'correct(1-4)', 'elements(|区切り)', 'title', 'body', 'note', 'translation'
];

// 現在のデータを直接埋め込む（既存data.jsから移植）
const rawData = [
  ['006','時制','We\'ll be late unless we (　　) now.','leave','don\'t leave','have left','will leave',1,'unlessが「時・条件を表す副詞節」を作るため現在形になること。|unless自体に否定の意味が含まれるためnotは不要であること。','006 正解：① ▷時・条件を表す副詞節の中では？','unlessから副詞節を作るので、現在形を選びます。unlessは「〜しない限り」という意味なので、②don\'t leaveのようにnotは不要です。','','今出なければ遅れてしまう。'],
  ['007','時制','I will return your notes as soon as (　　) copying them.','I will finish','I finish','I finished','my finishing',2,'as soon asが「時・条件を表す副詞節」を作るため現在形になること。','007 正解：② ▷副詞節を見抜けるか？','as soon asが従属接続詞なので、副詞節を作ることに注意してください。副詞節の中なので、現在形を選びます。','','コピーしたらすぐにノートを返すよ。'],
  ['008','時制','If the homework is not done in a satisfactory way, you (　　) it again.','did','have to be doing','will have done','will have to do',4,'空所がif節（副詞節）の中ではなく、主節であることに気づいていること。|主節なので未来形を用いること。','008 正解：④ ▷逆パターン（主節が狙われる）の問題','今回は副詞節ではなく「主節」が空所になっています。あくまで「副詞節の中では現在形」なので、主節は「未来のことは未来のまま」でOKです。','このようにウラをかいて「主節」も狙われます。','指示どおりのやり方で宿題をやってこなければ、やり直しになります。'],
  ['009','時制','You may go home if you (　　) your report.','finishing','have finished','finished','will have finished',2,'if節（副詞節）の中なので未来のことも現在形（または現在完了形）を用いること。','009 正解：② ▷現在形はないけど…','ifから副詞節を作ります。「現在形」を選びたいところですが、選択肢にfinishがありません。今回は「未来完了(will have finished)」の代わりに現在完了(have finished)を使えばOKです。','このパターンでは、finishとdoが狙われる！','レポートを仕上げたら、帰ってもよろしい。'],
  ['010','時制','I can\'t tell if it (　　) tomorrow.','will rain','rain','has rained','rained',1,'tellの目的語になっているため、if節は名詞節（〜かどうか）であると指摘していること。|名詞節の中では、未来の出来事（tomorrow）は未来形（will）を用いると指摘していること。','010 正解：① ▷名詞節を見抜けるか？','tellは他動詞です。他動詞の後ろには「名詞」がくるので、if it ( ) tomorrow というカタマリは「名詞節」になります。「時・条件を表す副詞節の中では現在形」なので、「名詞節」のときは普通に「未来を表す形のまま」でOKです。','ifとwhenは名詞節になることがある！','明日雨が降るかどうかわからない。'],
  ['101','助動詞','You (　　) be hungry after such a long trip.','must','should','can','will',1,'must が「〜に違いない」という強い確信（推量）を表すこと。|shouldは「〜すべき」や「〜のはず」、canは「〜できる」「〜でありうる」と意味が違うこと。','101 正解：① ▷mustの推量用法','mustには「〜しなければならない」という義務の意味と、「〜に違いない」という推量の意味があります。長い旅の後は空腹であることは当然と考えられるので、強い確信を表すmust（推量）が正解です。','mustは義務だけじゃない！推量用法を押さえよう','そんなに長い旅の後では、お腹が空いているに違いない。'],
  ['102','助動詞','She (　　) have left her keys at the office, because she can\'t find them.','must','should','may','can',1,'〈must have + 過去分詞〉が「〜したに違いない」という過去の事実への強い確信を表すこと。|〈may have + 過去分詞〉は「〜したかもしれない」と弱い推量になること。','102 正解：① ▷〈must have p.p.〉の用法','鍵が見つからないという「結果」から、過去の行動を確信をもって推測しています。〈must have + 過去分詞〉で「〜したに違いない」。〈may have + 過去分詞〉は可能性が低いニュアンスになります。','','彼女は鍵を会社に忘れてきたに違いない、見つからないから。'],
  ['103','助動詞','You (　　) have told me earlier — I could have helped you.','should','must','would','might',1,'〈should have + 過去分詞〉が「〜すべきだったのに（実際にはしなかった）」という過去への後悔・非難を表すこと。','103 正解：① ▷〈should have p.p.〉の後悔用法','「もっと早く言ってくれれば助けられたのに」という文脈から、過去にすべきだったことへの非難・後悔を表す〈should have + 過去分詞〉が正解。mustやwouldとは意味が異なります。','','もっと早く言ってくれればよかったのに。'],
  ['104','助動詞','(　　) you mind closing the window? It\'s a bit cold.','Would','Should','Must','Shall',1,'〈Would you mind ~ing?〉が「〜していただけませんか？」という丁寧な依頼表現であること。|mind の目的語は動名詞（~ing）であること。','104 正解：① ▷丁寧な依頼表現','〈Would you mind ~ing?〉は「〜するのを気にしますか？」→「〜していただけますか？」という婉曲な丁寧依頼です。','mind の後は必ず動名詞！','窓を閉めていただけますか？少し寒いです。'],
  ['105','助動詞','The old bridge (　　) not be used during the storm.','could','should','would','might',2,'should が「〜すべきではない」という義務・忠告を表すこと。|could やmight では「〜できなかった」「〜かもしれない」となり意味にずれが生じること。','105 正解：② ▷shouldの禁止・忠告用法','嵐の間は橋を使うべきではない、という忠告・義務を表す文です。〈should not〉で「〜すべきではない」。couldは可能性、wouldは意志・習慣、mightは弱い推量を表し、いずれも文意に合いません。','','嵐の間は古い橋を使うべきではない。'],
  ['201','仮定法','If I (　　) more money, I could buy that car.','have','had','would have','have had',2,'仮定法過去では、if節の動詞が過去形になること（現在の事実と異なる仮定）。|主節は〈would/could + 動詞の原形〉になること。','201 正解：② ▷仮定法過去の基本形','現在もっとお金があればという、現在の事実に反する仮定なので仮定法過去を使います。If節には過去形（had）を使い、主節はcould buyとなります。①haveは直説法（現実）になってしまいます。','','もっとお金があれば、あの車を買えるのに。'],
  ['202','仮定法','If she (　　) harder last year, she would have passed the exam.','studied','had studied','studies','has studied',2,'仮定法過去完了では、if節は〈had + 過去分詞〉になること（過去の事実と異なる仮定）。|主節は〈would/could have + 過去分詞〉になること。','202 正解：② ▷仮定法過去完了の基本形','last year（昨年）と would have passed から、過去の事実に反する仮定（仮定法過去完了）だとわかります。if節は〈had + 過去分詞〉なので had studied が正解。','時間軸のズレが仮定法の核心！','去年もっと一生懸命勉強していたら、試験に合格していただろうに。'],
  ['203','仮定法','I wish I (　　) how to play the piano.','know','knew','have known','will know',2,'〈I wish + 仮定法過去〉が「〜ならよいのに」という現在の事実に反する願望を表すこと。','203 正解：② ▷〈I wish〉の仮定法','〈I wish + 仮定法〉は現実とは違う願望を表します。現在ピアノが弾けないという事実の裏返しなので、仮定法過去（knew）を使います。know（現在形）では直説法になってしまいます。','I wishの後は仮定法！willは使えない','ピアノの弾き方を知っていたらなあ。'],
  ['204','仮定法','He talks as if he (　　) everything about science.','knows','knew','has known','will know',2,'〈as if + 仮定法過去〉が「まるで〜であるかのように」という現在の事実と異なる様子を表すこと。','204 正解：② ▷〈as if〉の仮定法','as if は「まるで〜であるかのように」という意味で、後ろに仮定法が続きます。現在の事実（実際は全てを知っているわけではない）と異なる仮定なので、仮定法過去（knew）を使います。','as if / as though の後は仮定法！','彼はまるで科学についてすべてを知っているかのように話す。'],
  ['205','仮定法','Without your help, I (　　) finished the project on time.','couldn\'t have','can\'t have','would not','would not be',1,'〈Without〜〉が〈If it had not been for〜〉と同じ意味で、仮定法過去完了の帰結節を導くこと。|帰結節は〈would/could not have + 過去分詞〉になること。','205 正解：① ▷Withoutを使った仮定法過去完了','Without your help は「もしあなたの助けがなかったら」という過去の仮定を表します（= If it had not been for your help）。過去の仮定なので、帰結節は〈could not have + 過去分詞〉になります。','Without / But for は仮定法のシグナル！','あなたの助けがなければ、プロジェクトを時間通りに終わらせることはできなかっただろう。'],
  ['301','受動態','The novel (　　) by millions of readers around the world.','is loved','loves','is loving','has been loving',1,'主語The novelは「愛される」側なので受動態〈be動詞 + 過去分詞〉になること。|loveは状態動詞なので進行形にしないこと。','301 正解：① ▷基本的な受動態','The novel（小説）は「愛する」のではなく「愛される」対象です。受動態は〈be + 過去分詞〉なのでis lovedが正解。loveは状態を表す動詞なのでis lovingのような進行形は不自然です。','','その小説は世界中の何百万もの読者に愛されている。'],
  ['302','受動態','The new school (　　) by the end of next year.','will complete','will be completed','completes','is completing',2,'主語The new schoolは「完成させられる」対象なので受動態が必要なこと。|未来の受動態は〈will be + 過去分詞〉になること。','302 正解：② ▷未来の受動態','学校は自ら完成するのではなく、誰かによって「完成させられる」ので受動態が必要です。未来の受動態は〈will be + 過去分詞〉でwill be completedが正解。','未来形＋受動態 = will be + 過去分詞','新しい学校は来年末までに完成するだろう。'],
  ['303','受動態','She was given (　　) by her parents for her birthday.','a gift','with a gift','of a gift','about a gift',1,'〈give A B〉の受動態で主語がAの場合、目的語Bはそのまま残ること（前置詞は不要）。','303 正解：① ▷第4文型の受動態','〈give A B〉（AにBを与える）の受動態でAが主語になった場合、Bはそのまま残ります（was given a gift）。ここでwithは不要。前置詞を入れてしまうのはよくある誤りです。','第4文型の受動態はBがそのまま残る！','彼女は誕生日に両親からプレゼントをもらった。'],
  ['304','受動態','The gate must (　　) before midnight.','close','be closed','have closed','be closing',2,'助動詞+受動態は〈助動詞 + be + 過去分詞〉の形になること。','304 正解：② ▷助動詞を含む受動態','gates are closed（ゲートは閉められる）という受動の関係があります。助動詞がある場合の受動態は〈助動詞 + be + 過去分詞〉なので、must be closedが正解です。','助動詞 + be + 過去分詞 = 助動詞の受動態','ゲートは夜中12時前に閉められなければならない。'],
  ['305','受動態','English (　　) in many countries as an official language.','speaks','is spoken','was speaking','has spoken',2,'主語Englishは「話される」対象なので受動態が必要なこと。|現在の一般的事実なので現在形の受動態（is spoken）を使うこと。','305 正解：② ▷受動態の識別','English（英語）は自分で話すのではなく「話される」ものです。受動態の現在形は〈is/are + 過去分詞〉なので is spoken が正解。','','英語は多くの国で公用語として話されている。'],
  ['401','不定詞','She decided (　　) abroad for further study.','studied','to study','studying','to studying',2,'decideは不定詞（to do）を目的語にとる動詞であること。','401 正解：② ▷不定詞を目的語にとる動詞','decideは〈decide to do〉の形で「〜することを決める」という意味です。studyingのような動名詞は目的語にとりません。','decideの後はto do！gerundはNG','彼女はさらなる勉強のために海外に行くことを決めた。'],
  ['402','不定詞','It is important (　　) before making decisions.','carefully thinking','to think carefully','thinking carefully','think carefully',2,'〈It is + 形容詞 + to do〉の形式主語構文であること。|不定詞の副詞用法（形容詞を修飾）ではなく、形式主語構文の名詞用法であること。','402 正解：② ▷形式主語構文〈It ~ to do〉','It is important の It は形式主語で、真の主語は後ろの不定詞句です。〈It is + 形容詞 + to do〉の形式主語構文なので、to think carefullyが正解。','It is ... to doは形式主語構文の基本！','決断する前に慎重に考えることが大切だ。'],
  ['403','不定詞','He was the first student (　　) the answer correctly.','who answered','to answer','answering','has answered',2,'〈the first/last/only + 名詞 + 不定詞〉の形容詞的用法の不定詞。|序数・最上級などの後の不定詞は形容詞的用法で名詞を修飾する。','403 正解：② ▷形容詞的用法の不定詞（序数との組み合わせ）','the first studentの後に不定詞を置いて「正解した最初の生徒」という意味を作ります。〈the first/only/last + 名詞 + to do〉はセットで覚えましょう。','the first to do はよく出るパターン！','彼はその答えを正確に答えた最初の生徒だった。'],
  ['404','不定詞','She grew up (　　) a famous musician.','become','to become','becoming','became',2,'〈grow up to become〉で「成長して〜になる」という結果を表す不定詞の副詞的用法。|不定詞の「結果」用法はlive to do / grow up to do などのパターンで出題される。','404 正解：② ▷結果を表す不定詞の副詞的用法','〈grow up to become〉は「成長して〜になった」という結果を表す不定詞の副詞的用法です。becomeだけでは主語が必要で、becomingは分詞構文・動名詞になります。','live to be old / grow up to be はセット暗記！','彼女は成長して有名な音楽家になった。'],
  ['405','不定詞','I have no time (　　) now.','rest','to rest','for resting','rested',2,'〈no + 名詞 + to do〉の形で「〜する（名詞）がない」という形容詞的用法の不定詞。|timeを修飾する不定詞の形容詞的用法。','405 正解：② ▷名詞を修飾する形容詞的用法','no time（時間がない）というtime（名詞）に不定詞のto restがつき「休む時間がない」という意味を作ります。','〈名詞 + to do〉で「〜する名詞」','今は休む時間がない。'],
  ['501','動名詞','He suggested (　　) a new approach to the problem.','to try','trying','tried','to trying',2,'suggestは動名詞（〜ing）を目的語にとる動詞であること。','501 正解：② ▷動名詞を目的語にとる動詞','suggestは〈suggest doing〉の形で「〜することを提案する」。不定詞のto tryは目的語にできないので注意。','suggestの後はdoing！to doはNG','彼はその問題に対する新しいアプローチを試してみることを提案した。'],
  ['502','動名詞','I\'m looking forward to (　　) you again.','see','saw','seeing','be seeing',3,'look forward to の toは前置詞であるため、後ろには動名詞（〜ing）がくること。','502 正解：③ ▷〈look forward to doing〉','look forward to の to は不定詞の to ではなく前置詞です。前置詞の後ろには名詞（句）または動名詞がきます。そのため seeing（動名詞）が正解。','look forward to のtoは前置詞！後ろはdoing','またお会いできることを楽しみにしています。'],
  ['503','動名詞','There is no (　　) what will happen in the future.','tell','told','telling','to tell',3,'〈There is no doing〉が「〜することは不可能だ」という慣用表現であること。','503 正解：③ ▷〈There is no doing〉の慣用表現','〈There is no doing〉は「〜することはできない」という意味の慣用的な否定表現です（= It is impossible to do）。','There is no doingは「不可能」の慣用表現！','将来何が起こるかを知ることは不可能だ。'],
  ['504','動名詞','The teacher insisted on (　　) the rules strictly.','follow','followed','following','to follow',3,'insist on の on は前置詞のため、後ろには動名詞（〜ing）がくること。','504 正解：③ ▷前置詞の後の動名詞','insist on〈〜することを主張する〉のonは前置詞です。前置詞の後ろには名詞か動名詞しかとれません。followingが正解。','前置詞の後はdoing！ここでのonは前置詞','その先生は規則を厳しく守ることを主張した。'],
  ['505','動名詞','She admitted (　　) the mistake earlier.','making','to make','made','make',1,'admitは動名詞（〜ing）を目的語にとる動詞であること。','505 正解：① ▷動名詞を目的語にとる動詞（admit）','admit（〜したことを認める）は動名詞を目的語にとる動詞です。making が正解。不定詞のto makeを続けることは文法的に誤りです。','admit / deny / avoid の後はdoing！','彼女はもっと早くその間違いを犯したことを認めた。'],
  ['601','分詞','The man (　　) by the window is my uncle.','stood','standing','to stand','stands',2,'現在分詞（〜ing）が名詞を後置修飾し「〜している（男性）」という進行・状態を表すこと。','601 正解：② ▷現在分詞の後置修飾','〈名詞 + 現在分詞（ing）〉で「〜している名詞」という意味になります。The man standing by the window で「窓際に立っている男性」。','現在分詞は「〜している名詞」を作る！','窓際に立っているあの男性は私のおじです。'],
  ['602','分詞','The letter (　　) in French was difficult to understand.','writing','written','being written','to write',2,'過去分詞（written）が名詞（letter）を後置修飾し「〜された（手紙）」という受け身の意味を表すこと。','602 正解：② ▷過去分詞の後置修飾','letter（手紙）はフランス語で「書かれたもの」なので、受け身の意味を持つ過去分詞writtenで後置修飾します。','過去分詞は「〜された名詞」を作る！','フランス語で書かれた手紙は理解するのが難しかった。'],
  ['603','分詞','(　　) from the top of the hill, the city looks beautiful at night.','Seeing','Seen','To see','Having seen',2,'分詞構文で主語と分詞の関係が受動（町は見られる）であるため過去分詞（Seen）を使うこと。','603 正解：② ▷受動の分詞構文','主文の主語 the city は seen（見られる）という受け身の関係にあります。受動の意味を持つ分詞構文は〈過去分詞 + 残り〉の形なのでSeen from the topが正解。','分詞構文は主語と分詞の関係（能動/受動）を確認！','丘の頂上から見ると、その街は夜に美しく見える。'],
  ['604','分詞','She sat on the bench, (　　) a book.','read','was reading','reading','to read',3,'分詞構文（現在分詞）が付帯状況「〜しながら」を表すこと。|主語sheとreadingの関係が能動（彼女が読む）であること。','604 正解：③ ▷付帯状況の分詞構文','She sat on the bench という主文に、reading a bookという現在分詞句が付帯状況（〜しながら）として付いています。','分詞構文の付帯状況：〜しながら','彼女はベンチに座って本を読んでいた。'],
  ['605','分詞','(　　) all the evidence, the jury found the defendant not guilty.','Considered','Considering','To consider','Having considered',2,'〈Considering〜〉が「〜を考慮すると」という慣用的な分詞構文（独立した意味を持つ）であること。','605 正解：② ▷慣用的な分詞構文（Considering）','Considering all the evidence は「すべての証拠を考慮すると」という意味の慣用句的な分詞構文です。','Considering〜は「〜を考慮すると」の慣用表現','すべての証拠を考慮すると、陪審員は被告を無罪とした。'],
];

const wsData = [headers, ...rawData];
const ws = XLSX.utils.aoa_to_sheet(wsData);

// 列幅の設定
ws['!cols'] = [
  { wch: 8 },   // id
  { wch: 10 },  // genre
  { wch: 55 },  // sentence
  { wch: 20 },  // option1
  { wch: 20 },  // option2
  { wch: 20 },  // option3
  { wch: 20 },  // option4
  { wch: 10 },  // correct
  { wch: 60 },  // elements
  { wch: 30 },  // title
  { wch: 80 },  // body
  { wch: 30 },  // note
  { wch: 30 },  // translation
];

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, '問題データ');
XLSX.writeFile(wb, OUTPUT_PATH);

console.log(`✅ questions.xlsx を生成しました（${rawData.length}問）`);
console.log('📝 以後は questions.xlsx を直接Excelで編集し、npm run generate-data を実行してください。');
