'use client';
import { useState, useMemo } from 'react';
import styles from './TestModeRunner.module.css';
import QuestionCard from './QuestionCard';
import ReasonInput from './ReasonInput';
import FeedbackPanel from './FeedbackPanel';

export default function TestModeRunner({ questions, apiKey }) {
  const [testPhase, setTestPhase] = useState('setup'); // 'setup' | 'running' | 'results'
  const [testQueue, setTestQueue] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [reason, setReason] = useState('');
  
  // { question, selectedOption, reason, feedback: null | object }
  const [testResults, setTestResults] = useState([]);

  // ジャンル一覧の取得
  const genres = useMemo(() => Array.from(new Set(questions.map(q => q.genre))), [questions]);

  const startTest = (genre) => {
    let genreQs = questions.filter(q => q.genre === genre);
    // ランダムに最大5問選出
    genreQs = genreQs.sort(() => 0.5 - Math.random()).slice(0, 5);
    
    setTestQueue(genreQs);
    setCurrentIdx(0);
    setTestResults([]);
    setSelectedOption(null);
    setReason('');
    setTestPhase('running');
  };

  const fireEvaluation = async (q, optionIdx, reasonTxt) => {
    if (!reasonTxt.trim()) {
      return {
        isOptionCorrect: optionIdx === q.correctOption,
        aiEvaluation: null,
        aiScore: null,
        correctElements: q.correctElements,
        explanation: q.explanation,
        skippedAI: true
      };
    }
    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: q.id,
          question: q.sentence,
          selectedAnswer: q.options[optionIdx],
          correctAnswer: q.options[q.correctOption],
          reasonText: reasonTxt,
          correctElements: q.correctElements,
          apiKey: apiKey
        })
      });
      const data = await res.json();
      if (!res.ok || data.error) {
         let errMsg = data.error || '評価に失敗しました。';
         if (typeof errMsg === 'string' && errMsg.includes('429')) {
           errMsg = '【API制限】リクエスト制限(1分間に15回等)に達しました。約1分待ってから再度お試しください。';
         }
         return { error: errMsg };
      }
      return {
        isOptionCorrect: optionIdx === q.correctOption,
        aiEvaluation: data.evaluation,
        aiScore: data.score !== undefined ? data.score : NaN,
        correctElements: q.correctElements,
        explanation: q.explanation
      };
    } catch(e) {
      return { error: '評価に失敗しました。' };
    }
  };

  const handleNext = () => {
    if (selectedOption === null) return;
    
    const q = testQueue[currentIdx];
    const opt = selectedOption;
    const txt = reason;
    const resultIndex = currentIdx; 

    // 結果配列にプレースホルダーを追加（採点中状態）
    setTestResults(prev => [...prev, {
      question: q,
      selectedOption: opt,
      reason: txt,
      feedback: null 
    }]);

    // バックグラウンドで評価APIを叩き、終わり次第配列の該当インデックスを更新する
    fireEvaluation(q, opt, txt).then(feedback => {
       setTestResults(prev => {
          const newArr = [...prev];
          if(newArr[resultIndex]) {
             newArr[resultIndex] = { ...newArr[resultIndex], feedback };
          }
          return newArr;
       });
    });

    if (currentIdx < testQueue.length - 1) {
      setSelectedOption(null);
      setReason('');
      setCurrentIdx(currentIdx + 1);
    } else {
      setTestPhase('results');
    }
  };

  const renderSetup = () => (
    <div className={styles.setupContainer}>
      <h2 className={styles.setupTitle}>テストモード (5問連続テスト)</h2>
      <p className={styles.setupDesc}>ジャンルを選択して、ランダムな5問のテストを開始してください。採点はバックグラウンドで行われるため、待ち時間ゼロでサクサク進められます！</p>
      <div className={styles.genreGrid}>
        {genres.map(g => (
          <button key={g} className={styles.genreBtn} onClick={() => startTest(g)}>
            {g}からランダム出題 ▶
          </button>
        ))}
      </div>
    </div>
  );

  const renderRunning = () => {
    const q = testQueue[currentIdx];
    return (
      <div className={styles.runningContainer}>
        <div className={styles.progress}>
          問題 {currentIdx + 1} / {testQueue.length}
        </div>
        <QuestionCard 
          question={q} 
          selectedOption={selectedOption}
          onSelectOption={setSelectedOption}
        />
        <ReasonInput 
          value={reason} 
          onChange={setReason}
          disabled={false}
        />
        <button 
          className={styles.submitBtn} 
          onClick={handleNext}
          disabled={selectedOption === null}
        >
          {currentIdx < testQueue.length - 1 ? '解答して次の問題へ' : '解答してテスト終了'}
        </button>
      </div>
    );
  };

  const renderResults = () => {
    const finishedCount = testResults.filter(r => r.feedback !== null).length;
    const isAllFinished = finishedCount === testQueue.length;

    return (
      <div className={styles.resultsContainer}>
        <h2 className={styles.resultsTitle}>テスト結果</h2>
        
        {!isAllFinished && (
          <div className={styles.loadingBanner}>
            <span className={styles.spinner}></span>
            バックグラウンドで {testQueue.length - finishedCount} 問をAI採点中...
          </div>
        )}

        <div className={styles.resultsList}>
          {testResults.map((res, index) => (
            <div key={index} className={styles.resultItem}>
              <h3 className={styles.resultQNumber}>問題 {index + 1} (Problem {res.question.id})</h3>
              <p className={styles.resultSentence}>{res.question.sentence.replace('______', res.selectedOption !== null ? '[' + res.question.options[res.selectedOption] + ']' : '______')}</p>
              
              <div className={styles.userAnswers}>
                <p><strong>あなたの選択:</strong> {res.selectedOption !== null ? res.question.options[res.selectedOption] : '未選択'}</p>
                <p><strong>あなたの理由:</strong> {res.reason || '（未入力）'}</p>
              </div>

              {res.feedback ? (
                <FeedbackPanel feedback={res.feedback} />
              ) : (
                <div className={styles.waitingFeedback}>AI採点・解説の生成を待っています...</div>
              )}
            </div>
          ))}
        </div>
        
        {isAllFinished && (
          <button className={styles.retryBtn} onClick={() => setTestPhase('setup')}>
            もう一度テストをする
          </button>
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {testPhase === 'setup' && renderSetup()}
      {testPhase === 'running' && renderRunning()}
      {testPhase === 'results' && renderResults()}
    </div>
  );
}
