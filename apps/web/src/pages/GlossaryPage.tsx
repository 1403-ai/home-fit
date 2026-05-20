import { useCallback, useEffect, useState } from 'react';

interface GlossaryEntry {
  term: string;
  category: '소득기준' | '주택정보' | '자격요건' | '공급유형';
  description: string;
  related: string[];
}

interface QuizItem {
  question: string;
  correctAnswer: string;
  options: string[];
}

type AnswerState = 'unanswered' | 'correct' | 'incorrect';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://www.homefit1403.site/api';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function generateQuizzes(entries: GlossaryEntry[]): QuizItem[] {
  if (entries.length < 4) return [];

  const shuffledEntries = shuffleArray(entries);
  const selected = shuffledEntries.slice(0, 2);

  return selected.map((entry) => {
    const sameCategory = entries.filter(
      (e) => e.category === entry.category && e.term !== entry.term
    );
    const otherCategory = entries.filter(
      (e) => e.category !== entry.category && e.term !== entry.term
    );

    let wrongAnswers: string[];
    if (sameCategory.length >= 3) {
      wrongAnswers = shuffleArray(sameCategory).slice(0, 3).map((e) => e.term);
    } else {
      const pool = [...sameCategory, ...shuffleArray(otherCategory)];
      wrongAnswers = pool.slice(0, 3).map((e) => e.term);
    }

    const options = shuffleArray([entry.term, ...wrongAnswers]);

    return {
      question: entry.description,
      correctAnswer: entry.term,
      options,
    };
  });
}

export function GlossaryPage() {
  const [entries, setEntries] = useState<GlossaryEntry[]>([]);
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [answers, setAnswers] = useState<(string | null)[]>([null, null]);
  const [states, setStates] = useState<AnswerState[]>(['unanswered', 'unanswered']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGlossary() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/glossary`);

        if (!response.ok) {
          throw new Error(`용어 사전을 불러오지 못했습니다. (${response.status})`);
        }

        const data = (await response.json()) as GlossaryEntry[];
        setEntries(data);
        setQuizzes(generateQuizzes(data));
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    void fetchGlossary();
  }, []);

  const handleNewQuiz = useCallback(() => {
    setQuizzes(generateQuizzes(entries));
    setAnswers([null, null]);
    setStates(['unanswered', 'unanswered']);
  }, [entries]);

  function handleSelect(quizIndex: number, option: string) {
    if (states[quizIndex] !== 'unanswered') return;

    const newAnswers = [...answers];
    newAnswers[quizIndex] = option;
    setAnswers(newAnswers);

    const newStates = [...states];
    newStates[quizIndex] = option === quizzes[quizIndex].correctAnswer ? 'correct' : 'incorrect';
    setStates(newStates);
  }

  function getOptionStyle(quizIndex: number, option: string): string {
    const base = 'w-full text-left px-4 py-3 rounded-lg border-2 font-medium transition-colors';

    if (states[quizIndex] === 'unanswered') {
      return `${base} border-gray-200 bg-white hover:border-amber-500 hover:bg-amber-50 cursor-pointer`;
    }

    if (option === quizzes[quizIndex].correctAnswer) {
      return `${base} border-lime-500 bg-lime-50 text-lime-800`;
    }

    if (option === answers[quizIndex] && states[quizIndex] === 'incorrect') {
      return `${base} border-red-500 bg-red-50 text-red-800`;
    }

    return `${base} border-gray-200 bg-gray-50 text-gray-400 cursor-default`;
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 grid content-center p-8">
        <div className="w-full max-w-2xl mx-auto text-center">
          <p className="text-gray-500 text-lg" data-testid="glossary-loading">
            용어 사전을 불러오는 중...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 grid content-center p-8">
        <div className="w-full max-w-2xl mx-auto text-center">
          <p className="text-red-600 text-lg" data-testid="glossary-error">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-5 py-2.5 rounded-lg bg-amber-700 text-white font-semibold hover:bg-amber-800 transition-colors"
            data-testid="glossary-retry-button"
          >
            다시 시도
          </button>
        </div>
      </main>
    );
  }

  if (entries.length < 4) {
    return (
      <main className="min-h-screen bg-gray-50 grid content-center p-8">
        <div className="w-full max-w-2xl mx-auto text-center">
          <p className="text-gray-500 text-lg" data-testid="glossary-insufficient">
            퀴즈를 생성하려면 최소 4개 이상의 용어가 필요합니다.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="w-full max-w-2xl mx-auto">
        <header className="mb-8">
          <p className="mb-2 text-orange-600 text-sm font-bold uppercase tracking-wide">
            Home Fit AI
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            공공주택 용어 퀴즈
          </h1>
          <p className="mt-2 text-gray-500">
            설명을 읽고 올바른 용어를 맞춰보세요!
          </p>
        </header>

        <div className="grid gap-6" data-testid="glossary-quiz-container">
          {quizzes.map((quiz, quizIndex) => (
            <section
              key={`${quiz.correctAnswer}-${quizIndex}`}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
              data-testid={`glossary-quiz-${quizIndex}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-700 text-sm font-bold">
                  {quizIndex + 1}
                </span>
                {states[quizIndex] === 'correct' && (
                  <span className="text-lime-600 text-sm font-semibold" data-testid={`glossary-quiz-${quizIndex}-correct`}>
                    정답! 🎉
                  </span>
                )}
                {states[quizIndex] === 'incorrect' && (
                  <span className="text-red-600 text-sm font-semibold" data-testid={`glossary-quiz-${quizIndex}-incorrect`}>
                    오답 😅
                  </span>
                )}
              </div>

              <p className="text-gray-800 text-lg font-medium mb-4 leading-relaxed">
                "{quiz.question}"
              </p>

              <div className="grid gap-2">
                {quiz.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSelect(quizIndex, option)}
                    disabled={states[quizIndex] !== 'unanswered'}
                    className={getOptionStyle(quizIndex, option)}
                    data-testid={`glossary-quiz-${quizIndex}-option-${option}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleNewQuiz}
            className="px-6 py-3 rounded-lg bg-amber-700 text-white font-semibold hover:bg-amber-800 transition-colors"
            data-testid="glossary-new-quiz-button"
          >
            🔄 다른 퀴즈
          </button>
        </div>
      </div>
    </main>
  );
}
