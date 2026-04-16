// scripts/add-columns.js
// 既存の questions.xlsx に source・difficulty 列を追加する一回限りのスクリプト
const XLSX = require('xlsx');
const path = require('path');

const FILE = path.join(__dirname, '..', 'questions.xlsx');

// 難易度マップ（問題ID => 難易度）
const difficultyMap = {
  '006':'B','007':'B','008':'C','009':'C','010':'D',
  '101':'B','102':'C','103':'C','104':'A','105':'B',
  '201':'A','202':'B','203':'A','204':'B','205':'C',
  '301':'A','302':'B','303':'B','304':'B','305':'A',
  '401':'A','402':'B','403':'B','404':'C','405':'A',
  '501':'A','502':'B','503':'C','504':'A','505':'A',
  '601':'A','602':'A','603':'B','604':'A','605':'C',
};

const wb = XLSX.readFile(FILE);
const ws = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

// ヘッダー行に追加
rows[0].push('source(出典、省略可)', 'difficulty(A〜D、省略可)');

// データ行に追加
for (let i = 1; i < rows.length; i++) {
  const id = String(rows[i][0]);
  rows[i].push('', difficultyMap[id] || '');
}

const newWs = XLSX.utils.aoa_to_sheet(rows);
// 列幅を設定
newWs['!cols'] = [
  { wch: 8 }, { wch: 10 }, { wch: 55 }, { wch: 20 }, { wch: 20 },
  { wch: 20 }, { wch: 20 }, { wch: 10 }, { wch: 60 }, { wch: 30 },
  { wch: 80 }, { wch: 30 }, { wch: 30 }, { wch: 20 }, { wch: 15 },
];

wb.Sheets[wb.SheetNames[0]] = newWs;
XLSX.writeFile(wb, FILE);
console.log('✅ source・difficulty 列を追加しました。');
