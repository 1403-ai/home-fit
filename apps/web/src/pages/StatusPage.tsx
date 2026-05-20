import { useEffect, useState } from 'react';

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

export function StatusPage() {
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
    <main className="min-h-[calc(100vh-3.5rem)] bg-gray-50 grid content-center gap-6 p-8">
      <section className="w-full max-w-3xl mx-auto">
        <p className="mb-3 text-orange-600 text-sm font-bold uppercase tracking-wide">
          Home Fit AI
        </p>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight text-gray-900">
          서비스 상태 확인
        </h1>
        <p className="mt-5 max-w-xl text-gray-500 text-lg leading-relaxed">
          React, NestJS, MongoDB, Nginx가 Docker Compose 환경에서 함께 실행되는지 확인하는 상태 페이지입니다.
        </p>
      </section>

      <section
        className="w-full max-w-3xl mx-auto grid gap-3 border border-gray-200 rounded-lg bg-white p-5 shadow-md"
        aria-label="service status"
        data-testid="status-panel"
      >
        <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
          <span className="text-gray-600">Web</span>
          <strong className="rounded-full px-3 py-1.5 text-sm text-amber-700 bg-amber-50">
            connected
          </strong>
        </div>
        <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
          <span className="text-gray-600">API</span>
          <strong
            className={`rounded-full px-3 py-1.5 text-sm ${
              health?.status === 'ok'
                ? 'text-amber-700 bg-amber-50'
                : 'text-red-700 bg-red-50'
            }`}
          >
            {health?.status ?? 'checking'}
          </strong>
        </div>
        <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
          <span className="text-gray-600">MongoDB</span>
          <strong
            className={`rounded-full px-3 py-1.5 text-sm ${
              health?.mongo.connected
                ? 'text-amber-700 bg-amber-50'
                : 'text-red-700 bg-red-50'
            }`}
          >
            {health
              ? health.mongo.connected
                ? 'connected'
                : 'disconnected'
              : 'checking'}
          </strong>
        </div>
        <div className="flex flex-wrap gap-2 text-gray-500 text-sm">
          {health ? (
            <>
              <span className="rounded-full bg-gray-100 px-3 py-1.5">{health.service}</span>
              <span className="rounded-full bg-gray-100 px-3 py-1.5">
                database: {health.mongo.database}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1.5">
                readyState: {health.mongo.readyState}
              </span>
            </>
          ) : (
            <span className="rounded-full bg-gray-100 px-3 py-1.5">
              {error ?? 'health check 요청 중입니다.'}
            </span>
          )}
        </div>
      </section>
    </main>
  );
}
