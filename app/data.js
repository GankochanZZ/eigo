// このファイルは scripts/build-data.js によって自動生成されます。
// 問題データの編集は questions.xlsx を直接編集し、npm run generate-data を実行してください。

export const questions = [
  {
    "id": "006",
    "genre": "時制",
    "sentence": "We'll be late unless we ______ now.",
    "options": [
      "leave",
      "don't leave",
      "have left",
      "will leave"
    ],
    "correctOption": 0,
    "correctElements": [
      "unlessが「時・条件を表す副詞節」を作るため現在形になること。",
      "unless自体に否定の意味が含まれるためnotは不要であること。"
    ],
    "source": "",
    "difficulty": "B",
    "explanation": {
      "title": "006 正解：① ▷時・条件を表す副詞節の中では？",
      "body": "unlessから副詞節を作るので、現在形を選びます。unlessは「〜しない限り」という意味なので、②don't leaveのようにnotは不要です。",
      "note": "",
      "translation": "今出なければ遅れてしまう。"
    }
  },
  {
    "id": "007",
    "genre": "時制",
    "sentence": "I will return your notes as soon as ______ copying them.",
    "options": [
      "I will finish",
      "I finish",
      "I finished",
      "my finishing"
    ],
    "correctOption": 1,
    "correctElements": [
      "as soon asが「時・条件を表す副詞節」を作るため現在形になること。"
    ],
    "source": "",
    "difficulty": "B",
    "explanation": {
      "title": "007 正解：② ▷副詞節を見抜けるか？",
      "body": "as soon asが従属接続詞なので、副詞節を作ることに注意してください。副詞節の中なので、現在形を選びます。",
      "note": "",
      "translation": "コピーしたらすぐにノートを返すよ。"
    }
  },
  {
    "id": "008",
    "genre": "時制",
    "sentence": "If the homework is not done in a satisfactory way, you ______ it again.",
    "options": [
      "did",
      "have to be doing",
      "will have done",
      "will have to do"
    ],
    "correctOption": 3,
    "correctElements": [
      "空所がif節（副詞節）の中ではなく、主節であることに気づいていること。",
      "主節なので未来形を用いること。"
    ],
    "source": "",
    "difficulty": "C",
    "explanation": {
      "title": "008 正解：④ ▷逆パターン（主節が狙われる）の問題",
      "body": "今回は副詞節ではなく「主節」が空所になっています。あくまで「副詞節の中では現在形」なので、主節は「未来のことは未来のまま」でOKです。",
      "note": "このようにウラをかいて「主節」も狙われます。",
      "translation": "指示どおりのやり方で宿題をやってこなければ、やり直しになります。"
    }
  },
  {
    "id": "009",
    "genre": "時制",
    "sentence": "You may go home if you ______ your report.",
    "options": [
      "finishing",
      "have finished",
      "finished",
      "will have finished"
    ],
    "correctOption": 1,
    "correctElements": [
      "if節（副詞節）の中なので未来のことも現在形（または現在完了形）を用いること。"
    ],
    "source": "",
    "difficulty": "C",
    "explanation": {
      "title": "009 正解：② ▷現在形はないけど…",
      "body": "ifから副詞節を作ります。「現在形」を選びたいところですが、選択肢にfinishがありません。今回は「未来完了(will have finished)」の代わりに現在完了(have finished)を使えばOKです。",
      "note": "このパターンでは、finishとdoが狙われる！",
      "translation": "レポートを仕上げたら、帰ってもよろしい。"
    }
  },
  {
    "id": "010",
    "genre": "時制",
    "sentence": "I can't tell if it ______ tomorrow.",
    "options": [
      "will rain",
      "rain",
      "has rained",
      "rained"
    ],
    "correctOption": 0,
    "correctElements": [
      "tellの目的語になっているため、if節は名詞節（〜かどうか）であると指摘していること。",
      "名詞節の中では、未来の出来事（tomorrow）は未来形（will）を用いると指摘していること。"
    ],
    "source": "",
    "difficulty": "D",
    "explanation": {
      "title": "010 正解：① ▷名詞節を見抜けるか？",
      "body": "tellは他動詞です。他動詞の後ろには「名詞」がくるので、if it ( ) tomorrow というカタマリは「名詞節」になります。「時・条件を表す副詞節の中では現在形」なので、「名詞節」のときは普通に「未来を表す形のまま」でOKです。",
      "note": "ifとwhenは名詞節になることがある！",
      "translation": "明日雨が降るかどうかわからない。"
    }
  },
  {
    "id": "101",
    "genre": "助動詞",
    "sentence": "You ______ be hungry after such a long trip.",
    "options": [
      "must",
      "should",
      "can",
      "will"
    ],
    "correctOption": 0,
    "correctElements": [
      "must が「〜に違いない」という強い確信（推量）を表すこと。",
      "shouldは「〜すべき」や「〜のはず」、canは「〜できる」「〜でありうる」と意味が違うこと。"
    ],
    "source": "",
    "difficulty": "B",
    "explanation": {
      "title": "101 正解：① ▷mustの推量用法",
      "body": "mustには「〜しなければならない」という義務の意味と、「〜に違いない」という推量の意味があります。長い旅の後は空腹であることは当然と考えられるので、強い確信を表すmust（推量）が正解です。",
      "note": "mustは義務だけじゃない！推量用法を押さえよう",
      "translation": "そんなに長い旅の後では、お腹が空いているに違いない。"
    }
  },
  {
    "id": "102",
    "genre": "助動詞",
    "sentence": "She ______ have left her keys at the office, because she can't find them.",
    "options": [
      "must",
      "should",
      "may",
      "can"
    ],
    "correctOption": 0,
    "correctElements": [
      "〈must have + 過去分詞〉が「〜したに違いない」という過去の事実への強い確信を表すこと。",
      "〈may have + 過去分詞〉は「〜したかもしれない」と弱い推量になること。"
    ],
    "source": "",
    "difficulty": "C",
    "explanation": {
      "title": "102 正解：① ▷〈must have p.p.〉の用法",
      "body": "鍵が見つからないという「結果」から、過去の行動を確信をもって推測しています。〈must have + 過去分詞〉で「〜したに違いない」。〈may have + 過去分詞〉は可能性が低いニュアンスになります。",
      "note": "",
      "translation": "彼女は鍵を会社に忘れてきたに違いない、見つからないから。"
    }
  },
  {
    "id": "103",
    "genre": "助動詞",
    "sentence": "You ______ have told me earlier — I could have helped you.",
    "options": [
      "should",
      "must",
      "would",
      "might"
    ],
    "correctOption": 0,
    "correctElements": [
      "〈should have + 過去分詞〉が「〜すべきだったのに（実際にはしなかった）」という過去への後悔・非難を表すこと。"
    ],
    "source": "",
    "difficulty": "C",
    "explanation": {
      "title": "103 正解：① ▷〈should have p.p.〉の後悔用法",
      "body": "「もっと早く言ってくれれば助けられたのに」という文脈から、過去にすべきだったことへの非難・後悔を表す〈should have + 過去分詞〉が正解。mustやwouldとは意味が異なります。",
      "note": "",
      "translation": "もっと早く言ってくれればよかったのに。"
    }
  },
  {
    "id": "104",
    "genre": "助動詞",
    "sentence": " ______ you mind closing the window? It's a bit cold.",
    "options": [
      "Would",
      "Should",
      "Must",
      "Shall"
    ],
    "correctOption": 0,
    "correctElements": [
      "〈Would you mind ~ing?〉が「〜していただけませんか？」という丁寧な依頼表現であること。",
      "mind の目的語は動名詞（~ing）であること。"
    ],
    "source": "",
    "difficulty": "A",
    "explanation": {
      "title": "104 正解：① ▷丁寧な依頼表現",
      "body": "〈Would you mind ~ing?〉は「〜するのを気にしますか？」→「〜していただけますか？」という婉曲な丁寧依頼です。",
      "note": "mind の後は必ず動名詞！",
      "translation": "窓を閉めていただけますか？少し寒いです。"
    }
  },
  {
    "id": "105",
    "genre": "助動詞",
    "sentence": "The old bridge ______ not be used during the storm.",
    "options": [
      "could",
      "should",
      "would",
      "might"
    ],
    "correctOption": 1,
    "correctElements": [
      "should が「〜すべきではない」という義務・忠告を表すこと。",
      "could やmight では「〜できなかった」「〜かもしれない」となり意味にずれが生じること。"
    ],
    "source": "",
    "difficulty": "B",
    "explanation": {
      "title": "105 正解：② ▷shouldの禁止・忠告用法",
      "body": "嵐の間は橋を使うべきではない、という忠告・義務を表す文です。〈should not〉で「〜すべきではない」。couldは可能性、wouldは意志・習慣、mightは弱い推量を表し、いずれも文意に合いません。",
      "note": "",
      "translation": "嵐の間は古い橋を使うべきではない。"
    }
  },
  {
    "id": "201",
    "genre": "仮定法",
    "sentence": "If I ______ more money, I could buy that car.",
    "options": [
      "have",
      "had",
      "would have",
      "have had"
    ],
    "correctOption": 1,
    "correctElements": [
      "仮定法過去では、if節の動詞が過去形になること（現在の事実と異なる仮定）。",
      "主節は〈would/could + 動詞の原形〉になること。"
    ],
    "source": "",
    "difficulty": "A",
    "explanation": {
      "title": "201 正解：② ▷仮定法過去の基本形",
      "body": "現在もっとお金があればという、現在の事実に反する仮定なので仮定法過去を使います。If節には過去形（had）を使い、主節はcould buyとなります。①haveは直説法（現実）になってしまいます。",
      "note": "",
      "translation": "もっとお金があれば、あの車を買えるのに。"
    }
  },
  {
    "id": "202",
    "genre": "仮定法",
    "sentence": "If she ______ harder last year, she would have passed the exam.",
    "options": [
      "studied",
      "had studied",
      "studies",
      "has studied"
    ],
    "correctOption": 1,
    "correctElements": [
      "仮定法過去完了では、if節は〈had + 過去分詞〉になること（過去の事実と異なる仮定）。",
      "主節は〈would/could have + 過去分詞〉になること。"
    ],
    "source": "",
    "difficulty": "B",
    "explanation": {
      "title": "202 正解：② ▷仮定法過去完了の基本形",
      "body": "last year（昨年）と would have passed から、過去の事実に反する仮定（仮定法過去完了）だとわかります。if節は〈had + 過去分詞〉なので had studied が正解。",
      "note": "時間軸のズレが仮定法の核心！",
      "translation": "去年もっと一生懸命勉強していたら、試験に合格していただろうに。"
    }
  },
  {
    "id": "203",
    "genre": "仮定法",
    "sentence": "I wish I ______ how to play the piano.",
    "options": [
      "know",
      "knew",
      "have known",
      "will know"
    ],
    "correctOption": 1,
    "correctElements": [
      "〈I wish + 仮定法過去〉が「〜ならよいのに」という現在の事実に反する願望を表すこと。"
    ],
    "source": "",
    "difficulty": "A",
    "explanation": {
      "title": "203 正解：② ▷〈I wish〉の仮定法",
      "body": "〈I wish + 仮定法〉は現実とは違う願望を表します。現在ピアノが弾けないという事実の裏返しなので、仮定法過去（knew）を使います。know（現在形）では直説法になってしまいます。",
      "note": "I wishの後は仮定法！willは使えない",
      "translation": "ピアノの弾き方を知っていたらなあ。"
    }
  },
  {
    "id": "204",
    "genre": "仮定法",
    "sentence": "He talks as if he ______ everything about science.",
    "options": [
      "knows",
      "knew",
      "has known",
      "will know"
    ],
    "correctOption": 1,
    "correctElements": [
      "〈as if + 仮定法過去〉が「まるで〜であるかのように」という現在の事実と異なる様子を表すこと。"
    ],
    "source": "",
    "difficulty": "B",
    "explanation": {
      "title": "204 正解：② ▷〈as if〉の仮定法",
      "body": "as if は「まるで〜であるかのように」という意味で、後ろに仮定法が続きます。現在の事実（実際は全てを知っているわけではない）と異なる仮定なので、仮定法過去（knew）を使います。",
      "note": "as if / as though の後は仮定法！",
      "translation": "彼はまるで科学についてすべてを知っているかのように話す。"
    }
  },
  {
    "id": "205",
    "genre": "仮定法",
    "sentence": "Without your help, I ______ finished the project on time.",
    "options": [
      "couldn't have",
      "can't have",
      "would not",
      "would not be"
    ],
    "correctOption": 0,
    "correctElements": [
      "〈Without〜〉が〈If it had not been for〜〉と同じ意味で、仮定法過去完了の帰結節を導くこと。",
      "帰結節は〈would/could not have + 過去分詞〉になること。"
    ],
    "source": "",
    "difficulty": "C",
    "explanation": {
      "title": "205 正解：① ▷Withoutを使った仮定法過去完了",
      "body": "Without your help は「もしあなたの助けがなかったら」という過去の仮定を表します（= If it had not been for your help）。過去の仮定なので、帰結節は〈could not have + 過去分詞〉になります。",
      "note": "Without / But for は仮定法のシグナル！",
      "translation": "あなたの助けがなければ、プロジェクトを時間通りに終わらせることはできなかっただろう。"
    }
  },
  {
    "id": "301",
    "genre": "受動態",
    "sentence": "The novel ______ by millions of readers around the world.",
    "options": [
      "is loved",
      "loves",
      "is loving",
      "has been loving"
    ],
    "correctOption": 0,
    "correctElements": [
      "主語The novelは「愛される」側なので受動態〈be動詞 + 過去分詞〉になること。",
      "loveは状態動詞なので進行形にしないこと。"
    ],
    "source": "",
    "difficulty": "A",
    "explanation": {
      "title": "301 正解：① ▷基本的な受動態",
      "body": "The novel（小説）は「愛する」のではなく「愛される」対象です。受動態は〈be + 過去分詞〉なのでis lovedが正解。loveは状態を表す動詞なのでis lovingのような進行形は不自然です。",
      "note": "",
      "translation": "その小説は世界中の何百万もの読者に愛されている。"
    }
  },
  {
    "id": "302",
    "genre": "受動態",
    "sentence": "The new school ______ by the end of next year.",
    "options": [
      "will complete",
      "will be completed",
      "completes",
      "is completing"
    ],
    "correctOption": 1,
    "correctElements": [
      "主語The new schoolは「完成させられる」対象なので受動態が必要なこと。",
      "未来の受動態は〈will be + 過去分詞〉になること。"
    ],
    "source": "",
    "difficulty": "B",
    "explanation": {
      "title": "302 正解：② ▷未来の受動態",
      "body": "学校は自ら完成するのではなく、誰かによって「完成させられる」ので受動態が必要です。未来の受動態は〈will be + 過去分詞〉でwill be completedが正解。",
      "note": "未来形＋受動態 = will be + 過去分詞",
      "translation": "新しい学校は来年末までに完成するだろう。"
    }
  },
  {
    "id": "303",
    "genre": "受動態",
    "sentence": "She was given ______ by her parents for her birthday.",
    "options": [
      "a gift",
      "with a gift",
      "of a gift",
      "about a gift"
    ],
    "correctOption": 0,
    "correctElements": [
      "〈give A B〉の受動態で主語がAの場合、目的語Bはそのまま残ること（前置詞は不要）。"
    ],
    "source": "",
    "difficulty": "B",
    "explanation": {
      "title": "303 正解：① ▷第4文型の受動態",
      "body": "〈give A B〉（AにBを与える）の受動態でAが主語になった場合、Bはそのまま残ります（was given a gift）。ここでwithは不要。前置詞を入れてしまうのはよくある誤りです。",
      "note": "第4文型の受動態はBがそのまま残る！",
      "translation": "彼女は誕生日に両親からプレゼントをもらった。"
    }
  },
  {
    "id": "304",
    "genre": "受動態",
    "sentence": "The gate must ______ before midnight.",
    "options": [
      "close",
      "be closed",
      "have closed",
      "be closing"
    ],
    "correctOption": 1,
    "correctElements": [
      "助動詞+受動態は〈助動詞 + be + 過去分詞〉の形になること。"
    ],
    "source": "",
    "difficulty": "B",
    "explanation": {
      "title": "304 正解：② ▷助動詞を含む受動態",
      "body": "gates are closed（ゲートは閉められる）という受動の関係があります。助動詞がある場合の受動態は〈助動詞 + be + 過去分詞〉なので、must be closedが正解です。",
      "note": "助動詞 + be + 過去分詞 = 助動詞の受動態",
      "translation": "ゲートは夜中12時前に閉められなければならない。"
    }
  },
  {
    "id": "305",
    "genre": "受動態",
    "sentence": "English ______ in many countries as an official language.",
    "options": [
      "speaks",
      "is spoken",
      "was speaking",
      "has spoken"
    ],
    "correctOption": 1,
    "correctElements": [
      "主語Englishは「話される」対象なので受動態が必要なこと。",
      "現在の一般的事実なので現在形の受動態（is spoken）を使うこと。"
    ],
    "source": "",
    "difficulty": "A",
    "explanation": {
      "title": "305 正解：② ▷受動態の識別",
      "body": "English（英語）は自分で話すのではなく「話される」ものです。受動態の現在形は〈is/are + 過去分詞〉なので is spoken が正解。",
      "note": "",
      "translation": "英語は多くの国で公用語として話されている。"
    }
  },
  {
    "id": "401",
    "genre": "不定詞",
    "sentence": "She decided ______ abroad for further study.",
    "options": [
      "studied",
      "to study",
      "studying",
      "to studying"
    ],
    "correctOption": 1,
    "correctElements": [
      "decideは不定詞（to do）を目的語にとる動詞であること。"
    ],
    "source": "",
    "difficulty": "A",
    "explanation": {
      "title": "401 正解：② ▷不定詞を目的語にとる動詞",
      "body": "decideは〈decide to do〉の形で「〜することを決める」という意味です。studyingのような動名詞は目的語にとりません。",
      "note": "decideの後はto do！gerundはNG",
      "translation": "彼女はさらなる勉強のために海外に行くことを決めた。"
    }
  },
  {
    "id": "402",
    "genre": "不定詞",
    "sentence": "It is important ______ before making decisions.",
    "options": [
      "carefully thinking",
      "to think carefully",
      "thinking carefully",
      "think carefully"
    ],
    "correctOption": 1,
    "correctElements": [
      "〈It is + 形容詞 + to do〉の形式主語構文であること。",
      "不定詞の副詞用法（形容詞を修飾）ではなく、形式主語構文の名詞用法であること。"
    ],
    "source": "",
    "difficulty": "B",
    "explanation": {
      "title": "402 正解：② ▷形式主語構文〈It ~ to do〉",
      "body": "It is important の It は形式主語で、真の主語は後ろの不定詞句です。〈It is + 形容詞 + to do〉の形式主語構文なので、to think carefullyが正解。",
      "note": "It is ... to doは形式主語構文の基本！",
      "translation": "決断する前に慎重に考えることが大切だ。"
    }
  },
  {
    "id": "403",
    "genre": "不定詞",
    "sentence": "He was the first student ______ the answer correctly.",
    "options": [
      "who answered",
      "to answer",
      "answering",
      "has answered"
    ],
    "correctOption": 1,
    "correctElements": [
      "〈the first/last/only + 名詞 + 不定詞〉の形容詞的用法の不定詞。",
      "序数・最上級などの後の不定詞は形容詞的用法で名詞を修飾する。"
    ],
    "source": "",
    "difficulty": "B",
    "explanation": {
      "title": "403 正解：② ▷形容詞的用法の不定詞（序数との組み合わせ）",
      "body": "the first studentの後に不定詞を置いて「正解した最初の生徒」という意味を作ります。〈the first/only/last + 名詞 + to do〉はセットで覚えましょう。",
      "note": "the first to do はよく出るパターン！",
      "translation": "彼はその答えを正確に答えた最初の生徒だった。"
    }
  },
  {
    "id": "404",
    "genre": "不定詞",
    "sentence": "She grew up ______ a famous musician.",
    "options": [
      "become",
      "to become",
      "becoming",
      "became"
    ],
    "correctOption": 1,
    "correctElements": [
      "〈grow up to become〉で「成長して〜になる」という結果を表す不定詞の副詞的用法。",
      "不定詞の「結果」用法はlive to do / grow up to do などのパターンで出題される。"
    ],
    "source": "",
    "difficulty": "C",
    "explanation": {
      "title": "404 正解：② ▷結果を表す不定詞の副詞的用法",
      "body": "〈grow up to become〉は「成長して〜になった」という結果を表す不定詞の副詞的用法です。becomeだけでは主語が必要で、becomingは分詞構文・動名詞になります。",
      "note": "live to be old / grow up to be はセット暗記！",
      "translation": "彼女は成長して有名な音楽家になった。"
    }
  },
  {
    "id": "405",
    "genre": "不定詞",
    "sentence": "I have no time ______ now.",
    "options": [
      "rest",
      "to rest",
      "for resting",
      "rested"
    ],
    "correctOption": 1,
    "correctElements": [
      "〈no + 名詞 + to do〉の形で「〜する（名詞）がない」という形容詞的用法の不定詞。",
      "timeを修飾する不定詞の形容詞的用法。"
    ],
    "source": "",
    "difficulty": "A",
    "explanation": {
      "title": "405 正解：② ▷名詞を修飾する形容詞的用法",
      "body": "no time（時間がない）というtime（名詞）に不定詞のto restがつき「休む時間がない」という意味を作ります。",
      "note": "〈名詞 + to do〉で「〜する名詞」",
      "translation": "今は休む時間がない。"
    }
  },
  {
    "id": "501",
    "genre": "動名詞",
    "sentence": "He suggested ______ a new approach to the problem.",
    "options": [
      "to try",
      "trying",
      "tried",
      "to trying"
    ],
    "correctOption": 1,
    "correctElements": [
      "suggestは動名詞（〜ing）を目的語にとる動詞であること。"
    ],
    "source": "",
    "difficulty": "A",
    "explanation": {
      "title": "501 正解：② ▷動名詞を目的語にとる動詞",
      "body": "suggestは〈suggest doing〉の形で「〜することを提案する」。不定詞のto tryは目的語にできないので注意。",
      "note": "suggestの後はdoing！to doはNG",
      "translation": "彼はその問題に対する新しいアプローチを試してみることを提案した。"
    }
  },
  {
    "id": "502",
    "genre": "動名詞",
    "sentence": "I'm looking forward to ______ you again.",
    "options": [
      "see",
      "saw",
      "seeing",
      "be seeing"
    ],
    "correctOption": 2,
    "correctElements": [
      "look forward to の toは前置詞であるため、後ろには動名詞（〜ing）がくること。"
    ],
    "source": "",
    "difficulty": "B",
    "explanation": {
      "title": "502 正解：③ ▷〈look forward to doing〉",
      "body": "look forward to の to は不定詞の to ではなく前置詞です。前置詞の後ろには名詞（句）または動名詞がきます。そのため seeing（動名詞）が正解。",
      "note": "look forward to のtoは前置詞！後ろはdoing",
      "translation": "またお会いできることを楽しみにしています。"
    }
  },
  {
    "id": "503",
    "genre": "動名詞",
    "sentence": "There is no ______ what will happen in the future.",
    "options": [
      "tell",
      "told",
      "telling",
      "to tell"
    ],
    "correctOption": 2,
    "correctElements": [
      "〈There is no doing〉が「〜することは不可能だ」という慣用表現であること。"
    ],
    "source": "",
    "difficulty": "C",
    "explanation": {
      "title": "503 正解：③ ▷〈There is no doing〉の慣用表現",
      "body": "〈There is no doing〉は「〜することはできない」という意味の慣用的な否定表現です（= It is impossible to do）。",
      "note": "There is no doingは「不可能」の慣用表現！",
      "translation": "将来何が起こるかを知ることは不可能だ。"
    }
  },
  {
    "id": "504",
    "genre": "動名詞",
    "sentence": "The teacher insisted on ______ the rules strictly.",
    "options": [
      "follow",
      "followed",
      "following",
      "to follow"
    ],
    "correctOption": 2,
    "correctElements": [
      "insist on の on は前置詞のため、後ろには動名詞（〜ing）がくること。"
    ],
    "source": "",
    "difficulty": "A",
    "explanation": {
      "title": "504 正解：③ ▷前置詞の後の動名詞",
      "body": "insist on〈〜することを主張する〉のonは前置詞です。前置詞の後ろには名詞か動名詞しかとれません。followingが正解。",
      "note": "前置詞の後はdoing！ここでのonは前置詞",
      "translation": "その先生は規則を厳しく守ることを主張した。"
    }
  },
  {
    "id": "505",
    "genre": "動名詞",
    "sentence": "She admitted ______ the mistake earlier.",
    "options": [
      "making",
      "to make",
      "made",
      "make"
    ],
    "correctOption": 0,
    "correctElements": [
      "admitは動名詞（〜ing）を目的語にとる動詞であること。"
    ],
    "source": "",
    "difficulty": "A",
    "explanation": {
      "title": "505 正解：① ▷動名詞を目的語にとる動詞（admit）",
      "body": "admit（〜したことを認める）は動名詞を目的語にとる動詞です。making が正解。不定詞のto makeを続けることは文法的に誤りです。",
      "note": "admit / deny / avoid の後はdoing！",
      "translation": "彼女はもっと早くその間違いを犯したことを認めた。"
    }
  },
  {
    "id": "601",
    "genre": "分詞",
    "sentence": "The man ______ by the window is my uncle.",
    "options": [
      "stood",
      "standing",
      "to stand",
      "stands"
    ],
    "correctOption": 1,
    "correctElements": [
      "現在分詞（〜ing）が名詞を後置修飾し「〜している（男性）」という進行・状態を表すこと。"
    ],
    "source": "",
    "difficulty": "A",
    "explanation": {
      "title": "601 正解：② ▷現在分詞の後置修飾",
      "body": "〈名詞 + 現在分詞（ing）〉で「〜している名詞」という意味になります。The man standing by the window で「窓際に立っている男性」。",
      "note": "現在分詞は「〜している名詞」を作る！",
      "translation": "窓際に立っているあの男性は私のおじです。"
    }
  },
  {
    "id": "602",
    "genre": "分詞",
    "sentence": "The letter ______ in French was difficult to understand.",
    "options": [
      "writing",
      "written",
      "being written",
      "to write"
    ],
    "correctOption": 1,
    "correctElements": [
      "過去分詞（written）が名詞（letter）を後置修飾し「〜された（手紙）」という受け身の意味を表すこと。"
    ],
    "source": "",
    "difficulty": "A",
    "explanation": {
      "title": "602 正解：② ▷過去分詞の後置修飾",
      "body": "letter（手紙）はフランス語で「書かれたもの」なので、受け身の意味を持つ過去分詞writtenで後置修飾します。",
      "note": "過去分詞は「〜された名詞」を作る！",
      "translation": "フランス語で書かれた手紙は理解するのが難しかった。"
    }
  },
  {
    "id": "603",
    "genre": "分詞",
    "sentence": " ______ from the top of the hill, the city looks beautiful at night.",
    "options": [
      "Seeing",
      "Seen",
      "To see",
      "Having seen"
    ],
    "correctOption": 1,
    "correctElements": [
      "分詞構文で主語と分詞の関係が受動（町は見られる）であるため過去分詞（Seen）を使うこと。"
    ],
    "source": "",
    "difficulty": "B",
    "explanation": {
      "title": "603 正解：② ▷受動の分詞構文",
      "body": "主文の主語 the city は seen（見られる）という受け身の関係にあります。受動の意味を持つ分詞構文は〈過去分詞 + 残り〉の形なのでSeen from the topが正解。",
      "note": "分詞構文は主語と分詞の関係（能動/受動）を確認！",
      "translation": "丘の頂上から見ると、その街は夜に美しく見える。"
    }
  },
  {
    "id": "604",
    "genre": "分詞",
    "sentence": "She sat on the bench, ______ a book.",
    "options": [
      "read",
      "was reading",
      "reading",
      "to read"
    ],
    "correctOption": 2,
    "correctElements": [
      "分詞構文（現在分詞）が付帯状況「〜しながら」を表すこと。",
      "主語sheとreadingの関係が能動（彼女が読む）であること。"
    ],
    "source": "",
    "difficulty": "A",
    "explanation": {
      "title": "604 正解：③ ▷付帯状況の分詞構文",
      "body": "She sat on the bench という主文に、reading a bookという現在分詞句が付帯状況（〜しながら）として付いています。",
      "note": "分詞構文の付帯状況：〜しながら",
      "translation": "彼女はベンチに座って本を読んでいた。"
    }
  },
  {
    "id": "605",
    "genre": "分詞",
    "sentence": " ______ all the evidence, the jury found the defendant not guilty.",
    "options": [
      "Considered",
      "Considering",
      "To consider",
      "Having considered"
    ],
    "correctOption": 1,
    "correctElements": [
      "〈Considering〜〉が「〜を考慮すると」という慣用的な分詞構文（独立した意味を持つ）であること。"
    ],
    "source": "",
    "difficulty": "C",
    "explanation": {
      "title": "605 正解：② ▷慣用的な分詞構文（Considering）",
      "body": "Considering all the evidence は「すべての証拠を考慮すると」という意味の慣用句的な分詞構文です。",
      "note": "Considering〜は「〜を考慮すると」の慣用表現",
      "translation": "すべての証拠を考慮すると、陪審員は被告を無罪とした。"
    }
  }
];

export async function getQuestions() {
  return questions;
}
