# Technology Stack

## Programming Languages
- TypeScript - 5.4.5 - API 및 Web 전체

## Frameworks
- NestJS - 10.3.8 - 백엔드 API 및 Worker
- React - 18.3.1 - 프론트엔드 SPA
- React Router - 7.15.1 - 클라이언트 라우팅
- Mongoose - 8.4.0 - MongoDB ODM

## Infrastructure
- MongoDB - 8.0 - 주 데이터베이스
- Nginx - latest - 리버스 프록시 + 정적 파일 서빙
- Docker Compose - 로컬 개발 및 프로덕션 오케스트레이션
- AWS EC2 - 프로덕션 호스팅 (Amazon Linux 2023)
- Terraform - AWS 인프라 프로비저닝

## Build Tools
- npm workspaces - 모노레포 관리
- NestJS CLI - 10.3.2 - API 빌드
- Vite - 7.0.0 - Web 빌드 및 개발 서버
- Docker Buildx - 멀티 아키텍처 이미지 빌드

## Testing Tools
- Jest - 29.7.0 - 단위 테스트 (API)
- ts-jest - 29.1.2 - TypeScript Jest 변환

## CI/CD
- GitHub Actions - CI/CD 파이프라인
- GitHub Container Registry (GHCR) - Docker 이미지 저장소

## Linting
- ESLint - 8.57.0 - 코드 린팅
- @typescript-eslint - 7.9.0 - TypeScript ESLint 규칙
