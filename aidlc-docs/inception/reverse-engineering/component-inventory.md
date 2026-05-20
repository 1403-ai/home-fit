# Component Inventory

## Application Packages
- `@home-fit-ai/api` - NestJS 백엔드 API 서버 + Worker 프로세스
- `@home-fit-ai/web` - React 프론트엔드 SPA

## Infrastructure Packages
- `infra/nginx` - Docker/Nginx - 리버스 프록시 및 정적 파일 서빙
- `.github/workflows/deploy.yml` - GitHub Actions CI/CD - EC2 배포 파이프라인

## Shared Packages
- (없음 - 현재 공유 패키지 미존재)

## Test Packages
- (없음 - 테스트 파일 미존재, jest 설정만 있음)

## Total Count
- **Total Packages**: 2 (npm workspaces)
- **Application**: 2 (api, web)
- **Infrastructure**: 2 (nginx, GitHub Actions)
- **Shared**: 0
- **Test**: 0
