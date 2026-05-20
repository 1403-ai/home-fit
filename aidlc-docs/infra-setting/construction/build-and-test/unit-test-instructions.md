# Unit Test Execution

## 테스트 프레임워크
- **권장**: Vitest + React Testing Library
- **현재 상태**: 테스트 프레임워크 미설정 (추후 도입 권장)

## 설치 (최초 1회)
```bash
cd apps/web
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

## vitest.config.ts 설정
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.ts',
  },
});
```

## 테스트 대상 및 시나리오

### 1. storage.ts 유닛 테스트
- `saveProfileToStorage()`: 정상 저장 확인
- `loadProfileFromStorage()`: 정상 로드 확인, 빈 스토리지 시 null 반환
- `hasStoredProfile()`: 데이터 존재/미존재 확인
- `clearStoredProfile()`: 삭제 확인
- JSON 파싱 에러 시 null 반환 확인

### 2. validation.ts 유닛 테스트
- `validateStep1()`: 지역 미선택 에러, 전입일 미입력 에러, 유효하지 않은 날짜 에러
- `validateStep2()`: 가구원수 0 에러, 결혼 시 혼인신고일 필수, 자녀 생년월일 필수
- `validateStep3()`: 음수 자산 에러, 자동차 보유 시 차량가액 검증, 음수 소득 에러
- `validateProfile()`: 전체 검증 통합 확인

### 3. StepIndicator 컴포넌트 테스트
- 현재 스텝 하이라이트 확인
- 완료된 스텝 체크마크 표시 확인
- 스텝 라벨 렌더링 확인

### 4. Step1Region 컴포넌트 테스트
- 지역 선택 변경 시 onChange 호출 확인
- 전입일 입력 시 onChange 호출 확인
- 에러 메시지 렌더링 확인

### 5. Step2Household 컴포넌트 테스트
- 가구원수 변경 확인
- 결혼여부 토글 시 혼인신고일 필드 표시/숨김
- 미성년 자녀수 변경 시 자녀 폼 동적 생성
- 태아 토글 시 생년월일/출산예정일 전환

### 6. Step3Assets 컴포넌트 테스트
- 총자산 입력 확인
- 자동차 보유 토글 시 차량가액 필드 표시/숨김
- 소득 입력 확인

### 7. OnboardingForm 통합 테스트
- 스텝 전환 (다음/이전) 동작 확인
- 유효성 검증 실패 시 다음 스텝 이동 불가 확인
- 로컬스토리지 저장 확인 (다음 클릭 시)
- 이전 데이터 복원 프롬프트 표시 확인
- 완료 화면 렌더링 확인

## Run Unit Tests
```bash
npx vitest --run
```

## Expected Results
- 모든 테스트 통과
- 커버리지 목표: 80% 이상
