# Code Generation Plan - Question Info Feature

## Unit Context
- **Unit**: question-info (내 정보 사이드 패널 + 숫자 comma 포맷)
- **Scope**: 프론트엔드 UI 개선 (apps/web)
- **Dependencies**: 기존 UserProfile 타입, storage 유틸리티, QuestionsPage

## Code Generation Steps

### Step 1: 숫자 comma 포맷 유틸리티 업데이트
- [x] `apps/web/src/utils/number-input.ts` 수정
  - `formatNumberWithComma(value: number): string` — 숫자를 comma 포맷 문자열로 변환
  - `parseCommaNumber(input: string): number` — comma 포함 문자열을 숫자로 파싱
  - 기존 `displayNumberValue`, `parseNumberInput` 함수를 comma 지원 버전으로 업데이트

### Step 2: 온보딩 폼 숫자 입력 필드 comma 적용
- [x] `apps/web/src/components/steps/Step2Household.tsx` 수정
  - `type="number"` → `type="text"` + `inputMode="numeric"` 변경
  - comma 포맷 유틸리티 적용
- [x] `apps/web/src/components/steps/Step3Assets.tsx` 수정
  - `type="number"` → `type="text"` + `inputMode="numeric"` 변경
  - comma 포맷 유틸리티 적용

### Step 3: QuestionsPage 숫자 입력 comma 적용
- [x] `apps/web/src/pages/QuestionsPage.tsx` 수정
  - number input 영역에 comma 포맷 적용
  - `type="number"` → `type="text"` + `inputMode="numeric"` 변경

### Step 4: MyInfoPanel 컴포넌트 생성
- [x] `apps/web/src/components/MyInfoPanel.tsx` 생성
  - 프로필 정보를 표시하는 사이드 패널 컴포넌트
  - 토글(접기/펼치기) 기능
  - 프로필 미입력 시 온보딩 유도 UI
  - 현재 질문과 관련된 profile_key 하이라이트
  - 반응형: 데스크톱(사이드 패널) / 모바일(토글 접힘)
- [x] `apps/web/src/components/MyInfoPanel.css` 생성
  - 사이드 패널 스타일링
  - 반응형 레이아웃 (768px 기준)
  - 토글 애니메이션

### Step 5: QuestionsPage 레이아웃 변경
- [x] `apps/web/src/pages/QuestionsPage.tsx` 수정
  - 2컬럼 레이아웃 적용 (데스크톱)
  - MyInfoPanel 통합
  - 현재 질문의 profile_key를 패널에 전달
- [x] `apps/web/src/pages/QuestionsPage.css` 수정
  - 2컬럼 레이아웃 스타일
  - 반응형 breakpoint 적용

### Step 6: 코드 요약 문서 생성
- [x] `aidlc-docs/question-info/construction/question-info/code/code-summary.md` 생성
  - 수정/생성된 파일 목록
  - 주요 변경 사항 요약
