import { useState } from 'react';
import styles from './QuestionCard.module.css';
import MarkerText from './MarkerText';

export default function QuestionCard({ question, selectedOption, onSelectOption }) {
  const [showHint, setShowHint] = useState(false);

  if (!question) return null;

  const isInterpretation = question.category === '解釈' || (question.options && question.options.every(o => !o));

  // ヒントのパース (noteが "word: meaning | word2: meaning2" の形式の場合)
  const hints = question.explanation?.note ? question.explanation.note.split('|').map(s => s.trim()).filter(Boolean) : [];

  return (
    <div className={styles.card}>
      <div className={styles.questionMeta}>
        <h2 className={styles.questionNumber}>問題 {question.id}</h2>
        <div className={styles.metaTags}>
          {question.difficulty && (
            <span className={styles.diffBadge} data-level={question.difficulty}>
              難易度 {question.difficulty}
            </span>
          )}
          {question.source && (
            <span className={styles.sourceBadge}>📌 {question.source}</span>
          )}
        </div>
      </div>
      
      {isInterpretation ? (
        <>
          <MarkerText text={question.sentence} />
          {hints.length > 0 && (
            <div className={styles.hintContainer}>
              <button 
                className={styles.hintBtn}
                onClick={() => setShowHint(!showHint)}
              >
                💡 単語ヒントを{showHint ? '隠す' : '見る'}
              </button>
              {showHint && (
                <ul className={styles.hintList}>
                  {hints.map((hint, i) => <li key={i}>{hint}</li>)}
                </ul>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          <p className={styles.sentence}>
            {question.sentence.split('______').map((part, index, array) => (
              <span key={index}>
                {part}
                {index < array.length - 1 && <span className={styles.blank}>______</span>}
              </span>
            ))}
          </p>

          <div className={styles.optionsContainer}>
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                className={`${styles.optionBtn} ${selectedOption === idx ? styles.selected : ''}`}
                onClick={() => onSelectOption(idx)}
              >
                <span className={styles.optionIndex}>{idx + 1}</span>
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
