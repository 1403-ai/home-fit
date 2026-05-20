# 요구사항 문서: 입력폼 수정 및 Validation 강화

## Intent Analysis
- **User Request**: 입력폼 수정 (결혼상태 3가지 선택지 변경, 가구원수 validation 강화, 완료화면 변경, my-profile 페이지 추가)
- **Request Type**: Enhancement (기존 기능 개선 + 새 페이지 추가)
- **Scope**: Multiple Components (폼 컴포넌트, validation, 라우팅, 새 페이지)
- **Complexity**: Moderate

---

## Functional Requirements

### FR-1: 결혼상태 필드 변경
- **현재**: `isMarried: boolean` (예/아니오)
- **변경**: `marriageStatus: 'single' | 'married' | 'engaged'` (미혼/기혼/결혼예정)
- **조건부 로직**:
  - `married` (기혼): 혼인신고일 입력 필수
  - `engaged` (결혼예정): 혼인신고일 입력 없음 (null)
  - `single` (미혼): 혼인신고일 입력 없음 (null)

### FR-2: 가구원수 Validation 강화
- **최소값 계산 로직**:
  - 본인: 1 (기본값)
  - 결혼상태가 `married` 또는 `engaged`: +1
  - 미성년 자녀수: +자녀수
  - **최소 가구원수** = 1(본인) + (기혼/결혼예정 ? 1 : 0) + 미성년자녀수
- **Validation Rule**: 입력된 가구원수 >= 최소 가구원수
- **에러 메시지**: "가구원수는 최소 {최소값}명 이상이어야 합니다. (본인 + 배우자 + 미성년 자녀수)"
- **참고**: 미성년자녀가 아닌 자녀가 있을 수 있으므로 최소값 체크만 수행 (최대값 제한 없음)

### FR-3: 완료 화면 변경
- **현재**: "다시 입력하기" 버튼
- **변경**: "홈으로" 버튼 (클릭 시 `/` 경로로 이동)

### FR-4: My Profile 페이지 추가
- **경로**: `/my-profile`
- **기능**:
  - 로컬스토리지에 저장된 프로필 데이터를 읽어서 표시
  - StepComplete와 동일한 레이아웃으로 정보 표시
  - 수정 기능 포함 (온보딩 페이지로 이동하여 수정 가능)
  - 데이터가 없을 경우: "아직 입력된 정보가 없습니다" 안내 + 온보딩 페이지로 이동 버튼
- **홈 페이지 연동**: 홈 페이지에 "내 정보 확인" 버튼/링크 추가

---

## Non-Functional Requirements

### NFR-1: 데이터 호환성
- 기존 로컬스토리지에 저장된 `isMarried: boolean` 데이터와의 하위 호환성 고려
- 마이그레이션 로직: `isMarried: true` → `marriageStatus: 'married'`, `isMarried: false` → `marriageStatus: 'single'`

### NFR-2: UX
- Validation 에러 메시지는 사용자가 이해하기 쉽게 최소 가구원수 계산 근거를 표시
- 결혼상태 변경 시 관련 필드(혼인신고일) 즉시 반응

---

## 변경 영향 범위

| 파일 | 변경 내용 |
|------|-----------|
| `types/profile.ts` | `isMarried` → `marriageStatus` 타입 변경 |
| `utils/validation.ts` | 가구원수 최소값 validation 추가, 결혼상태 관련 validation 수정 |
| `utils/storage.ts` | 데이터 마이그레이션 로직 추가 |
| `components/steps/Step2Household.tsx` | 결혼상태 3가지 라디오 버튼으로 변경 |
| `components/steps/StepComplete.tsx` | "다시 입력하기" → "홈으로" 버튼 변경 |
| `components/OnboardingForm.tsx` | 결혼상태 핸들러 수정 |
| `pages/MyProfilePage.tsx` | 새 페이지 생성 |
| `pages/HomePage.tsx` | "내 정보 확인" 버튼 추가 |
| `App.tsx` | `/my-profile` 라우트 추가 |
