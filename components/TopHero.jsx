import { useState, useEffect } from 'react';
import styles from './TopHero.module.css';

const ICON_MAP = {
  '単語': '🔤',
  '文法': '📝',
  '解釈': '🔍',
  '長文': '📄'
};

export default function TopHero({ setAppMode, showConfig, setShowConfig, apiKey, handleApiKeyChange, onLoadQuestions }) {
  const [subjects, setSubjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSets, setSelectedSets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const res = await fetch('/api/subjects');
        const data = await res.json();
        if (data.subjects) {
          setSubjects(data.subjects);
        }
      } catch (err) {
        console.error('Failed to load subjects:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSubjects();
  }, []);

  const handleCategoryClick = (category) => {
    if (category.sets.length === 0) return;
    setSelectedCategory(category);
    setSelectedSets([category.sets[0]]); // デフォルトで最初のセットを選択
  };

  const toggleSet = (setName) => {
    if (selectedSets.includes(setName)) {
      if (selectedSets.length > 1) {
        setSelectedSets(selectedSets.filter(s => s !== setName));
      }
    } else {
      setSelectedSets([...selectedSets, setName]);
    }
  };

  const handleStart = async (mode) => {
    const selection = selectedSets.map(setName => ({
      category: selectedCategory.name,
      set: setName
    }));
    await onLoadQuestions(selection);
    setAppMode(mode);
  };

  return (
    <div className={styles.page}>

      {/* Config Modal */}
      {showConfig && (
        <div className={styles.modalOverlay} onClick={() => setShowConfig(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>⚙️ APIキー設定</h3>
            <p className={styles.modalDesc}>
              Gemini APIキーを入力するとAI採点・音声入力が使えます。キーはこのブラウザにのみ保存されます。
            </p>
            <input
              type="password"
              className={styles.modalInput}
              value={apiKey}
              onChange={handleApiKeyChange}
              placeholder="AIzaSy..."
            />
            <p className={styles.modalHint}>※未入力の場合はデモ判定モードになります。</p>
            <button className={styles.modalClose} onClick={() => setShowConfig(false)}>
              閉じる
            </button>
          </div>
        </div>
      )}

      {/* Set Selection Modal */}
      {selectedCategory && (
        <div className={styles.modalOverlay} onClick={() => setSelectedCategory(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>{ICON_MAP[selectedCategory.name]} {selectedCategory.name}：セットを選択</h3>
            <p className={styles.modalDesc}>
              学習したい問題セットを選んでください（複数選択可）。
            </p>
            
            <div className={styles.setGrid}>
              {selectedCategory.sets.map(setName => (
                <div 
                  key={setName} 
                  className={`${styles.setItem} ${selectedSets.includes(setName) ? styles.setItemActive : ''}`}
                  onClick={() => toggleSet(setName)}
                >
                  <input 
                    type="checkbox" 
                    className={styles.setCheckbox} 
                    checked={selectedSets.includes(setName)}
                    onChange={() => {}} // onClickで制御
                  />
                  <span className={styles.setName}>{setName}</span>
                </div>
              ))}
            </div>

            <div className={styles.setActions}>
              <button className={styles.cancelBtn} onClick={() => setSelectedCategory(null)}>
                キャンセル
              </button>
              <button 
                className={styles.startBtn} 
                onClick={() => handleStart('practice')}
                disabled={selectedSets.length === 0}
              >
                学習開始
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={styles.header}>
        <span className={styles.logo}>📖</span>
        <span className={styles.logoText}>鑑真英語</span>
        <button className={styles.settingsBtn} onClick={() => setShowConfig(true)}>
          ⚙️ API設定
        </button>
      </header>

      {/* Hero */}
      <main className={styles.hero}>
        <div className={styles.badge}>AI × 鑑真英語</div>
        <h1 className={styles.title}>
          暗記に頼らない<br />
          <span className={styles.titleAccent}>新しい英語の学び方</span>
        </h1>
        <p className={styles.desc}>
          単語・文法・解釈・長文をAIと一緒に学ぼう。<br />
          「なぜ」を説明することで、本物の英語力が身につく。
        </p>

        {/* Subject Cards */}
        <div className={styles.subjectGrid}>
          {loading ? (
            <div style={{ color: 'white', gridColumn: 'span 2' }}>読み込み中...</div>
          ) : (
            subjects.map(subject => {
              const isActive = subject.sets.length > 0;
              return (
                <div 
                  key={subject.name}
                  className={isActive ? styles.subjectCardActive : styles.subjectCardLocked}
                  onClick={() => isActive && handleCategoryClick(subject)}
                  style={{ cursor: isActive ? 'pointer' : 'default' }}
                >
                  <span className={styles.subjectIcon}>{ICON_MAP[subject.name]}</span>
                  <div className={styles.subjectName}>{subject.name}</div>
                  {!isActive && <div className={styles.comingSoon}>近日公開</div>}
                  {isActive && (
                    <div className={styles.comingSoon} style={{ background: 'rgba(99,102,241,0.4)', color: 'white' }}>
                      {subject.sets.length} セット
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Features */}
        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🤖</span>
            <div className={styles.featureText}>AI自動採点</div>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🎙️</span>
            <div className={styles.featureText}>音声入力対応</div>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>📊</span>
            <div className={styles.featureText}>詳しい解説</div>
          </div>
        </div>
      </main>
    </div>
  );
}
