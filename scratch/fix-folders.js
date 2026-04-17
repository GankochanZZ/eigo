const fs = require('fs');
const path = require('path');

const categories = ['単語', '文法', '解釈', '長文'];
const baseDir = path.join(__dirname, '..', 'questions');

if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir);
}

categories.forEach(cat => {
    const dir = path.join(baseDir, cat);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        console.log(`Created: ${dir}`);
    }
});

// Create sample grammar set
const grammarSet = path.join(baseDir, '文法', '基本セット');
if (!fs.existsSync(grammarSet)) {
    fs.mkdirSync(grammarSet, { recursive: true });
}

// Copy questions.xlsx if it exists in root
const rootExcel = path.join(__dirname, '..', 'questions.xlsx');
const targetExcel = path.join(grammarSet, 'questions.xlsx');
if (fs.existsSync(rootExcel)) {
    fs.copyFileSync(rootExcel, targetExcel);
    console.log(`Copied questions.xlsx to ${targetExcel}`);
}
