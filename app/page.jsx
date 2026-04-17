'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import QuestionCard from '../components/QuestionCard';
import ReasonInput from '../components/ReasonInput';
import FeedbackPanel from '../components/FeedbackPanel';
import Sidebar from '../components/Sidebar';
import TestModeRunner from '../components/TestModeRunner';
import TopHero from '../components/TopHero';
import SetSelector from '../components/SetSelector';

export default function Home() {
  const [appMode, setAppModeState] = useState('top'); // 'top' | 'practice' | 'test'
  const [activeSubject, setActiveSubject] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [globalError, setGlobalError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleErr = (msg, url, line, col, error) => {
      setGlobalError(`${msg} (${line}:${col})`);
      return false;
    };
    window.addEventListener('error', (e) => handleErr(e.message, e.filename, e.lineno, e.colno, e.error));
    window.addEventListener('unhandledrejection', (e) => setGlobalError(e.reason ? e.reason.toString() : 'Unhandled Promise Rejection'));
  }, []);

  // ブラウザ履歴に積みつつモードを変更
  const setAppMode = (mode) => {
    if (mode === 'top') {
      history.pushState({ mode: 'top' }, '', '/');
      setActiveSubject(null);
      setQuestions([]);
    } else {
      history.pushState({ mode }, '', `?mode=${mode}`);
    }
    setAppModeState(mode);
  };

  // ブラウザの戻る / 進むボタンに対応
  useEffect(() => {
    const handlePopState = (e) => {
      const mode = e.state?.mode ?? 'top';
      setAppModeState(mode);
      if (mode === 'top') {
        setActiveSubject(null);
        setQuestions([]);
      }
    };
    window.addEventListener('popstate', handlePopState);
    // 初回アクセス時に top を履歴に積む
    history.replaceState({ mode: 'top' }, '', '/');
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [selectedOption, setSelectedOption] = useState(null);
  const [reason, setReason] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
    localStorage.setItem('gemini_api_key', e.target.value);
  };

  const handleSubjectSelect = (subject) => {
    setActiveSubject(subject);
    setAppMode('practice');
  };

  const loadQuestions = async (selectedSetsNames) => {
    setIsLoading(true);
    setGlobalError(null);
    try {
      const selectedSets = selectedSetsNames.map(setName => ({
        category: activeSubject.name,
        set: setName
      }));

      const resp = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedSets })
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Failed to load questions');
      
      setQuestions(data.questions);
      setCurrentIndex(0);
      setSelectedOption(null);
      setReason('');
      setFeedback(null);
    } catch (err) {
      setGlobalError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const currentQuestion = currentIndex !== null && questions.length > 0 ? questions[currentIndex] : null;

  const handleSubmit = () => submitExplanation(reason);

  const submitExplanation = async (textToSubmit) => {
    if (selectedOption === null || !currentQuestion) return;

    if (!textToSubmit.trim()) {
      // AI採点スキップ処理
      setFeedback({
        isOptionCorrect: selectedOption === currentQuestion.correctOption,
        aiEvaluation: null,
        aiScore: null,
        correctElements: currentQuestion.correctElements,
        explanation: currentQuestion.explanation,
        skippedAI: true
      });
      return;
    }

    setIsEvaluating(true);
    setFeedback({
      isOptionCorrect: selectedOption === currentQuestion.correctOption,
      aiEvaluation: null,
      aiScore: null,
      correctElements: currentQuestion.correctElements,
      explanation: currentQuestion.explanation,
      isEvaluating: true
    });

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentQuestion.id,
          question: currentQuestion.sentence,
          selectedAnswer: currentQuestion.options[selectedOption],
          correctAnswer: currentQuestion.options[currentQuestion.correctOption],
          reasonText: textToSubmit,
          correctElements: currentQuestion.correctElements,
          apiKey: apiKey
        }),
      });

      const data = await response.json();
      
      if (!response.ok || data.error) {
         let errMsg = data.error || 'APIからの応答が不正です。';
         if (typeof errMsg === 'string' && errMsg.includes('429')) {
           errMsg = '【API制限】無償枠のリクエスト制限に達しました。約1分待ってから再度お試しください。';
         } else if (typeof errMsg === 'string' && (errMsg.includes('500') || errMsg.includes('INTERNAL'))) {
           errMsg = '【サーバーエラー】Google APIで一時的な障害が発生しています。しばらく待ってから再度お試しください。';
         }
         throw new Error(errMsg);
      }

      setFeedback({
        isOptionCorrect: selectedOption === currentQuestion.correctOption,
        aiEvaluation: data.evaluation,
        aiScore: data.score !== undefined ? data.score : NaN,
        correctElements: currentQuestion.correctElements,
        explanation: currentQuestion.explanation
      });
    } catch (err) {
      console.error(err);
      setFeedback({ error: err.message || 'AI評価中にエラーが発生しました。' });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      changeQuestion(currentIndex + 1);
    } else {
      alert('すべての問題が終了しました！');
    }
  };

  const changeQuestion = (index) => {
    setCurrentIndex(index);
    setSelectedOption(null);
    setReason('');
    setFeedback(null);
  };

  if (appMode === 'top') {
    return (
      <TopHero 
        setAppMode={setAppMode} 
        showConfig={showConfig} 
        setShowConfig={setShowConfig} 
        apiKey={apiKey} 
        handleApiKeyChange={handleApiKeyChange}
        onLoadQuestions={handleSubjectSelect}
      />
    );
  }

  return (
    <div className={styles.dashboard}>
      {globalError && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'red', color: 'white', padding: '1rem', zIndex: 99999 }}>
          システムエラー: {globalError}
        </div>
      )}

      {/* Config Modal */}
      {showConfig && (
        <div className={styles.configModalOverlay} onClick={() => setShowConfig(false)}>
          <div className={styles.configModal} onClick={e => e.stopPropagation()}>
            <h3 className={styles.configModalTitle}>⚙️ APIキー設定</h3>
            <p className={styles.configModalDesc}>
              Gemini APIキーを入力するとAI採点・音声入力が使えます。キーはこのブラウザにのみ保存されます。
            </p>
            <input
              type="password"
              className={styles.configModalInput}
              value={apiKey}
              onChange={handleApiKeyChange}
              placeholder="AIzaSy..."
            />
            <p className={styles.configModalHint}>※未入力の場合はデモ判定モードになります。</p>
            <button className={styles.configModalClose} onClick={() => setShowConfig(false)}>
              閉じる
            </button>
          </div>
        </div>
      )}

      <div className={styles.mobileHeader}>
        <button className={styles.hamburgerBtn} onClick={() => setIsSidebarOpen(true)}>
          ☰ メニュー
        </button>
        <span className={styles.mobileTitle} onClick={() => setAppMode('top')}>鑑真英語</span>
        <div style={{ width: '40px' }}></div> {/* バランス調整用の空要素 */}
      </div>

      <Sidebar 
        questions={questions}
        currentIndex={currentIndex} 
        onSelectQuestion={changeQuestion} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className={styles.mainArea}>
        <div className={styles.contentWrapper}>
          <div className={styles.topBar}>
            <button className={styles.backToTopBtn} onClick={() => setAppMode('top')}>← トップ</button>
            <div className={styles.modeToggle}>
              <button 
                className={`${styles.modeBtn} ${appMode === 'practice' ? styles.activeMode : ''}`}
                onClick={() => setAppMode('practice')}
              >一問一答モード</button>
              <button 
                className={`${styles.modeBtn} ${appMode === 'test' ? styles.activeMode : ''}`}
                onClick={() => setAppMode('test')}
              >テストモード</button>
            </div>
        <button className={styles.configToggleBtn} onClick={() => setShowConfig(!showConfig)}>
          ⚙️ API設定
        </button>
      </div>

      <header className={styles.header}>
        <h1 className={styles.title} onClick={() => setAppMode('top')} style={{ cursor: 'pointer' }}>
          鑑真英語
        </h1>
        <p className={styles.subtitle}>「なぜその答えになるのか」を説明して、真の英語力を身につけよう。</p>
      </header>

      <main className={styles.mainContent}>
        {isLoading ? (
          <div className={styles.loadingState}>
            <span className={styles.spinner}></span>
            <p>問題を読み込み中...</p>
          </div>
        ) : questions.length === 0 && activeSubject ? (
          <SetSelector 
            category={activeSubject} 
            onCancel={() => setAppMode('top')}
            onStart={loadQuestions}
          />
        ) : appMode === 'test' ? (
          <TestModeRunner questions={questions} apiKey={apiKey} />
        ) : (
          !currentQuestion ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>👈</div>
              <h3>問題を選択してください</h3>
              <p>左側のメニューから挑戦する問題を選んでください。</p>
              <button 
                className={styles.mobileMenuOpenBtn} 
                onClick={() => setIsSidebarOpen(true)}
              >
                メニューを開く
              </button>
            </div>
          ) : (
            <>
              <QuestionCard 
                question={currentQuestion} 
                selectedOption={selectedOption}
                onSelectOption={(idx) => {
                  if (!feedback) setSelectedOption(idx);
                }}
              />

              <ReasonInput 
                value={reason} 
                onChange={(val) => {
                  if (!feedback) setReason(val);
                }}
                disabled={feedback !== null || selectedOption === null}
              />

              {!feedback && (
                <button 
                  className={styles.submitBtn} 
                  onClick={handleSubmit}
                  disabled={selectedOption === null || isEvaluating}
                >
                  {isEvaluating ? (
                    <div className={styles.evaluating}>
                      <span className={styles.spinner}></span>
                      判定中...
                    </div>
                  ) : (
                    '解答と理由を送信'
                  )}
                </button>
              )}

              {feedback && (
                <>
                  <FeedbackPanel feedback={feedback} />
                  <button className={styles.nextBtn} onClick={handleNext}>
                    次の問題へ
                  </button>
                </>
              )}
            </>
          )
        )}
        </main>
        </div>
      </div>
    </div>
  );
}
