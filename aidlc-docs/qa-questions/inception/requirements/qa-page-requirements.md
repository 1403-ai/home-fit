# Q&A 페이지 - 요구사항

## Intent Analysis

- **User Request**: 공고별 Q&A 질문 페이지 구현 (플래시카드 UI, 상태 머신 기반)
- **Request Type**: New Feature
- **Scope**: Single Component (새 페이지 + 타입 + mock + 라우트 연결)
- **Complexity**: Moderate — 상태 머신 전이 로직 포함

---

## Functional Requirements

### FR-1: 공고 목록에서 Q&A 페이지 진입
- 공고 목록의 각 행 클릭 시 `/announcements/:seq/questions`로 이동
- AnnouncementsPage의 리스트 아이템을 클릭 가능하게 변경

### FR-2: Q&A 상태 머신 데이터 로딩
- 라우트 파라미터 `seq`로 해당 공고의 Q&A 상태 머신 조회
- API 미준비 → mock data 사용
- Mock: `QAStateMachine` 구조 (initial, states, meta.total_questions)

### FR-3: 플래시카드 UI
- 한 번에 질문 1개씩 표시 (카드 형태)
- 질문 유형별 입력 UI:
  - `boolean`: 예/아니오 버튼
  - `number`: 숫자 입력 + 단위 표시
  - `choice`: 선택지 버튼 목록
- Progress bar (현재 질문 / 전체 질문 수)
- 카드 전환 시 간단한 트랜지션

### FR-4: 상태 전이 로직
- 사용자 답변에 따라 transitions 배열을 순서대로 평가
- 첫 번째 매칭 조건의 next state로 이동
- 다음 state가 QuestionState면 다음 질문 표시
- 다음 state가 ResultState면 "결과 준비 완료" 메시지 표시 (결과 화면은 다음 PR)

### FR-5: 이전 질문으로 돌아가기
- "이전" 버튼으로 이전 질문으로 복귀 가능
- 답변 히스토리 유지

---

## Data Model (from spec section 4.2)

### QAStateMachine
```typescript
interface QAStateMachine {
  initial: string;
  states: Record<string, QuestionState | ResultState>;
  meta: { total_questions: number };
}
```

### QuestionState
```typescript
interface QuestionState {
  type: 'question';
  text: string;
  input: 'boolean' | 'number' | 'choice';
  unit?: string;
  options?: string[];
  profile_key?: string;
  help?: { ref: string };
  transitions: Transition[];
}
```

### Transition
```typescript
interface Transition {
  condition: { op: string; value: unknown } | 'default';
  next: string;
}
```

### ResultState
```typescript
interface ResultState {
  type: 'result';
  result: '적합' | '부적합' | '조건부';
  reason?: string;
  warnings?: string[];
  units?: ResultUnit[];
  source_url?: string;
}
```

---

## Out of Scope (다음 PR)
- 결과 화면 (적합/부적합/조건부) 렌더링
- 프로필 기반 질문 자동 스킵
- 용어 사전 툴팁
- 실제 API 연동

---

## Non-Functional Requirements
- Plain CSS (기존 스타일 톤 유지)
- 반응형 (min-width: 320px)
- data-testid 속성 포함
- PBT: 상태 전이 로직에 대한 property-based tests (fast-check)

---

## Technical Decisions
- 기존 React Router에 `/announcements/:seq/questions` 라우트 추가
- 상태 머신 전이 로직은 순수 함수로 분리 (테스트 용이)
- mock QAStateMachine 데이터 1~2개 공고분 준비
- 답변 히스토리는 컴포넌트 로컬 state (배열)로 관리
