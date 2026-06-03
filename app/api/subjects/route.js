import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const questionsDir = path.join(process.cwd(), 'questions');
    
    if (!fs.existsSync(questionsDir)) {
      return NextResponse.json({ subjects: [] });
    }

    const categories = ['単語', '文法', '解釈', '長文'];
    const result = categories.map(category => {
      const categoryPath = path.join(questionsDir, category);
      let sets = [];
      
      if (fs.existsSync(categoryPath)) {
        sets = fs.readdirSync(categoryPath)
          .filter(file => fs.statSync(path.join(categoryPath, file)).isDirectory());
      }
      
      return {
        name: category,
        sets: sets
      };
    });

    return NextResponse.json({ subjects: result });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json({ error: 'Failed to fetch subjects' }, { status: 500 });
  }
}
