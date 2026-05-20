# Code Summary - 미성년 자녀 폼 수정 + 단위 변경

## 변경 일시
- **Date**: 2026-05-20T14:15:00Z

## 수정된 파일

### 1. `apps/web/src/types/profile.ts`
- `MinorChild` 인터페이스 추가: `{ isUnborn: boolean; birthDate?: string; expectedDate?: string; }`
- `UserProfile`: `minorChildrenBirthDates: string[]` → `minorChildrenCount: number` + `minorChildren: MinorChild[]`
- `FormErrors`: `minorChildrenBirthDates?: string[]` → `minorChildrenCount?: string` + `minorChildren?: string[]`

### 2. `apps/web/src/utils/validation.ts`
- 미성년 자녀 검증 로직 변경:
  - 태아 아닌 자녀: `birthDate` 필수 검증
  - 태아인 자녀: `expectedDate` 입력 시 유효 날짜 검증 (선택적)
  - `minorChildrenCount` 음수 검증 추가

### 3. `apps/web/src/components/OnboardingForm.tsx`
- 기존 `addChild`, `removeChild`, `updateChildBirthDate` 함수 제거
- 새 핸들러 추가:
  - `handleMinorChildrenCountChange`: 자녀수 변경 시 배열 자동 조정
  - `handleChildUnbornToggle`: 태아 여부 토글
  - `handleChildBirthDateChange`: 생년월일 변경
  - `handleChildExpectedDateChange`: 출산 예정일 변경
- UI 변경:
  - 미성년 자녀수 number input 추가
  - 자녀수만큼 자녀 항목 자동 렌더링 (카드 형태)
  - 각 항목에 태아 여부 체크박스
  - 태아 아닌 경우: birthDate input
  - 태아인 경우: expectedDate input (선택적)
  - 기존 "자녀 추가" / "삭제" 버튼 제거
- 단위 변경: "만원" → "원" (소득, 차량가액, 총자산)

## 빌드 검증
- **TypeScript**: ✅ No errors
- **Vite Build**: ✅ Success (629ms)

## 데이터 구조 예시
```json
{
  "minorChildrenCount": 3,
  "minorChildren": [
    { "isUnborn": false, "birthDate": "2020-03-15" },
    { "isUnborn": false, "birthDate": "2022-07-20" },
    { "isUnborn": true, "expectedDate": "2026-09-01" }
  ]
}
```
