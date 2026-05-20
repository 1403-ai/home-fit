# Code Summary - Question Info Feature

## 수정된 파일

| 파일 | 변경 유형 | 설명 |
|------|-----------|------|
| `apps/web/src/utils/number-input.ts` | Modified | comma 포맷 함수 추가 (`formatNumberWithComma`, `parseCommaNumber`), 기존 함수 comma 지원 |
| `apps/web/src/components/steps/Step2Household.tsx` | Modified | `type="number"` → `type="text"` + `inputMode="numeric"` |
| `apps/web/src/components/steps/Step3Assets.tsx` | Modified | `type="number"` → `type="text"` + `inputMode="numeric"` (totalAssets, carValue, totalIncome) |
| `apps/web/src/pages/QuestionsPage.tsx` | Modified | 2컬럼 레이아웃, MyInfoPanel 통합, number input comma 포맷 |
| `apps/web/src/pages/QuestionsPage.css` | Modified | `.questions-layout` 2컬럼 레이아웃, 반응형 breakpoint |

## 생성된 파일

| 파일 | 설명 |
|------|------|
| `apps/web/src/components/MyInfoPanel.tsx` | 내 정보 사이드 패널 컴포넌트 (토글, 프로필 표시, 미입력 유도, 하이라이트) |
| `apps/web/src/components/MyInfoPanel.css` | 사이드 패널 스타일링 (반응형, 애니메이션) |

## 주요 변경 사항

### 1. 숫자 입력 Comma 포맷 (프로젝트 전체)
- 모든 숫자 입력 필드를 `type="text"` + `inputMode="numeric"`으로 변경
- 입력 시 실시간 천 단위 콤마 포맷 적용
- 내부 값은 number 타입 유지, 표시만 comma 포맷

### 2. 내 정보 사이드 패널 (QuestionsPage)
- 데스크톱(768px+): 질문 카드 오른쪽에 260px 사이드 패널
- 모바일(<768px): 질문 카드 위에 토글 형태로 접힘
- 토글 버튼으로 열기/닫기 (기본: 닫힌 상태)
- 현재 질문의 profile_key와 매칭되는 항목 하이라이트

### 3. 프로필 미입력 시 유도
- 프로필이 없으면 "내 정보를 입력하면 질문이 줄어듭니다" 메시지 표시
- 온보딩 페이지(/onboarding)로 이동하는 링크 제공

## 빌드 검증
- `npx vite build` 성공 (67 modules, 669ms)
- TypeScript 타입 체크 통과 (no errors)
