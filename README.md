# Home Fit AI

React, NestJS, MongoDB, Nginx, Docker Compose 배포 환경을 확인하기 위한 최소 서비스입니다.

## 기술 스택

- Web: Vite + React + TypeScript
- API: NestJS + MongoDB health check
- Worker: NestJS application context + scheduler scaffold
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
- `home-fit-ai-worker-1`
- `home-fit-ai-nginx-1`

MongoDB는 `healthy`로 표시되면 정상입니다.
Worker는 HTTP 포트를 열지 않고, 크롤링/분석 같은 백그라운드 작업을 처리하기 위한 프로세스로 실행됩니다.
Web 정적 파일은 별도 web 컨테이너 없이 Nginx 컨테이너에서 직접 서빙됩니다.

### 접속 확인

브라우저에서 확인:

- Web: http://localhost
- API health: http://localhost/api/health
- Worker 수동 트리거: `POST http://localhost/api/worker/trigger`

터미널에서 확인:

```bash
curl http://localhost/api/health
```

Worker 수동 트리거:

```bash
curl -X POST http://localhost/api/worker/trigger
```

정상 응답 예시:

```json
{
  "job": {
    "source": "manual",
    "status": "success",
    "mongo": {
      "connected": true,
      "readyState": 1,
      "database": "homefit"
    },
    "message": "Worker manual trigger executed"
  }
}
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
- `POST /api/worker/trigger` 응답의 `job.status`가 `success`입니다.

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

Worker 로그:

```bash
docker compose logs -f worker
```

Worker가 정상 실행되면 아래와 비슷한 로그가 보입니다.

```text
Worker application context started
Worker is ready for scheduled crawling and analysis jobs
MongoDB connected (readyState=1, database=homefit)
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
docker compose logs -f worker
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
