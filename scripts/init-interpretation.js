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
