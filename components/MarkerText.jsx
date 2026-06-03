import { useState, useCallback } from 'react';
import styles from './MarkerText.module.css';

const COLORS = [
  { id: 'yellow', label: '黄 (SV等)', hex: '#fff48c' },
  { id: 'pink', label: '赤 (重要)', hex: '#ffb3ba' },
  { id: 'blue', label: '青 (修飾)', hex: '#bae1ff' },
  { id: 'green', label: '緑 (句節)', hex: '#baffc9' },
];

export default function MarkerText({ text }) {
  const [colors, setColors] = useState(Array(text.length).fill(null));

  const applyColor = useCallback((colorHex) => {
    const selection = window.getSelection();
    if (!selection.rangeCount || selection.isCollapsed) return;

    let anchorNode = selection.anchorNode;
    let focusNode = selection.focusNode;

    // テキストノードの場合、親のspanを取得
    if (anchorNode.nodeType === 3) anchorNode = anchorNode.parentNode;
    if (focusNode.nodeType === 3) focusNode = focusNode.parentNode;

    const anchorIndex = parseInt(anchorNode.getAttribute('data-index'), 10);
    const focusIndex = parseInt(focusNode.getAttribute('data-index'), 10);

    if (isNaN(anchorIndex) || isNaN(focusIndex)) return;

    const start = Math.min(anchorIndex, focusIndex);
    const end = Math.max(anchorIndex, focusIndex);

    setColors(prev => {
      const next = [...prev];
      for (let i = start; i <= end; i++) {
        // 同じ色なら解除、違う色なら塗る
        next[i] = next[i] === colorHex ? null : colorHex;
      }
      return next;
    });

    // 選択を解除
    selection.removeAllRanges();
  }, []);

  const clearColors = () => {
    setColors(Array(text.length).fill(null));
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        {COLORS.map(c => (
          <button
            key={c.id}
            className={styles.colorBtn}
            style={{ backgroundColor: c.hex }}
            onClick={() => applyColor(c.hex)}
            title={c.label}
          >
            {c.label}
          </button>
        ))}
        <button className={styles.clearBtn} onClick={clearColors}>クリア</button>
      </div>
      
      <div className={styles.textContainer}>
        {text.split('').map((char, i) => (
          <span
            key={i}
            data-index={i}
            className={styles.charSpan}
            style={{ backgroundColor: colors[i] || 'transparent' }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
}
