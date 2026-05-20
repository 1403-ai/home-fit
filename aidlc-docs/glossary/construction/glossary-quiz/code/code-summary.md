# Code Generation Summary - 용어집 퀴즈 페이지

## Generated Files

| 파일 | 유형 | 설명 |
|------|------|------|
| `apps/web/src/pages/GlossaryPage.tsx` | Created | 퀴즈 페이지 컴포넌트 |
| `apps/web/src/App.tsx` | Modified | `/glossary` 라우트 추가 |

## Implementation Details

### GlossaryPage.tsx
- **API 호출**: `GET https://www.homefit1403.site/api/glossary` (VITE_API_BASE_URL 환경변수 지원)
- **퀴즈 생성 로직**:
  - 전체 용어 목록에서 랜덤 2개 선택
  - 각 문제: 설명(description) 제시 → 4개 용어(term) 보기
  - 오답 보기: 같은 카테고리 우선, 부족 시 다른 카테고리에서 보충
  - 보기 순서 랜덤 셔플
- **피드백**: 즉시 정답/오답 표시 (정답: 초록, 오답: 빨강 + 정답 강조)
- **재생성**: "다른 퀴즈" 버튼으로 새 문제 생성
- **에러 처리**: 로딩 상태, API 에러, 용어 부족(4개 미만) 안내
- **접근성**: `data-testid` 속성, 시맨틱 HTML, 반응형 레이아웃

### App.tsx (Modified)
- `GlossaryPage` import 추가
- `<Route path="/glossary" element={<GlossaryPage />} />` 라우트 등록
