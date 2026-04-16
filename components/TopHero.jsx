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

          {/* 単語 - Coming Soon */}
          <div className={styles.subjectCardLocked}>
            <span className={styles.subjectIcon}>🔤</span>
            <div className={styles.subjectName}>単語</div>
            <div className={styles.comingSoon}>近日公開</div>
          </div>

          {/* 文法 - Active */}
          <div className={styles.subjectCardActive}>
            <span className={styles.subjectIcon}>📝</span>
            <div className={styles.subjectName}>文法</div>
            <div className={styles.subjectModes}>
              <button
                className={styles.modeBtn}
                onClick={() => setAppMode('practice')}
              >
                一問一答
              </button>
              <button
                className={styles.modeBtn}
                onClick={() => setAppMode('test')}
              >
                テスト
              </button>
            </div>
          </div>

          {/* 解釈 - Coming Soon */}
          <div className={styles.subjectCardLocked}>
            <span className={styles.subjectIcon}>🔍</span>
            <div className={styles.subjectName}>解釈</div>
            <div className={styles.comingSoon}>近日公開</div>
          </div>

          {/* 長文 - Coming Soon */}
          <div className={styles.subjectCardLocked}>
            <span className={styles.subjectIcon}>📄</span>
            <div className={styles.subjectName}>長文</div>
            <div className={styles.comingSoon}>近日公開</div>
          </div>

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
