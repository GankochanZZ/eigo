import styles from './TopHero.module.css';

export default function TopHero({ setAppMode, showConfig, setShowConfig, apiKey, handleApiKeyChange }) {
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

      {/* Header */}
      <header className={styles.header}>
        <span className={styles.logo}>📖</span>
        <span className={styles.logoText}>受験英文法</span>
        <button className={styles.settingsBtn} onClick={() => setShowConfig(true)}>
          ⚙️ API設定
        </button>
      </header>

      {/* Hero */}
      <main className={styles.hero}>
        <div className={styles.badge}>AI × 英文法</div>
        <h1 className={styles.title}>
          暗記に頼らない<br />
          <span className={styles.titleAccent}>新しい英語の学び方</span>
        </h1>
        <p className={styles.desc}>
          4択問題を解いて「なぜその答えか」を説明しよう。<br />
          AIがあなたの理解度を即時採点します。
        </p>

        {/* Mode Cards */}
        <div className={styles.cards}>
          <button
            className={styles.cardPrimary}
            onClick={() => setAppMode('practice')}
          >
            <span className={styles.cardIcon}>📝</span>
            <div className={styles.cardBody}>
              <div className={styles.cardTitle}>一問一答モード</div>
              <div className={styles.cardDesc}>問題を1問ずつ解いてAIに採点してもらう</div>
            </div>
            <span className={styles.cardArrow}>→</span>
          </button>

          <button
            className={styles.cardSecondary}
            onClick={() => setAppMode('test')}
          >
            <span className={styles.cardIcon}>⏱️</span>
            <div className={styles.cardBody}>
              <div className={styles.cardTitle}>テストモード</div>
              <div className={styles.cardDesc}>複数問題をまとめて解いてスコアを確認</div>
            </div>
            <span className={styles.cardArrow}>→</span>
          </button>
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
