# Integration Test Instructions - 용어집 퀴즈 페이지

## Purpose
프론트엔드 퀴즈 페이지가 실제 API와 정상적으로 연동되는지 확인합니다.

## Test Scenarios

### Scenario 1: API 연동 - 용어 목록 조회
- **Description**: `/glossary` 페이지 진입 시 API에서 용어 목록을 정상 조회하는지 확인
- **Setup**: 브라우저에서 `https://www.homefit1403.site/glossary` 접속
- **Test Steps**:
  1. 페이지 접속
  2. 로딩 상태 표시 확인
  3. 퀴즈 2문제 정상 렌더링 확인
- **Expected Results**: 2개의 퀴즈 카드가 각각 설명 텍스트와 4개 보기를 표시
- **Cleanup**: 없음

### Scenario 2: 퀴즈 정답 선택
- **Description**: 정답 보기 클릭 시 즉시 초록색 피드백 표시
- **Test Steps**:
  1. 퀴즈 보기 중 정답 클릭
  2. 해당 보기가 초록색으로 변경되는지 확인
  3. "정답! 🎉" 텍스트 표시 확인
  4. 모든 보기 비활성화 확인
- **Expected Results**: 정답 보기 초록색 강조, 피드백 메시지 표시

### Scenario 3: 퀴즈 오답 선택
- **Description**: 오답 보기 클릭 시 빨간색 + 정답 초록색 표시
- **Test Steps**:
  1. 퀴즈 보기 중 오답 클릭
  2. 선택한 보기가 빨간색으로 변경되는지 확인
  3. 정답 보기가 초록색으로 표시되는지 확인
  4. "오답 😅" 텍스트 표시 확인
- **Expected Results**: 오답 빨강, 정답 초록, 피드백 메시지 표시

### Scenario 4: 다른 퀴즈 재생성
- **Description**: "다른 퀴즈" 버튼 클릭 시 새로운 문제 생성
- **Test Steps**:
  1. 퀴즈 1~2문제 풀기
  2. "🔄 다른 퀴즈" 버튼 클릭
  3. 새로운 문제가 표시되는지 확인
  4. 이전 답변 상태가 초기화되는지 확인
- **Expected Results**: 새로운 랜덤 문제 2개 표시, 모든 상태 초기화

## Manual Integration Test

### 1. 로컬 개발 서버 실행
```bash
cd apps/web
npm run dev
```

### 2. 브라우저에서 확인
- `http://localhost:5173/glossary` 접속
- 위 4개 시나리오 수동 확인

### 3. 프로덕션 확인
- `https://www.homefit1403.site/glossary` 접속 (배포 후)
- 동일 시나리오 확인
