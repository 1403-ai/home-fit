# Build Instructions - 용어집 퀴즈 페이지

## Prerequisites
- **Build Tool**: Vite 7 + TypeScript 5.4
- **Dependencies**: Node.js 18+, npm
- **Environment Variables**: `VITE_API_BASE_URL` (optional, default: `https://www.homefit1403.site/api`)

## Build Steps

### 1. Install Dependencies
```bash
cd apps/web
npm install
```

### 2. Configure Environment (Optional)
```bash
# .env 파일에 API URL 설정 (기본값 사용 시 생략 가능)
echo "VITE_API_BASE_URL=https://www.homefit1403.site/api" > .env
```

### 3. TypeScript Type Check
```bash
cd apps/web
npx tsc --noEmit
```

### 4. Build Production Bundle
```bash
cd apps/web
npm run build
```

### 5. Verify Build Success
- **Expected Output**: `dist/` 디렉토리에 빌드 결과물 생성
- **Build Artifacts**: `dist/index.html`, `dist/assets/*.js`, `dist/assets/*.css`
- **Common Warnings**: Tailwind CSS purge 관련 경고는 무시 가능

## Troubleshooting

### Build Fails with Import Errors
- **Cause**: GlossaryPage import 경로 오류
- **Solution**: `apps/web/src/App.tsx`에서 `import { GlossaryPage } from './pages/GlossaryPage'` 확인

### TypeScript Errors
- **Cause**: 타입 불일치
- **Solution**: `npx tsc --noEmit` 실행하여 에러 위치 확인 후 수정
