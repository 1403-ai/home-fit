# Infrastructure Design - PDF 분석 파이프라인

## 1. 인프라 구성 요소 매핑

| 논리 컴포넌트 | AWS 서비스 | 설명 |
|---|---|---|
| PDF 저장소 | S3 | 단일 버킷, prefix 기반 구분 |
| 이벤트 트리거 | S3 Event Notification → Lambda | `raw-pdfs/` prefix에 `.pdf` 업로드 시 |
| PDF 분석기 | Lambda + Bedrock | TypeScript Lambda가 Bedrock Claude Opus 4 호출 |
| 문서 DB | DocumentDB | MongoDB 호환, Q&A 상태 머신 저장 |
| API 서버 | EC2 (기존) | DocumentDB에서 데이터 조회하여 서빙 |
| 네트워크 | VPC + Subnets + NAT Gateway | Lambda ↔ DocumentDB ↔ EC2 통신 |

---

## 2. S3 버킷 설계

```
Bucket: home-fit-documents-{account_id}
├── raw-pdfs/          ← 크롤러가 PDF 업로드 (Lambda 트리거)
└── processed/         ← 처리 완료 마킹용 (선택적)
```

- **버킷 정책**: Lambda Role에 GetObject 권한
- **이벤트 알림**: `s3:ObjectCreated:*` → Lambda (prefix: `raw-pdfs/`, suffix: `.pdf`)
- **버저닝**: 비활성화 (비용 절감)
- **암호화**: SSE-S3 (기본 암호화)

---

## 3. Lambda 함수 설계

| 속성 | 값 |
|---|---|
| 함수명 | `home-fit-pdf-analyzer` |
| 런타임 | Node.js 20.x (TypeScript 빌드) |
| 메모리 | 1024 MB |
| 타임아웃 | 900초 (15분, PDF 분석 소요 시간 고려) |
| VPC | Default VPC (Private Subnets) |
| 환경변수 | `DOCDB_ENDPOINT`, `DOCDB_USERNAME`, `DOCDB_PASSWORD`, `BEDROCK_MODEL_ID` |

### IAM Role 권한
- `s3:GetObject` — PDF 파일 읽기
- `bedrock:InvokeModel` — Claude Opus 4 호출
- VPC 실행 권한 (`AWSLambdaVPCAccessExecutionRole`)
- CloudWatch Logs 쓰기

---

## 4. DocumentDB 설계

| 속성 | 값 |
|---|---|
| 클러스터명 | `home-fit-docdb` |
| 엔진 버전 | 5.0 (MongoDB 5.0 호환) |
| 인스턴스 클래스 | `db.t3.medium` (MVP, 최소 비용) |
| 인스턴스 수 | 1 (단일 인스턴스, MVP) |
| 포트 | 27017 |
| 마스터 사용자 | `homefit_admin` |
| 스토리지 암호화 | 활성화 |
| 백업 보존 | 7일 |

### 보안 그룹
- **Inbound**: TCP 27017 from Lambda SG + EC2 SG
- **Outbound**: All (기본)

---

## 5. 네트워크 아키텍처

### 현재 상태
- Default VPC 사용 중
- EC2는 Public Subnet에 배치

### 추가 필요 사항

```
Default VPC
├── Public Subnets (기존)
│   └── EC2 (API 서버) ─────────────────────┐
├── Private Subnets (신규 생성)              │
│   ├── Lambda (PDF Analyzer)               │
│   │   └── → DocumentDB (TCP 27017)       │
│   │   └── → NAT Gateway (Bedrock API)    │
│   └── DocumentDB Cluster                  │
│       └── ← Lambda (TCP 27017)            │
│       └── ← EC2 (TCP 27017) ─────────────┘
└── NAT Gateway (신규)
    └── Lambda → Internet (Bedrock API 호출)
```

### 서브넷 구성
- **Private Subnet A** (AZ-a): Lambda + DocumentDB
- **Private Subnet B** (AZ-b): DocumentDB (서브넷 그룹 요구사항, 최소 2 AZ)
- **NAT Gateway**: Public Subnet에 배치, Lambda의 인터넷 접근용

### 보안 그룹 구성

| 보안 그룹 | Inbound | Outbound |
|---|---|---|
| `home-fit-lambda-sg` | — (Lambda는 inbound 불필요) | TCP 27017 → DocumentDB SG, TCP 443 → 0.0.0.0/0 (Bedrock) |
| `home-fit-docdb-sg` | TCP 27017 ← Lambda SG, TCP 27017 ← EC2 SG | All |
| `home-fit-sg` (기존 EC2) | 기존 유지 | TCP 27017 → DocumentDB SG 추가 |

---

## 6. Bedrock 접근

- **모델 ID**: `us.anthropic.claude-opus-4-0-20250514`
- **리전**: us-east-1
- **접근 방식**: Lambda → NAT Gateway → Bedrock API (HTTPS)
- **IAM 정책**: `bedrock:InvokeModel` on `arn:aws:bedrock:us-east-1::foundation-model/us.anthropic.claude-opus-4-0-20250514`

---

## 7. 비용 예상 (월간, MVP 기준)

| 서비스 | 예상 비용 |
|---|---|
| DocumentDB (db.t3.medium, 단일) | ~$56/월 |
| NAT Gateway | ~$32/월 + 데이터 전송 |
| Lambda | 사용량 기반 (소량이면 무료 티어) |
| S3 | 거의 무시 가능 |
| Bedrock (Claude Opus 4) | 사용량 기반 (PDF 건수에 비례) |
| **합계 (인프라 고정비)** | **~$90/월** |

---

## 8. Terraform 리소스 목록

aws-infra/ 폴더에 추가할 리소스:

1. **네트워킹**
   - `aws_subnet` (private, 2개 AZ)
   - `aws_eip` (NAT Gateway용)
   - `aws_nat_gateway`
   - `aws_route_table` (private)
   - `aws_route_table_association` (private subnets)

2. **S3**
   - `aws_s3_bucket`
   - `aws_s3_bucket_notification`

3. **Lambda**
   - `aws_lambda_function`
   - `aws_lambda_permission` (S3 trigger)
   - `aws_iam_role` (Lambda execution role)
   - `aws_iam_role_policy` (S3, Bedrock, VPC, Logs)
   - `aws_security_group` (Lambda)
   - `aws_cloudwatch_log_group`

4. **DocumentDB**
   - `aws_docdb_cluster`
   - `aws_docdb_cluster_instance`
   - `aws_docdb_subnet_group`
   - `aws_security_group` (DocumentDB)

5. **기존 리소스 수정**
   - `aws_security_group.ec2` — DocumentDB 접근 egress 추가
