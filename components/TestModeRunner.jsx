'use client';
import { useState, useRef, useMemo } from 'react';
import styles from './TestModeRunner.module.css';
import QuestionCard from './QuestionCard';
import FeedbackPanel from './FeedbackPanel';

// ── 録音 → バックグラウンド採点専用の入力コンポーネント ──
function VoiceTestInput({ onRecordingDone, disabled }) {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'recording' | 'sending'
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        streamRef.current?.getTracks().forEach(t => t.stop());
        setStatus('sending');

        // Base64化してコールバックに渡す（バックグラウンド送信はTestModeRunnerが担う）
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const b64 = reader.result;
          const mimeType = b64.split(';')[0].split(':')[1];
          const audioData = b64.split(',')[1];
          onRecordingDone({ audioData, mimeType });
          setStatus('idle');
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
      setStatus('recording');
    } catch (err) {
      alert('マイクへのアクセスを許可してください。');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const label = {
    idle: '🎤 音声で回答',
    recording: '⏹ 停止 (録音中)',
    sending: '📤 送信中...'
  }[status];

  return (
    <button
      className={`${styles.micBtn} ${status === 'recording' ? styles.micRecording : ''} ${status === 'sending' ? styles.micSending : ''}`}
      onClick={status === 'recording' ? stopRecording : startRecording}
      disabled={disabled || status === 'sending'}
    >
      {label}
    </button>
  );
}

