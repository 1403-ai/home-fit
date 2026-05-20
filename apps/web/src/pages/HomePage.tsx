import { Link } from 'react-router-dom';
import { HomeIllustration } from '../components/illustrations/HomeIllustration';
import { checkProfileCompletion } from '../utils/profile';

export function HomePage() {
  const profileComplete = checkProfileCompletion();

  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-orange-50 via-white to-amber-50">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 pt-12 pb-8 md:pt-20 md:pb-16">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* 텍스트 영역 */}
          <div className="flex-1 text-center md:text-left">
            <p
              className="text-sm font-semibold text-orange-600 tracking-wide uppercase mb-3"
              data-testid="home-hero-badge"
            >
              AI 공공주택 매칭 서비스
            </p>
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
              data-testid="home-hero-title"
            >
              복잡한 공고문,
              <br />
              <span className="text-orange-600">이제 쉽게 확인하세요</span>
            </h1>
            <p
              className="mt-5 text-gray-600 text-lg leading-relaxed max-w-lg"
              data-testid="home-hero-description"
            >
              수십 페이지의 임대·청약 공고문을 직접 읽을 필요 없어요.
              AI가 분석한 결과로 나에게 맞는 공공주택을 빠르게 찾아보세요.
            </p>

            {/* CTA 버튼 */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link
                to="/announcements"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-orange-600 text-white font-semibold text-base hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200"
                data-testid="home-cta-announcements"
              >
                공고 목록 보기
              </Link>
              <Link
                to={profileComplete ? '/my-profile' : '/onboarding'}
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white border-2 border-orange-200 text-orange-700 font-semibold text-base hover:bg-orange-50 transition-colors"
                data-testid="home-cta-profile"
              >
                {profileComplete ? '내 정보 보기' : '내 정보 입력하기'}
              </Link>
            </div>
          </div>

          {/* 일러스트 영역 */}
          <div className="flex-shrink-0 w-64 md:w-80">
            <HomeIllustration className="w-full h-auto drop-shadow-lg" />
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section
        className="max-w-5xl mx-auto px-4 py-12 md:py-16"
        aria-labelledby="features-heading"
      >
        <h2
          id="features-heading"
          className="text-center text-2xl md:text-3xl font-bold text-gray-900 mb-3"
          data-testid="home-features-heading"
        >
          이렇게 도와드려요
        </h2>
        <p className="text-center text-gray-500 mb-10 max-w-md mx-auto">
          어려운 용어, 복잡한 조건표 걱정 마세요. 3단계로 끝나요.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <article
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            data-testid="home-feature-analysis"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI 공고 분석</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              PDF 공고문을 AI가 자동으로 읽고, 자격 조건·비용·일정을 깔끔하게 정리해드려요.
            </p>
          </article>

          {/* Feature 2 */}
          <article
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            data-testid="home-feature-qa"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">간단한 Q&A</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              몇 가지 질문에 답하면 내가 신청할 수 있는 주택인지 바로 확인할 수 있어요.
            </p>
          </article>

          {/* Feature 3 */}
          <article
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            data-testid="home-feature-cost"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">비용 한눈에</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              보증금, 월세, 분양가까지 한눈에 비교하고 나에게 맞는 금액대를 확인하세요.
            </p>
          </article>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div
          className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-2xl p-8 text-center"
          data-testid="home-bottom-cta"
        >
          <p className="text-gray-700 text-lg font-medium mb-4">
            지금 바로 나에게 맞는 공공주택을 찾아보세요
          </p>
          <Link
            to="/announcements"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200"
            data-testid="home-bottom-cta-button"
          >
            공고 목록 보러가기 →
          </Link>
        </div>
      </section>
    </main>
  );
}
