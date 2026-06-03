import { useState, useRef, useEffect } from 'react';
import styles from './ReasonInput.module.css';

export default function ReasonInput({ value, onChange, disabled, onVoiceComplete, customLabel, customPlaceholder }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const toggleRecording = async () => {
    if (disabled || isTranscribing) return;

    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = async () => {
          setIsTranscribing(true);
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          stream.getTracks().forEach(track => track.stop()); // マイクの解放

          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            let base64Audio = reader.result;
            // "data:audio/webm;base64,..." の "data:...;base64," 部分を除去
            const mimeType = base64Audio.split(';')[0].split(':')[1];
            base64Audio = base64Audio.split(',')[1];

            try {
              const apiKey = localStorage.getItem('gemini_api_key') || '';
              const res = await fetch('/api/transcribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ audioData: base64Audio, mimeType, apiKey })
              });
              const data = await res.json();
              if (data.text) {
                const newText = value + (value ? ' ' : '') + data.text;
                onChange(newText);
                if (onVoiceComplete) onVoiceComplete(newText);
              } else if (data.error) {
                alert('文字起こしエラー: ' + data.error);
              }
            } catch (err) {
              console.error(err);
              alert('文字起こしの通信に失敗しました。');
            } finally {
              setIsTranscribing(false);
            }
          };
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Microphone access error:', err);
        alert('マイクへのアクセスが許可されていないか、対応していないブラウザです。');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label className={styles.label}>{customLabel || 'なぜその答えを選んだのですか？（理由）'}</label>
        <button 
          className={`${styles.micBtn} ${isRecording ? styles.recording : ''}`}
          onClick={toggleRecording}
          disabled={disabled || isTranscribing}
          title={"AIによる正確な音声文字起こし"}
        >
          {isTranscribing ? '⏳ 処理中...' : (isRecording ? '⏹ 停止 (録音中)' : '🎤 AI音声入力')}
        </button>
      </div>
      <textarea
        className={styles.textarea}
        placeholder={customPlaceholder || "例: look forward to の to は前置詞なので、後ろには動名詞が来るため。"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        disabled={disabled || isTranscribing}
      />
    </div>
  );
}