// ── メインコンポーネント ──
export default function TestModeRunner({ questions, apiKey }) {
  const [testPhase, setTestPhase] = useState('setup'); // 'setup' | 'running' | 'results'
  const [testQueue, setTestQueue] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [reasonText, setReasonText] = useState('');
  // { question, selectedOption, feedback: null | object, transcribed: null | string }
  const [testResults, setTestResults] = useState([]);

  const genres = useMemo(() => Array.from(new Set(questions.map(q => q.genre))), [questions]);

  const startTest = (genre) => {
    let genreQs = questions.filter(q => q.genre === genre);
    genreQs = genreQs.sort(() => 0.5 - Math.random()).slice(0, 5);
    setTestQueue(genreQs);
    setCurrentIdx(0);
    setTestResults([]);
    setSelectedOption(null);
    setReasonText('');
    setTestPhase('running');
  };

  // 音声採点APIを叩く（バックグラウンド）
  const fireVoiceEvaluate = async (q, optionIdx, audioData, mimeType) => {
    const activeApiKey = apiKey || localStorage.getItem('gemini_api_key') || '';
    try {
      const res = await fetch('/api/voice-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioData,
          mimeType,
          apiKey: activeApiKey,
          id: q.id,
          question: q.sentence,
          selectedAnswer: q.options[optionIdx],
          correctAnswer: q.options[q.correctOption],
          correctElements: q.correctElements,
        })
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        const msg = data.error || '採点エラー';
        return { error: msg.includes('429') ? '【API制限】約1分待ってから再度お試しください。' : msg };
      }
      return {
        isOptionCorrect: data.isOptionCorrect,
        aiEvaluation: data.evaluation,
        aiScore: data.score,
        correctElements: q.correctElements,
        explanation: q.explanation,
        transcribed: data.transcribed,
      };
    } catch (e) {
      return { error: '採点の通信に失敗しました。' };
    }
  };

  // 理由なし（テキストなし・音声なし）の採点
  const fireEvaluationTextOnly = async (q, optionIdx, reasonTxt) => {
    if (!reasonTxt?.trim()) {
      return {
        isOptionCorrect: optionIdx === q.correctOption,
        aiEvaluation: null,
        aiScore: null,
        correctElements: q.correctElements,
        explanation: q.explanation,
        skippedAI: true
      };
    }
    const activeApiKey = apiKey || localStorage.getItem('gemini_api_key') || '';
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
          apiKey: activeApiKey,
        })
      });
      const data = await res.json();
      if (!res.ok || data.error) return { error: data.error || '評価に失敗しました。' };
      return {
        isOptionCorrect: optionIdx === q.correctOption,
        aiEvaluation: data.evaluation,
        aiScore: data.score,
        correctElements: q.correctElements,
        explanation: q.explanation,
      };
    } catch {
      return { error: '評価の通信に失敗しました。' };
    }
  };

  // 録音終了時: 即座に次の問題へ進み、採点はバックグラウンドへ
  const handleVoiceDone = ({ audioData, mimeType }) => {
    if (selectedOption === null) {
      alert('先に選択肢を選んでください。');
      return;
    }
    const q = testQueue[currentIdx];
    const optionIdx = selectedOption;
    const resultIndex = testResults.length;

    // プレースホルダー登録（採点中状態）
    setTestResults(prev => [...prev, {
      question: q,
      selectedOption: optionIdx,
      transcribed: null,
      feedback: null,
    }]);

    // 次の問題へ即移動 or 結果画面へ
    if (currentIdx < testQueue.length - 1) {
      setSelectedOption(null);
      setReasonText('');
      setCurrentIdx(prev => prev + 1);
    } else {
      setTestPhase('results');
    }

    // バックグラウンドで採点
    fireVoiceEvaluate(q, optionIdx, audioData, mimeType).then(feedback => {
      setTestResults(prev => {
        const arr = [...prev];
        if (arr[resultIndex]) {
          arr[resultIndex] = {
            ...arr[resultIndex],
            transcribed: feedback.transcribed || null,
            feedback,
          };
        }
        return arr;
      });
    });
  };

  // テキスト・理由なしで回答
  const handleNextWithText = () => {
    if (selectedOption === null) return;
    const q = testQueue[currentIdx];
    const optionIdx = selectedOption;
    const resultIndex = testResults.length;
    const currentReasonText = reasonText;

    setTestResults(prev => [...prev, {
      question: q,
      selectedOption: optionIdx,
      transcribed: currentReasonText ? currentReasonText : null,
      feedback: null,
    }]);

    if (currentIdx < testQueue.length - 1) {
      setSelectedOption(null);
      setReasonText('');
      setCurrentIdx(prev => prev + 1);
    } else {
      setTestPhase('results');
    }

    // 理由テキストありなし問わずテキスト用関数で採点
    fireEvaluationTextOnly(q, optionIdx, currentReasonText).then(feedback => {
      setTestResults(prev => {
        const arr = [...prev];
        if (arr[resultIndex]) arr[resultIndex] = { ...arr[resultIndex], feedback };
        return arr;
      });
    });
  };

  const renderSetup = () => (
    <div className={styles.setupContainer}>
      <h2 className={styles.setupTitle}>テストモード</h2>
      <p className={styles.setupDesc}>
        ジャンルを選ぶとランダム5問テストが始まります。<br />
        音声で回答すると録音停止と同時に採点がバックグラウンドで走るため、待ち時間ゼロで次の問題に進めます。
      </p>
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

        <textarea
          className={styles.textarea}
          placeholder="解答理由を文字で入力することもできます（任意）"
          value={reasonText}
          onChange={(e) => setReasonText(e.target.value)}
          rows={3}
          disabled={selectedOption === null}
        />

        <div className={styles.actionRow}>
          <VoiceTestInput
            onRecordingDone={handleVoiceDone}
            disabled={selectedOption === null}
          />
          <button
            className={styles.skipBtn}
            onClick={handleNextWithText}
            disabled={selectedOption === null}
          >
            {reasonText.trim() ? (currentIdx < testQueue.length - 1 ? '決定・次へ →' : '決定・終了') : (currentIdx < testQueue.length - 1 ? '理由なしで次へ →' : '理由なしで終了')}
          </button>
        </div>

        {selectedOption === null && (
          <p className={styles.hint}>← まず選択肢を選んでください</p>
        )}
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
            バックグラウンドでAI採点中... ({finishedCount}/{testQueue.length} 完了)
          </div>
        )}

        <div className={styles.resultsList}>
          {testResults.map((res, index) => (
            <div key={index} className={styles.resultItem}>
              <h3 className={styles.resultQNumber}>問題 {index + 1} (Problem {res.question.id})</h3>
              <p className={styles.resultSentence}>
                {res.question.sentence.replace('______',
                  res.selectedOption !== null
                    ? '[' + res.question.options[res.selectedOption] + ']'
                    : '______'
                )}
              </p>

              <div className={styles.userAnswers}>
                <p><strong>あなたの選択:</strong> {res.selectedOption !== null ? res.question.options[res.selectedOption] : '未選択'}</p>
                {res.transcribed && (
                  <p><strong>解答理由:</strong> {res.transcribed}</p>
                )}
              </div>

              {res.feedback ? (
                <FeedbackPanel feedback={res.feedback} />
              ) : (
                <div className={styles.waitingFeedback}>
                  <span className={styles.spinner}></span> AI採点中...
                </div>
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
