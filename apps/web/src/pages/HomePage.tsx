import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface HealthResponse {
  status: string;
  service: string;
  mongo: {
    connected: boolean;
    readyState: number;
    database: string;
  };
  timestamp: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export function HomePage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHealth() {
      try {
        const response = await fetch(`${API_BASE_URL}/health`);

        if (!response.ok) {
          throw new Error(`Health check failed: ${response.status}`);
        }

        setHealth((await response.json()) as HealthResponse);
      } catch (loadError) {
        setError((loadError as Error).message);
      }
    }

    void loadHealth();
  }, []);

  return (
    <main className="home">
      <section className="hero">
        <p className="eyebrow">Home Fit AI</p>
        <h1>서비스 환경세팅이 준비되었습니다.</h1>
        <p className="summary">
          React, NestJS, MongoDB, Nginx가 Docker Compose 환경에서 함께 실행되는지 확인하는 최소 홈 화면입니다.
        </p>
      </section>

      <section className="status-panel" aria-label="service status">
        <div className="status-row">
          <span>Web</span>
          <strong className="ok">connected</strong>
        </div>
        <div className="status-row">
          <span>API</span>
          <strong className={health?.status === 'ok' ? 'ok' : 'pending'}>
            {health?.status ?? 'checking'}
          </strong>
        </div>
        <div className="status-row">
          <span>MongoDB</span>
          <strong className={health?.mongo.connected ? 'ok' : 'pending'}>
            {health ? (health.mongo.connected ? 'connected' : 'disconnected') : 'checking'}
          </strong>
        </div>
        <div className="status-meta">
          {health ? (
            <>
              <span>{health.service}</span>
              <span>database: {health.mongo.database}</span>
              <span>readyState: {health.mongo.readyState}</span>
            </>
          ) : (
            <span>{error ?? 'health check 요청 중입니다.'}</span>
          )}
        </div>
      </section>

      <Link to="/onboarding" className="onboarding-link">
        프로필 입력하기
      </Link>
    </main>
  );
}
