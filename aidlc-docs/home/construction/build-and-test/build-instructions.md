# Build Instructions — Home 페이지

## Prerequisites
- **Build Tool**: Vite 5.x + TypeScript 5.x
- **Dependencies**: Node.js 18+, npm
- **Environment Variables**: `VITE_API_BASE_URL` (optional, defaults to `/api`)
- **System Requirements**: macOS/Linux, 512MB RAM

## Build Steps

### 1. Install Dependencies
```bash
cd apps/web
npm install
```

### 2. TypeScript Type Check
```bash
npx tsc -b --noEmit
```
> Note: 기존 test 파일(vitest/fast-check 관련)에서 타입 에러가 발생할 수 있으나, 이는 dev dependency 미설치로 인한 것으로 빌드에 영향 없음.

### 3. Build Production Bundle
```bash
npm run build
```

### 4. Verify Build Success
- **Expected Output**: `✓ built in XXXms` 메시지
- **Build Artifacts**: `dist/` 디렉토리
  - `dist/index.html`
  - `dist/assets/index-*.css`
  - `dist/assets/index-*.js`
- **Common Warnings**: 없음

## Preview (로컬 확인)
```bash
npm run preview
```
브라우저에서 `http://localhost:4173` 접속하여 확인.

## Troubleshooting

### Build Fails with Module Not Found
- **Cause**: 의존성 미설치
- **Solution**: `npm install` 재실행

### TypeScript Errors in New Files
- **Cause**: 타입 불일치
- **Solution**: `npx tsc -b --noEmit`으로 에러 위치 확인 후 수정
