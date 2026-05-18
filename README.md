# Home Fit AI

React, NestJS, MongoDB, Nginx, Docker Compose 배포 환경을 확인하기 위한 최소 서비스입니다.

## 기술 스택

- Web: Vite + React + TypeScript
- API: NestJS + MongoDB health check
- Infra: Docker Compose + Nginx
- Local Docker Runtime: Colima
- CD: GitHub Actions to EC2

## 로컬 실행 준비

### 1. Colima 설치

macOS 기준으로 Homebrew를 사용합니다.

```bash
brew install colima docker docker-compose
```

설치 확인:

```bash
colima version
docker version
docker compose version
```

### 2. Colima 실행

```bash
colima start
```

이미 실행 중인지 확인:

```bash
colima status
docker info
```

`docker info`가 Docker 서버 정보를 보여주면 Docker daemon에 정상 연결된 상태입니다.

### 3. 환경변수 파일 생성

.env 파일을 생성해 주세요.

## 로컬 실행

### 처음 실행 또는 이미지 재빌드 실행

```bash
docker compose up -d --build
```

### 실행 상태 확인

```bash
docker compose ps
```

성공하면 아래 서비스들이 모두 `Up` 상태여야 합니다.

- `home-fit-ai-mongo-1`
- `home-fit-ai-api-1`
- `home-fit-ai-web-1`
- `home-fit-ai-nginx-1`

MongoDB는 `healthy`로 표시되면 정상입니다.

### 접속 확인

브라우저에서 확인:

- Web: http://localhost
- API health: http://localhost/api/health

터미널에서 확인:

```bash
curl http://localhost/api/health
```

정상 응답 예시:

```json
{
  "status": "ok",
  "service": "home-fit-ai-api",
  "mongo": {
    "connected": true,
    "readyState": 1,
    "database": "homefit"
  },
  "timestamp": "2026-05-18T11:55:45.413Z"
}
```

성공 기준:

- Web 화면에 `서비스 환경세팅이 준비되었습니다.` 문구가 보입니다.
- `/api/health` 응답의 `status`가 `ok`입니다.
- `/api/health` 응답의 `mongo.connected`가 `true`입니다.
- `/api/health` 응답의 `mongo.readyState`가 `1`입니다.

## 재실행 방법

### 컨테이너만 재시작

데이터를 유지한 채 컨테이너만 다시 시작합니다.

```bash
docker compose restart
```

### 컨테이너 내렸다가 다시 실행

MongoDB 데이터 volume은 유지됩니다.

```bash
docker compose down
docker compose up -d --build
```

### 로그 확인

전체 로그:

```bash
docker compose logs -f
```

API 로그:

```bash
docker compose logs -f api
```

MongoDB 로그:

```bash
docker compose logs -f mongo
```

## 로컬 데이터 초기화

MongoDB 데이터를 포함해서 완전히 초기화하려면 volume까지 삭제합니다.

```bash
docker compose down -v
docker compose up -d --build
```

주의: `down -v`는 로컬 MongoDB 데이터를 삭제합니다.

## Colima 중지와 재시작

### Colima 중지

```bash
colima stop
```

### Colima 재시작

```bash
colima start
docker compose up -d
```

Colima를 중지해도 Docker volume은 삭제되지 않습니다. `docker compose down -v`를 실행하지 않는 한 MongoDB 데이터는 유지됩니다.

## 자주 확인할 명령어

```bash
docker compose config
docker compose ps
docker compose logs -f api
docker volume ls
```

## 운영 배포 참고

EC2에서는 서버에 `.env`를 직접 생성한 뒤 실행합니다.

```bash
docker compose -f docker-compose.prod.yml up -d
```

MongoDB는 Docker network 내부에서만 `mongo:27017`로 접근합니다. EC2 보안그룹에서 `27017` 포트는 외부에 열지 않습니다.

## GitHub Actions Secrets

- `EC2_HOST`
- `EC2_USER`
- `EC2_SSH_KEY`
- `MONGO_INITDB_ROOT_USERNAME`
- `MONGO_INITDB_ROOT_PASSWORD`
