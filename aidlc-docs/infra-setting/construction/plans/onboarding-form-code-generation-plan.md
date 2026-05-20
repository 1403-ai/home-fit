# Code Generation Plan: 온보딩 폼 (Onboarding Form)

## Unit Context
- **Unit**: 온보딩 프로필 입력 폼
- **Workspace Root**: /Users/hongjae_eum/Desktop/projects/home-fit
- **Target Package**: apps/web
- **Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS, react-router-dom

## Dependencies
- Tailwind CSS (신규 도입)
- react-router-dom (신규 도입)

## Code Generation Steps

### Step 1: Install Dependencies
- [x] `apps/web`에 tailwindcss, postcss, autoprefixer 설치
- [x] `apps/web`에 react-router-dom 설치
- [x] package.json 업데이트 확인

### Step 2: Tailwind CSS Configuration
- [x] `apps/web/tailwind.config.js` 생성
- [x] `apps/web/postcss.config.js` 생성
- [x] `apps/web/src/styles.css`에 Tailwind directives 추가

### Step 3: TypeScript Types Definition
- [x] `apps/web/src/types/profile.ts` 생성
  - UserProfile 인터페이스
  - Region 타입 (17개 시도)
  - 폼 유효성 검증 에러 타입

### Step 4: React Router Setup
- [x] `apps/web/src/App.tsx` 수정 — BrowserRouter + Routes 구성
- [x] 라우트 정의: `/` (홈), `/onboarding` (온보딩 폼)
- [x] `apps/web/src/pages/HomePage.tsx` 생성 (기존 홈 화면 이동)
- [x] `apps/web/src/pages/OnboardingPage.tsx` 생성 (폼 페이지 래퍼)

### Step 5: Onboarding Form Component
- [x] `apps/web/src/components/OnboardingForm.tsx` 생성
  - 9개 필드 입력 UI
  - 결혼 여부에 따른 결혼기념일 조건부 렌더링
  - 미성년 자녀 생년월일 동적 추가/삭제
  - 지역 선택 드롭다운 (17개 시도)
  - 폼 상태 관리 (useState)
  - 폼 제출 핸들러 (console.log 출력)
  - data-testid 속성 추가

### Step 6: Form Validation
- [x] `apps/web/src/utils/validation.ts` 생성
  - 필수 필드 검증
  - 숫자 범위 검증 (가구원 수 >= 1, 금액 >= 0)
  - 날짜 유효성 검증
  - 에러 메시지 반환

### Step 7: Form Styling (Tailwind)
- [x] OnboardingForm 컴포넌트에 Tailwind 클래스 적용
  - 반응형 레이아웃
  - 입력 필드 스타일링
  - 에러 상태 표시
  - 버튼 스타일링

### Step 8: Vite Config Update
- [x] `apps/web/vite.config.ts` 확인/수정 (필요 시)
  - PostCSS/Tailwind는 postcss.config.js로 자동 인식, 변경 불필요

### Step 9: Documentation
- [x] `aidlc-docs/construction/onboarding-form/code/code-summary.md` 생성
  - 생성된 파일 목록
  - 컴포넌트 구조 설명
  - 데이터 흐름 설명

## File Map

| 파일 | 작업 | 설명 |
|------|------|------|
| apps/web/package.json | 수정 | 의존성 추가 |
| apps/web/tailwind.config.js | 생성 | Tailwind 설정 |
| apps/web/postcss.config.js | 생성 | PostCSS 설정 |
| apps/web/src/styles.css | 수정 | Tailwind directives |
| apps/web/src/types/profile.ts | 생성 | 타입 정의 |
| apps/web/src/App.tsx | 수정 | 라우터 구성 |
| apps/web/src/pages/HomePage.tsx | 생성 | 기존 홈 이동 |
| apps/web/src/pages/OnboardingPage.tsx | 생성 | 온보딩 페이지 |
| apps/web/src/components/OnboardingForm.tsx | 생성 | 폼 컴포넌트 |
| apps/web/src/utils/validation.ts | 생성 | 유효성 검증 |
| apps/web/vite.config.ts | 확인 | 필요 시 수정 |
