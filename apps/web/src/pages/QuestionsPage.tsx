import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { QAStateMachine, Answer, AnswerEntry } from '../types/qa';
import {
  evaluateTransition,
  isQuestionState,
  isResultState,
} from '../utils/qaStateMachine';
import './QuestionsPage.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://www.homefit1403.site/api';

export function QuestionsPage() {
  const { seq } = useParams<{ seq: string }>();

  const [machine, setMachine] = useState<QAStateMachine | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentStateId, setCurrentStateId] = useState<string>('');
  const [history, setHistory] = useState<AnswerEntry[]>([]);
  const [numberInput, setNumberInput] = useState<string>('');

  useEffect(() => {
    if (!seq) {
      setLoading(false);
      return;
    }

    async function fetchQA() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/announcements/${seq}/qa`,
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        const data = (await response.json()) as QAStateMachine;
        setMachine(data);
        setCurrentStateId(data.initial);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    void fetchQA();
  }, [seq]);

  if (loading) {
    return (
      <main className="questions-page" data-testid="questions-page">
        <div className="questions-card">
          <p className="questions-empty">Q&A 데이터를 불러오는 중...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="questions-page" data-testid="questions-page">
        <div className="questions-card">
          <p className="questions-empty">
            Q&A 데이터를 불러오지 못했습니다: {error}
          </p>
          <Link to="/announcements" className="questions-back-link">
            공고 목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

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
    const resultIcon =
      currentState.result === '적합'
        ? '✓'
        : currentState.result === '조건부'
          ? '⚠'
          : '✕';
    const resultClass =
      currentState.result === '적합'
        ? 'result--pass'
        : currentState.result === '조건부'
          ? 'result--conditional'
          : 'result--fail';

    return (
      <main className="questions-page" data-testid="questions-page">
        <div
          className={`questions-card result-card ${resultClass}`}
          data-testid="questions-result"
        >
          <div className="result-icon">{resultIcon}</div>
          <h2>
            {currentState.result === '적합' && '신청 자격이 있습니다'}
            {currentState.result === '부적합' && '신청 자격 요건을 충족하지 않습니다'}
            {currentState.result === '조건부' && '추가 확인이 필요합니다'}
          </h2>

          {/* 부적합 사유 */}
          {currentState.reason && (
            <p className="result-reason" data-testid="result-reason">
              {currentState.reason}
            </p>
          )}

          {/* 조건부 경고 */}
          {currentState.warnings && currentState.warnings.length > 0 && (
            <ul className="result-warnings" data-testid="result-warnings">
              {currentState.warnings.map((warning, idx) => (
                <li key={idx}>{warning}</li>
              ))}
            </ul>
          )}

          {/* 적합/조건부: 단지 정보 */}
          {currentState.units && currentState.units.length > 0 && (
            <div className="result-units" data-testid="result-units">
              <h3>신청 가능 단지</h3>
              {currentState.units.map((unit, idx) => (
                <div key={idx} className="result-unit-card">
                  <div className="unit-header">
                    <strong>{unit.complex_name}</strong>
                    <span className="unit-track">{unit.track}</span>
                  </div>
                  <div className="unit-details">
                    <span>{unit.location}</span>
                    <span>
                      {unit.unit_type} · 전용 {unit.area_sqm}㎡
                    </span>
                    <span>공급 {unit.supply_count}세대</span>
                  </div>
                  <div className="unit-costs">
                    {unit.cost.map((c, cIdx) => (
                      <div key={cIdx} className="unit-cost-row">
                        <span className="cost-label">{c.label}</span>
                        <span className="cost-amount">
                          {c.amount.toLocaleString('ko-KR')}원
                          {c.period && ` / ${c.period}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 원본 공고 링크 */}
          {currentState.source_url && (
            <a
              href={currentState.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="result-source-link"
              data-testid="result-source-link"
            >
              원본 공고 보기 →
            </a>
          )}

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
