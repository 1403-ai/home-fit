import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockStateMachines } from '../mocks/qa-state-machines';
import type { Answer, AnswerEntry } from '../types/qa';
import {
  evaluateTransition,
  isQuestionState,
  isResultState,
} from '../utils/qaStateMachine';
import './QuestionsPage.css';

export function QuestionsPage() {
  const { seq } = useParams<{ seq: string }>();
  const machine = seq ? mockStateMachines[seq] : undefined;

  const [currentStateId, setCurrentStateId] = useState<string>(
    machine?.initial ?? '',
  );
  const [history, setHistory] = useState<AnswerEntry[]>([]);
  const [numberInput, setNumberInput] = useState<string>('');

  if (!machine) {
    return (
      <main className="questions-page" data-testid="questions-page">
        <div className="questions-card">
          <p className="questions-empty">
            해당 공고의 Q&A 데이터를 찾을 수 없습니다.
          </p>
          <Link to="/announcements" className="questions-back-link">
            공고 목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  const currentState = machine.states[currentStateId];
  const questionIndex = history.length;
  const progress = Math.min(
    (questionIndex / machine.meta.total_questions) * 100,
    100,
  );

  function handleAnswer(answer: Answer) {
    if (!isQuestionState(currentState)) return;

    const nextStateId = evaluateTransition(currentState.transitions, answer);
    setHistory([...history, { stateId: currentStateId, answer }]);
    setCurrentStateId(nextStateId);
    setNumberInput('');
  }

  function handleBack() {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setCurrentStateId(prev.stateId);
    setNumberInput('');
  }

  function handleNumberSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(numberInput);
    if (!Number.isNaN(value)) {
      handleAnswer(value);
    }
  }

  // Result state reached
  if (isResultState(currentState)) {
    return (
      <main className="questions-page" data-testid="questions-page">
        <div className="questions-card result-card" data-testid="questions-result">
          <div className="result-icon">✓</div>
          <h2>Q&A 완료</h2>
          <p className="result-message">
            모든 질문에 답변하셨습니다. 결과 화면은 다음 업데이트에서 제공됩니다.
          </p>
          <p className="result-preview">
            예상 결과: <strong>{currentState.result}</strong>
          </p>
          <div className="result-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleBack}
              data-testid="questions-back-btn"
            >
              이전 질문으로
            </button>
            <Link
              to="/announcements"
              className="btn-primary"
              data-testid="questions-to-list"
            >
              공고 목록으로
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Question state
  if (!isQuestionState(currentState)) return null;

  return (
    <main className="questions-page" data-testid="questions-page">
      {/* Top Navigation */}
      <nav className="questions-top-nav">
        <Link
          to="/announcements"
          className="btn-secondary"
          data-testid="questions-to-list"
        >
          ← 목록으로
        </Link>
      </nav>

      {/* Progress Bar */}
      <div className="questions-progress" data-testid="questions-progress">
        <div
          className="questions-progress-bar"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={questionIndex}
          aria-valuemin={0}
          aria-valuemax={machine.meta.total_questions}
        />
        <span className="questions-progress-text">
          {questionIndex + 1} / {machine.meta.total_questions}
        </span>
      </div>

      {/* Flash Card */}
      <div className="questions-card" data-testid="questions-card">
        <p className="questions-text" data-testid="questions-text">
          {currentState.text}
        </p>

        {/* Boolean Input */}
        {currentState.input === 'boolean' && (
          <div className="questions-input-group" data-testid="input-boolean">
            <button
              type="button"
              className="btn-answer"
              onClick={() => handleAnswer(true)}
              data-testid="answer-yes"
            >
              예
            </button>
            <button
              type="button"
              className="btn-answer"
              onClick={() => handleAnswer(false)}
              data-testid="answer-no"
            >
              아니오
            </button>
          </div>
        )}

        {/* Number Input */}
        {currentState.input === 'number' && (
          <form
            className="questions-input-group number-input-group"
            onSubmit={handleNumberSubmit}
            data-testid="input-number"
          >
            <div className="number-input-wrapper">
              <input
                type="number"
                className="number-input"
                value={numberInput}
                onChange={(e) => setNumberInput(e.target.value)}
                placeholder="숫자를 입력하세요"
                autoFocus
                data-testid="number-input-field"
              />
              {currentState.unit && (
                <span className="number-unit">{currentState.unit}</span>
              )}
            </div>
            <button
              type="submit"
              className="btn-answer btn-submit"
              disabled={numberInput === '' || Number.isNaN(Number(numberInput))}
              data-testid="number-submit"
            >
              다음
            </button>
          </form>
        )}

        {/* Choice Input */}
        {currentState.input === 'choice' && currentState.options && (
          <div className="questions-input-group choice-group" data-testid="input-choice">
            {currentState.options.map((option) => (
              <button
                key={option}
                type="button"
                className="btn-answer btn-choice"
                onClick={() => handleAnswer(option)}
                data-testid={`choice-${option}`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="questions-nav">
        <button
          type="button"
          className="btn-secondary"
          onClick={handleBack}
          disabled={history.length === 0}
          data-testid="questions-back-btn"
        >
          ← 이전
        </button>
      </div>
    </main>
  );
}
