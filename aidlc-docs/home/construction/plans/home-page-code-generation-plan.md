# Code Generation Plan — Home 페이지

## Unit Context
- **Unit Name**: home-page
- **Scope**: Intro Home 페이지 + GNB 전역 컴포넌트 + Health Check 분리
- **Dependencies**: 기존 UserProfile 타입, storage.ts 유틸리티, react-router-dom
- **Target Directory**: `apps/web/src/`

---

## Code Generation Steps

### Step 1: 프로필 완성 여부 유틸리티 생성
- [x] `apps/web/src/utils/profile.ts` 생성
- [x] `isProfileComplete(profile: UserProfile | null): boolean` 함수 구현
- [x] 필수 필드 검증: region, householdSize, totalIncome, totalAssets, marriageStatus
- [x] null/undefined 체크 포함

### Step 2: SVG 일러스트레이션 컴포넌트 생성
- [x] `apps/web/src/components/illustrations/HomeIllustration.tsx` 생성
- [x] 따뜻한 톤의 집 + 가족 + 하트 SVG 일러스트 구현
- [x] 부드러운 색상 (warm orange, soft pink, light blue 계열)
- [x] `aria-label` 접근성 속성 포함
- [x] 반응형 크기 대응 (width/height props 또는 className)

### Step 3: GNB 컴포넌트 생성
- [x] `apps/web/src/components/GNB.tsx` 생성
- [x] 서비스 로고/이름 "Home Fit" 표시 (홈 링크)
- [x] "내 정보 입력하기" / "내 정보 보기" 동적 전환 (isProfileComplete 활용)
- [x] "공고 목록" 링크 (`/announcements`)
- [x] 현재 경로 active state 표시 (useLocation 활용)
- [x] `<nav>` 시맨틱 태그 + `aria-label` 접근성
- [x] 모바일 반응형 (햄버거 메뉴 또는 간소화)
- [x] `data-testid` 속성 포함

### Step 4: 새 Intro HomePage 생성
- [x] `apps/web/src/pages/HomePage.tsx` 수정 (기존 내용 완전 교체)
- [x] Hero 섹션: 서비스 소개 문구 + SVG 일러스트
  - "복잡한 공고문, 이제 쉽게 확인하세요" 등 따뜻한 카피
  - home-fit이 AI로 청약/임대 공고를 분석해준다는 핵심 메시지
- [x] Feature 섹션: 핵심 기능 3가지 카드
  - (1) AI 공고 분석 — PDF 공고문을 AI가 자동 분석
  - (2) 간단한 Q&A — 몇 가지 질문으로 자격 확인
  - (3) 비용 안내 — 보증금, 월세 등 한눈에 확인
- [x] CTA 버튼: "공고 목록 보기" (primary), "내 정보 입력하기" (secondary)
- [x] 따뜻한 색상 팔레트 (warm orange, soft cream, teal 포인트)
- [x] `data-testid` 속성 포함

### Step 5: StatusPage 생성 (기존 Health Check 분리)
- [x] `apps/web/src/pages/StatusPage.tsx` 생성
- [x] 기존 HomePage.tsx의 Health Check 로직을 그대로 이동
- [x] 기존 기능 100% 유지

### Step 6: App.tsx 수정 (GNB + 라우팅)
- [x] GNB를 Routes 바깥(상단)에 배치하여 모든 페이지에 표시
- [x] `/status` 라우트 추가 (StatusPage)
- [x] StatusPage import 추가
- [x] 기존 라우트 유지

### Step 7: 코드 요약 문서 생성
- [x] `aidlc-docs/home/construction/home-page/code/code-summary.md` 생성
- [x] 생성/수정된 파일 목록 및 역할 요약

---

## File Summary

| 파일 | 작업 | 설명 |
|------|------|------|
| `apps/web/src/utils/profile.ts` | 생성 | 프로필 완성 여부 유틸 |
| `apps/web/src/components/illustrations/HomeIllustration.tsx` | 생성 | SVG 일러스트 |
| `apps/web/src/components/GNB.tsx` | 생성 | 전역 네비게이션 바 |
| `apps/web/src/pages/HomePage.tsx` | 수정 | 새 Intro Home으로 교체 |
| `apps/web/src/pages/StatusPage.tsx` | 생성 | 기존 Health Check 분리 |
| `apps/web/src/App.tsx` | 수정 | GNB 추가 + 라우팅 수정 |
| `aidlc-docs/home/construction/home-page/code/code-summary.md` | 생성 | 코드 요약 문서 |
