# Build Instructions

## Prerequisites
- **Build Tool**: Vite 5.x + TypeScript 5.x
- **Dependencies**: Node.js 18+, npm/yarn
- **Environment Variables**: 없음 (프론트엔드 전용)
- **System Requirements**: macOS/Linux/Windows

## Build Steps

### 1. Install Dependencies
```bash
cd apps/web
npm install
```

### 2. TypeScript Type Check
```bash
npx tsc --noEmit
```
- **Expected Output**: 에러 없이 완료
- **주의**: strict mode 활성화 상태

### 3. Build Production Bundle
```bash
npx vite build
```
- **Expected Output**: `dist/` 디렉토리에 번들 생성
- **Build Artifacts**:
  - `dist/index.html`
  - `dist/assets/index-*.css`
  - `dist/assets/index-*.js`

### 4. Verify Build Success
- TypeScript 컴파일 에러 없음
- Vite 빌드 성공 (51 modules transformed)
- 번들 사이즈: JS ~204KB (gzip ~65KB), CSS ~16KB (gzip ~4KB)

## Troubleshooting

### Build Fails with Import Errors
- **Cause**: 새로 생성된 컴포넌트 경로 오류
- **Solution**: `src/components/steps/` 디렉토리 존재 확인, import 경로 확인

### Build Fails with Type Errors
- **Cause**: UserProfile 타입 불일치
- **Solution**: `src/types/profile.ts`의 인터페이스와 컴포넌트 props 일치 확인
