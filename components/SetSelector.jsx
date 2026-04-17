import { useState } from 'react';
import styles from './SetSelector.module.css';

const ICON_MAP = {
  '単語': '🔤',
  '文法': '📝',
  '解釈': '🔍',
  '長文': '📄'
};

export default function SetSelector({ category, onCancel, onStart }) {
  const [selectedSets, setSelectedSets] = useState([category.sets[0]]);

  const toggleSet = (setName) => {
    if (selectedSets.includes(setName)) {
      if (selectedSets.length > 1) {
        setSelectedSets(selectedSets.filter(s => s !== setName));
      }
    } else {
      setSelectedSets([...selectedSets, setName]);
    }
  };

  const handleStart = () => {
    onStart(selectedSets);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        {ICON_MAP[category.name] || '📖'} {category.name}：セットを選択
      </h3>
      <p className={styles.desc}>
        学習したい問題セットを選んでください（複数選択可）。
      </p>
      
      <div className={styles.setGrid}>
        {category.sets.map(setName => (
          <div 
            key={setName} 
            className={`${styles.setItem} ${selectedSets.includes(setName) ? styles.setItemActive : ''}`}
            onClick={() => toggleSet(setName)}
          >
            <input 
              type="checkbox" 
              className={styles.setCheckbox} 
              checked={selectedSets.includes(setName)}
              readOnly
            />
            <span className={styles.setName}>{setName}</span>
          </div>
        ))}
      </div>

      <div className={styles.setActions}>
        <button className={styles.cancelBtn} onClick={onCancel}>
          キャンセル
        </button>
        <button 
          className={styles.startBtn} 
          onClick={handleStart}
          disabled={selectedSets.length === 0}
        >
          学習開始
        </button>
      </div>
    </div>
  );
}
