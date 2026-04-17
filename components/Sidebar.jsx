import { useState, useMemo } from 'react';
import styles from './Sidebar.module.css';

export default function Sidebar({ questions, currentIndex, onSelectQuestion, isOpen, onClose }) {
  // グループ化: { "時制": [ { id: "006", originalIndex: 0 }, ... ] }
  const groupedQuestions = useMemo(() => {
    if (!questions) return {};
    return questions.reduce((acc, q, index) => {
      if (!acc[q.genre]) acc[q.genre] = [];
      acc[q.genre].push({ id: q.originalId || q.id, originalIndex: index, difficulty: q.difficulty || '' });
      return acc;
    }, {});
  }, [questions]);

  // 開閉状態の管理 (デフォルトで全て開いておくかどうかは要件次第、今回は開いておく)
  const [openGenres, setOpenGenres] = useState(
    Object.keys(groupedQuestions).reduce((acc, genre) => {
      acc[genre] = true;
      return acc;
    }, {})
  );

  const toggleGenre = (genre) => {
    setOpenGenres(prev => ({ ...prev, [genre]: !prev[genre] }));
  };

  return (
    <>
    {isOpen && <div className={styles.backdrop} onClick={onClose}></div>}
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <h2 className={styles.sidebarTitle}>問題一覧</h2>
      <div className={styles.categoryTree}>
        {Object.entries(groupedQuestions).map(([genre, qList]) => (
          <div key={genre} className={styles.genreGroup}>
            <button 
              className={styles.genreHeader} 
              onClick={() => toggleGenre(genre)}
            >
              <span className={styles.arrow}>{openGenres[genre] ? '▼' : '▶'}</span>
              <span className={styles.genreName}>{genre}</span>
              <span className={styles.countBadge}>{qList.length}</span>
            </button>
            
            {openGenres[genre] && (
              <div className={styles.questionList}>
                {qList.map((q) => (
                  <button
                    key={q.id}
                    className={`${styles.questionItem} ${currentIndex === q.originalIndex ? styles.activeQuestion : ''}`}
                    onClick={() => {
                      onSelectQuestion(q.originalIndex);
                      if (onClose) onClose();
                    }}
                  >
                    問題{q.id} {q.difficulty && <span className={styles.diffBadge} data-level={q.difficulty}>{q.difficulty}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
    </>
  );
}
