/**
 * scripts/build-data.js
 * Excel (questions.xlsx) を読み込んで app/data.js を自動生成するスクリプト。
 *
 * Excelの列構成（1行目はヘッダー、2行目以降がデータ）:
 * A: id          - 問題番号 (例: 101)
 * B: genre       - カテゴリ (例: 仮定法)
 * C: sentence    - 問題文  (空所は (　　) で記述)
 * D: option1     - 選択肢①
 * E: option2     - 選択肢②
 * F: option3     - 選択肢③
 * G: option4     - 選択肢④
 * H: correct     - 正解番号 (1〜4)
 * I: elements    - 採点基準 (複数ある場合は | で区切る)
 * J: title       - 解説タイトル
 * K: body        - 解説本文
 * L: note        - 補足メモ (省略可)
 * M: translation - 日本語訳 (省略可)
 * N: source      - 出典（大学名など、省略可）
 * O: difficulty  - 難易度（A/B/C/D、省略可）
 *
 * 使い方: node scripts/build-data.js
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const EXCEL_PATH = path.join(__dirname, '..', 'questions.xlsx');
const OUTPUT_PATH = path.join(__dirname, '..', 'app', 'data.js');

if (!fs.existsSync(EXCEL_PATH)) {
  console.error('❌ questions.xlsx が見つかりません。プロジェクトルートに置いてください。');
  process.exit(1);
}

const workbook = XLSX.readFile(EXCEL_PATH);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

// 1行目はヘッダーなのでスキップ
const dataRows = rows.slice(1).filter(row => row[0] !== '');

const questions = dataRows.map(row => {
  const [id, genre, sentence, opt1, opt2, opt3, opt4, correct, elements, title, body, note, translation, source, difficulty] = row;

  // 空所表記を統一
  const normalizedSentence = String(sentence).replace(/\s*\([　 ]*\)\s*/g, ' ______ ');

  return {
    id: String(id),
    genre: String(genre),
    sentence: normalizedSentence,
    options: [opt1, opt2, opt3, opt4].map(o => String(o).replace(/^[①②③④]\s*/, '')),
    correctOption: parseInt(correct, 10) - 1,
    correctElements: String(elements).split('|'),
    source: String(source || ''),
    difficulty: String(difficulty || ''),
    explanation: {
      title: String(title || ''),
      body: String(body || '').replace(/<br>/g, '\n'),
      note: String(note || ''),
      translation: String(translation || ''),
    },
  };
});

const outputContent = `// このファイルは scripts/build-data.js によって自動生成されます。
// 問題データの編集は questions.xlsx を直接編集し、npm run generate-data を実行してください。

export const questions = ${JSON.stringify(questions, null, 2)};

export async function getQuestions() {
  return questions;
}
`;

fs.writeFileSync(OUTPUT_PATH, outputContent, 'utf-8');
console.log(`✅ ${questions.length}問を app/data.js に書き出しました。`);
