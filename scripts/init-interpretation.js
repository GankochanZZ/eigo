const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const baseDir = path.join(__dirname, '..', 'questions', '解釈', '基本セット');
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
}

const OUTPUT_PATH = path.join(baseDir, 'questions.xlsx');

const headers = [
  'id', 'genre', 'sentence', 'option1', 'option2', 'option3', 'option4',
  'correct(1-4)', 'elements(|区切り)', 'title', 'body', 'note', 'translation',
  'source(出典、省略可)', 'difficulty(A〜D、省略可)'
];

const rawData = [
  [
    'S01',
    '構文把握',
    'It is important for us to learn from our mistakes.',
    '', '', '', '', '',
    '形式主語Itの内容がto learn...であることを見抜く|for usが不定詞の意味上の主語であるとわかること',
    'S01 解答例 ▷ 形式主語構文',
    'It は形式主語で、真の主語は to learn 以下です。for us は不定詞の意味上の主語を表します。',
    'important: 重要な | learn from: 〜から学ぶ | mistake: 失敗・間違い',
    '私たちが自分たちの失敗から学ぶことは重要だ。',
    '', 'A'
  ],
  [
    'S02',
    '構文把握',
    'The book written by the famous author was very interesting.',
    '', '', '', '', '',
    'written by...がThe bookを後置修飾する過去分詞句だと見抜けること|全体の主語(The book)と動詞(was)の対応を正確に訳出すること',
    'S02 解答例 ▷ 過去分詞の後置修飾',
    'written by the famous author は過去分詞句で、前の名詞 The book を修飾しています。文全体の主語は The book、述語動詞は was です。',
    'written: 書かれた (writeの過去分詞) | famous: 有名な | author: 著者',
    'その有名な著者によって書かれた本はとても面白かった。',
    '', 'A'
  ],
  [
    'S03',
    'SVの発見',
    'The boy playing tennis in the park is my brother.',
    '', '', '', '', '',
    'playing...parkがThe boyを修飾していることを見抜く|文全体の主語(S)がThe boy、動詞(V)がisであることを把握する',
    'S03 解答例 ▷ 分詞による後置修飾',
    'playing tennis in the parkという現在分詞句が、直前の名詞The boyを修飾しています。文の主語はThe boy、述語動詞はisです。',
    'playing: 〜している | in the park: 公園で',
    '公園でテニスをしている少年は私の兄（または弟）です。',
    '', 'B'
  ],
  [
    'S04',
    'SVの発見',
    'To master a foreign language requires a lot of patience.',
    '', '', '', '', '',
    'To master...languageという不定詞の名詞用法が文の主語(S)であることを見抜く|requiresが述語動詞(V)であるとわかること',
    'S04 解答例 ▷ 不定詞の名詞用法',
    'To master a foreign languageという不定詞のカタマリが文全体の主語になっています。述語動詞はrequiresです。',
    'master: 習得する | foreign language: 外国語 | require: 必要とする | patience: 忍耐',
    '外国語を習得することは、多くの忍耐を必要とする。',
    '', 'B'
  ],
  [
    'S05',
    'SVの発見',
    'Whether we will go on a picnic tomorrow depends on the weather.',
    '', '', '', '', '',
    'Whetherが導く名詞節が文全体の主語(S)になっていることを見抜く|depends onが述語動詞(V)であるとわかること',
    'S05 解答例 ▷ 名詞節（Whether）の主語',
    'Whether ... tomorrow（明日ピクニックに行くかどうか）という名詞節が文の主語になっています。述語動詞はdependsです。',
    'whether: 〜するかどうか | go on a picnic: ピクニックに行く | depend on: 〜次第である',
    '明日ピクニックに行くかどうかは、天気次第です。',
    '', 'C'
  ],
  [
    'S06',
    'SVの発見',
    "The fact that he didn't tell the truth made her angry.",
    '', '', '', '', '',
    'that節がThe factと同格であることを理解する|文全体の主語(S)がThe fact、動詞(V)がmadeであることを見抜く',
    'S06 解答例 ▷ 同格のthatと第5文型',
    "that he didn't tell the truthはThe factの内容を説明する「同格」のthat節です。主語The factがmade(V) her(O) angry(C)という第5文型を作っています。",
    'fact: 事実 | truth: 真実 | make O C: OをCにする | angry: 怒って',
    '彼が真実を言わなかったという事実が、彼女を怒らせた。',
    '', 'C'
  ],
  [
    'S07',
    'SVの発見',
    'Not only the students but also the teacher was surprised at the news.',
    '', '', '', '', '',
    'Not only A but also Bの構文を見抜く|主語がthe teacherとなり、動詞がwasと単数呼応していることを把握する',
    'S07 解答例 ▷ 相関接続詞と主語の呼応',
    'Not only A but also B「AだけでなくBも」の構文では、動詞はBの数に一致します。ここではBがthe teacher(単数)なので、動詞はwereではなくwasになります。',
    'not only A but also B: AだけでなくBも | surprised at: 〜に驚く | news: 知らせ',
    '生徒たちだけでなく、その先生もその知らせに驚いた。',
    '', 'B'
  ]
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
  { wch: 40 },  // note
  { wch: 50 },  // translation
];

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, '問題データ');
XLSX.writeFile(wb, OUTPUT_PATH);

console.log(`✅ ${OUTPUT_PATH} を生成しました（${rawData.length}問）`);
