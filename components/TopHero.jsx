import styles from './TopHero.module.css';

export default function TopHero({ setAppMode, showConfig, setShowConfig, apiKey, handleApiKeyChange }) {
  return (
    <div className={styles.heroContainer}>
      {/* Background Graphic Elements */}
      <div className={styles.bgBlobRight}></div>
      <div className={styles.bgBlobLeft}></div>

      {/* Configuration Modal / Overlay */}
      {showConfig && (
        <div className={styles.configModalOverlay} onClick={() => setShowConfig(false)}>
          <div className={styles.configModal} onClick={e => e.stopPropagation()}>
            <h3 className={styles.configTitle}>⚙️ API設定</h3>
            <p className={styles.configDesc}>高精度なAI文字起こしと自動採点を利用するためには、GeminiのAPIキーをセットしてください。</p>
            <input 
              type="password" 
              className={styles.configInput} 
              value={apiKey} 
              onChange={handleApiKeyChange}
              placeholder="AIzaSy..." 
            />
            <p className={styles.configHint}>※未入力の場合はデモ判定モードになります。キーはブラウザにのみ保存されます。</p>
            <button className={styles.configCloseBtn} onClick={() => setShowConfig(false)}>閉じる</button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={styles.content}>
        <div className={styles.badge}>Next Generation Learning</div>
        <h1 className={styles.title}>受験英文法</h1>
        <p className={styles.subtitle}>
          AIがあなたの「思考プロセス」を完全採点。<br/>
          暗記から脱却し、真の英語力を身につける新時代の学習アプリ。
        </p>

        <div className={styles.actionArea}>
          <button 
            className={`${styles.actionBtn} ${styles.primaryBtn}`} 
            onClick={() => setAppMode('practice')}
            onTouchEnd={(e) => { e.preventDefault(); setAppMode('practice'); }}
          >
            <span className={styles.btnIcon}>📝</span>
            一問一答モードで学習
          </button>
          <button 
            className={`${styles.actionBtn} ${styles.secondaryBtn}`} 
            onClick={() => setAppMode('test')}
            onTouchEnd={(e) => { e.preventDefault(); setAppMode('test'); }}
          >
            <span className={styles.btnIcon}>⏱</span>
            テストモードで腕試し
          </button>
        </div>

        <div className={styles.footerConfig}>
          <button className={styles.settingsLink} onClick={() => setShowConfig(true)}>
            ⚙️ APIキーを設定する
          </button>
        </div>
      </div>
    </div>
  );
}
