# Code Generation Plan — Q&A Questions Page

## Unit Context
- **Unit**: Q&A 질문 페이지 (플래시카드 UI + 상태 전이)
- **Scope**: Frontend only (apps/web)
- **Dependencies**: AnnouncementsPage (click-through), existing types
- **Stories**: BT-4 (View announcement detail + Q&A state machine)

## Requirements Reference
- Route: `/announcements/:seq/questions`
- UI: 플래시카드 (1개씩, 카드 전환)
- Input types: boolean, number, choice
- Progress bar
- 이전 버튼 (답변 히스토리)
- 결과 state 도달 시 "결과 준비 완료" 메시지만 표시
- Mock QAStateMachine data

---

## Code Generation Steps

### Step 1: Q&A TypeScript Types
- [x] Create `apps/web/src/types/qa.ts`

### Step 2: Mock Q&A State Machine Data
- [x] Create `apps/web/src/mocks/qa-state-machines.ts`

### Step 3: State Transition Logic (Pure Function)
- [x] Create `apps/web/src/utils/qaStateMachine.ts`

### Step 4: QuestionsPage Component
- [x] Create `apps/web/src/pages/QuestionsPage.tsx`

### Step 5: QuestionsPage Styles
- [x] Create `apps/web/src/pages/QuestionsPage.css`

### Step 6: Route Registration + Announcements Click-Through
- [x] Modify `apps/web/src/App.tsx`
- [x] Modify `apps/web/src/pages/AnnouncementsPage.tsx`

### Step 7: Property-Based Tests
- [x] Create `apps/web/src/utils/qaStateMachine.test.ts`

### Step 8: Documentation Summary
- [x] Create `aidlc-docs/construction/qa-page/code/code-summary.md`
