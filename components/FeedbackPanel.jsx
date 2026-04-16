import styles from './FeedbackPanel.module.css';

export default function FeedbackPanel({ feedback }) {
  if (!feedback) return null;

  if (feedback.error) {
    return (
      <div className={`${styles.panel} ${styles.errorPanel}`}>
        <p>⚠️ {feedback.error}</p>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>
        {feedback.skippedAI ? '解答結果' : 'AI判定結果'}
      </h3>
      
      <div className={styles.section}>
        <h4 className={styles.label}>選択肢の正誤:</h4>
        <div className={feedback.isOptionCorrect ? styles.correct : styles.incorrect}>
          {feedback.isOptionCorrect ? '✅ 正解' : '❌ 不正解'}
        </div>
      </div>

      {!feedback.skippedAI && (
        <div className={styles.section}>
          <h4 className={styles.label}>理由の評価 {feedback.isEvaluating ? '' : `(${feedback.aiScore} / 100点)`}:</h4>
          {feedback.isEvaluating ? (
             <div className={styles.evaluatingState}>
               <span className={styles.spinner}></span> AIが採点基準を照らし合わせています...
             </div>
          ) : (
            <>
              <div className={styles.scoreBarContainer}>
                <div 
                  className={styles.scoreBar} 
                  style={{ width: `${feedback.aiScore}%`, background: feedback.aiScore >= 80 ? 'var(--success-color)' : feedback.aiScore >= 50 ? '#fbbf24' : 'var(--error-color)' }}
                />
              </div>
              <p className={styles.aiFeedback}>{feedback.aiEvaluation}</p>
            </>
          )}
        </div>
      )}

      {/* 解答のポイントは常に表示しても良いですが、AI判定基準と銘打っているのでスキップ時は表示を変えるか非表示に */}
      {!feedback.skippedAI && (
        <div className={styles.section}>
          <h4 className={styles.label}>解答のポイント（AI判定基準）:</h4>
          <ul className={styles.elementsList}>
            {feedback.correctElements.map((el, i) => (
              <li key={i}>{el}</li>
            ))}
          </ul>
        </div>
      )}

      {feedback.explanation && (
        <div className={styles.officialExplanation}>
          <h4 className={styles.explanationTitle}>
            💡 模範解答＆解説
          </h4>
          {feedback.explanation.title && <h5>{feedback.explanation.title}</h5>}
          {feedback.explanation.translation && (
             <div className={styles.translation}>訳：{feedback.explanation.translation}</div>
          )}
          {feedback.explanation.body && <p className={styles.explanationBody}>{feedback.explanation.body}</p>}
          {feedback.explanation.note && <div className={styles.explanationNote}>{feedback.explanation.note}</div>}
        </div>
      )}
    </div>
  );
}
