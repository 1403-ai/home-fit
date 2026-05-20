# Code Summary — Q&A Questions Page

## Created Files

| File | Purpose |
|------|---------|
| `apps/web/src/types/qa.ts` | QAStateMachine, QuestionState, ResultState, Transition types |
| `apps/web/src/mocks/qa-state-machines.ts` | 2 mock state machines (seq 2026-0042, 2026-0039) |
| `apps/web/src/utils/qaStateMachine.ts` | evaluateTransition, isQuestionState, isResultState |
| `apps/web/src/pages/QuestionsPage.tsx` | Flash-card Q&A page component |
| `apps/web/src/pages/QuestionsPage.css` | Styles for Q&A page |
| `apps/web/src/utils/qaStateMachine.test.ts` | PBT + example-based tests |

## Modified Files

| File | Change |
|------|--------|
| `apps/web/src/App.tsx` | Added /announcements and /announcements/:seq/questions routes |
| `apps/web/src/pages/AnnouncementsPage.tsx` | Made list items clickable (navigate to Q&A) |
| `apps/web/src/pages/AnnouncementsPage.css` | Added .clickable cursor style |

## Component Structure

```
QuestionsPage
├── Progress Bar (current / total)
├── Flash Card
│   ├── Question Text
│   └── Input (boolean | number | choice)
├── Navigation (← 이전)
└── Result Card (when ResultState reached)
```

## State Machine Flow

```
[initial] → QuestionState → (answer) → evaluate transitions → next state
                                                              ├── QuestionState → continue
                                                              └── ResultState → show completion
```

## Testing Approach

- **Framework**: Vitest + fast-check
- **PBT Rules Covered**:
  - PBT-03: Invariant (always returns valid state, result in defined next states)
  - PBT-04: Deterministic (same answer → same result)
  - PBT-06: Stateful (random answer sequences stay in valid states)
  - PBT-07: Domain generators (boolean, number, choice answers)
  - PBT-08: Fixed seed (42) for reproducibility
  - PBT-10: Example-based tests complement PBT
