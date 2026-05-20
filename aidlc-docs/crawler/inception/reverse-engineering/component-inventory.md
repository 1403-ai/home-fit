# Component Inventory

## Application Packages
- `apps/api` - NestJS 백엔드 (API 서버 + Worker 프로세스)
- `apps/web` - React SPA 프론트엔드

## Infrastructure Packages
- `aws-infra` - Terraform - AWS EC2 인프라 프로비저닝
- `infra/nginx` - Docker - 리버스 프록시 및 정적 파일 서빙

## Shared Packages
- None (현재 공유 패키지 없음)

## Test Packages
- None (테스트 프레임워크 설정됨: Jest for API, 별도 테스트 파일 없음)

## Total Count
- **Total Packages**: 4
- **Application**: 2 (api, web)
- **Infrastructure**: 2 (aws-infra, infra/nginx)
- **Shared**: 0
- **Test**: 0
