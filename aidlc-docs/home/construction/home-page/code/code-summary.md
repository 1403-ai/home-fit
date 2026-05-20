# Code Summary — Home 페이지

## 생성된 파일

| 파일 | 역할 |
|------|------|
| `apps/web/src/utils/profile.ts` | 프로필 완성 여부 확인 유틸리티 (`isProfileComplete`, `checkProfileCompletion`) |
| `apps/web/src/components/illustrations/HomeIllustration.tsx` | 따뜻한 톤의 집+가족+하트 SVG 일러스트 컴포넌트 |
| `apps/web/src/components/GNB.tsx` | 전역 네비게이션 바 (프로필 상태 연동, 모바일 반응형) |
| `apps/web/src/pages/StatusPage.tsx` | 기존 Health Check UI (기존 HomePage에서 분리) |

## 수정된 파일

| 파일 | 변경 내용 |
|------|-----------|
| `apps/web/src/pages/HomePage.tsx` | 기존 Health Check → 새 Intro Home으로 완전 교체 |
| `apps/web/src/App.tsx` | GNB 추가 (Routes 상단), `/status` 라우트 추가, StatusPage import |

## 주요 구현 사항

### GNB (Global Navigation Bar)
- 모든 페이지 상단에 sticky로 표시
- 프로필 완성 여부에 따라 "내 정보 입력하기" ↔ "내 정보 보기" 동적 전환
- 현재 페이지 active state 표시 (orange 배경)
- 모바일: 햄버거 메뉴로 전환
- 접근성: `<nav>` + `aria-label`, `aria-current`, `aria-expanded`

### Intro HomePage
- Hero: 서비스 소개 문구 + SVG 일러스트 (좌우 배치, 모바일은 상하)
- Features: 3개 카드 (AI 공고 분석, 간단한 Q&A, 비용 안내)
- Bottom CTA: 공고 목록 유도
- 색상: warm orange 계열 그라데이션 배경

### 프로필 완성 판단 로직
- 필수 필드: region, householdSize, totalIncome, totalAssets, marriageStatus
- 모두 유효한 값이 있을 때만 "완성"으로 판단
