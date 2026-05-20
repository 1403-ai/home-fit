# Code Generation Plan - 용어집 퀴즈 페이지

## Unit Context
- **Unit Name**: glossary-quiz
- **Scope**: 프론트엔드 단일 페이지 추가
- **Dependencies**: 기존 `GET /api/glossary` API (https://www.homefit1403.site/api/glossary)
- **Target Directory**: `apps/web/src/`

## Generation Steps

### Step 1: GlossaryPage 컴포넌트 생성
- [x] `apps/web/src/pages/GlossaryPage.tsx` 생성
- 기능:
  - `/api/glossary` API 호출하여 전체 용어 목록 조회
  - 랜덤 2문제 퀴즈 생성 (설명 → 용어 맞추기, 4지선다)
  - 즉시 정답/오답 피드백 (정답: 초록, 오답: 빨강 + 정답 표시)
  - "다른 퀴즈" 버튼으로 새 문제 재생성
  - 로딩/에러 상태 처리
  - 용어 4개 미만 시 안내 메시지
  - 모바일 반응형 레이아웃
  - `data-testid` 속성 포함

### Step 2: App.tsx 라우트 추가
- [x] `apps/web/src/App.tsx`에 `/glossary` 라우트 추가
- `GlossaryPage` import 및 Route 등록

### Step 3: 코드 생성 요약 문서
- [x] `aidlc-docs/glossary/construction/glossary-quiz/code/code-summary.md` 생성
- 생성된 파일 목록 및 구현 요약
