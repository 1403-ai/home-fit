import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { checkProfileCompletion } from '../utils/profile';

/**
 * Global Navigation Bar — 모든 페이지 상단에 표시되는 공통 네비게이션.
 * 프로필 완성 여부에 따라 "내 정보 입력하기" / "내 정보 보기"를 동적으로 전환합니다.
 */
export function GNB() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const profileComplete = checkProfileCompletion();

  const navItems = [
    {
      label: profileComplete ? '내 정보 보기' : '내 정보 입력하기',
      to: profileComplete ? '/my-profile' : '/onboarding',
      testId: 'gnb-profile-link',
    },
    {
      label: '공고 목록',
      to: '/announcements',
      testId: 'gnb-announcements-link',
    },
    {
      label: '용어 퀴즈',
      to: '/glossary',
      testId: 'gnb-glossary-link',
    },
  ];

  function isActive(path: string): boolean {
    return location.pathname === path;
  }

  return (
    <nav
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm"
      aria-label="메인 네비게이션"
      data-testid="gnb"
    >
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* 로고 */}
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-bold text-orange-600 hover:text-orange-700 transition-colors"
          data-testid="gnb-logo"
        >
          <span className="text-xl" aria-hidden="true">🏠</span>
          <span>Home Fit</span>
        </Link>

        {/* 데스크톱 네비게이션 */}
        <ul className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.to)
                    ? 'bg-orange-50 text-orange-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                data-testid={item.testId}
                aria-current={isActive(item.to) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* 모바일 햄버거 버튼 */}
        <button
          type="button"
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="gnb-mobile-menu"
          aria-label="메뉴 열기"
          data-testid="gnb-mobile-toggle"
        >
          {isMobileMenuOpen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {isMobileMenuOpen && (
        <div
          id="gnb-mobile-menu"
          className="md:hidden border-t border-gray-100 bg-white px-4 py-3"
        >
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.to)
                      ? 'bg-orange-50 text-orange-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  data-testid={`${item.testId}-mobile`}
                  aria-current={isActive(item.to) ? 'page' : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
