import styles from './QuestionCard.module.css';

export default function QuestionCard({ question, selectedOption, onSelectOption }) {
  if (!question) return null;

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
    </div>
  );
}
