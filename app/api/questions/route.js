import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

const { readFile, utils } = XLSX;

export async function POST(request) {
  try {
    const { selectedSets } = await request.json(); // Array of { category, set }

    if (!selectedSets || !Array.isArray(selectedSets)) {
      return NextResponse.json({ error: 'Invalid selection' }, { status: 400 });
    }

    const questionsDir = path.join(process.cwd(), 'questions');
    let allQuestions = [];

    for (const selection of selectedSets) {
      const { category, set } = selection;
      const excelPath = path.join(questionsDir, category, set, 'questions.xlsx');

      if (!fs.existsSync(excelPath)) {
        console.warn(`File not found: ${excelPath}`);
        continue;
      }

      const buffer = fs.readFileSync(excelPath);
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = utils.sheet_to_json(sheet, { header: 1, defval: '' });

      // 1行目はヘッダーなのでスキップ
      const dataRows = rows.slice(1).filter(row => row[0] !== '');

      const setQuestions = dataRows.map((row, index) => {
        const [id, genre, sentence, opt1, opt2, opt3, opt4, correct, elements, title, body, note, translation, source, difficulty] = row;

        // 空所表記を統一
        const normalizedSentence = String(sentence).replace(/\s*\([　 ]*\)\s*/g, ' ______ ');

        return {
          id: `${category}-${set}-${id || index}`, // 重複を避けるためのユニークID
          originalId: String(id),
          category,
          set,
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

      allQuestions = [...allQuestions, ...setQuestions];
    }

    return NextResponse.json({ questions: allQuestions });
  } catch (error) {
    console.error('Error loading questions:', error);
    return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 });
  }
}
