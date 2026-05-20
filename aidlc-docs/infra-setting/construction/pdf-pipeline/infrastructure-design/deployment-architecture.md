# Deployment Architecture - PDF 분석 파이프라인

## 배포 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Default VPC (us-east-1)                         │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                        Public Subnets                                 │  │
│  │                                                                       │  │
│  │  ┌──────────────┐     ┌──────────────┐                               │  │
│  │  │   EC2        │     │ NAT Gateway  │                               │  │
│  │  │ (API Server) │     │   (EIP)      │                               │  │
│  │  │  t4g.medium  │     └──────┬───────┘                               │  │
│  │  └──────┬───────┘            │                                       │  │
│  └─────────┼────────────────────┼───────────────────────────────────────┘  │
│            │                    │                                           │
│  ┌─────────┼────────────────────┼───────────────────────────────────────┐  │
│  │         │   Private Subnets  │                                       │  │
│  │         │                    │                                       │  │
│  │         │    ┌───────────────┴──────────────┐                        │  │
│  │         │    │        Lambda                 │                        │  │
│  │         │    │   home-fit-pdf-analyzer       │                        │  │
│  │         │    │   Node.js 20.x / 1024MB      │                        │  │
│  │         │    └───────────┬──────────────────┘                        │  │
│  │         │                │                                           │  │
│  │         │    ┌───────────┴──────────────┐                            │  │
│  │         └───▶│      DocumentDB          │                            │  │
│  │              │   home-fit-docdb         │                            │  │
│  │              │   db.t3.medium           │                            │  │
│  │              │   Port 27017             │                            │  │
│  │              └──────────────────────────┘                            │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘

External Services:
┌──────────────┐     ┌──────────────────┐
│   S3 Bucket  │────▶│  Lambda Trigger  │
│  (Regional)  │     │  (Event Notif.)  │
└──────────────┘     └──────────────────┘

┌──────────────────────────────────────┐
│   Amazon Bedrock (us-east-1)         │
│   Claude Opus 4                      │
│   (Lambda → NAT GW → Bedrock API)   │
└──────────────────────────────────────┘
```

## 데이터 흐름

```
1. Crawler (EC2 Worker) → S3 (raw-pdfs/*.pdf 업로드)
2. S3 Event Notification → Lambda 트리거
3. Lambda → S3 (PDF 파일 다운로드)
4. Lambda → NAT GW → Bedrock API (PDF 분석 요청)
5. Bedrock → Lambda (분석 결과 반환)
6. Lambda → DocumentDB (Q&A 상태 머신 저장)
7. EC2 (API Server) → DocumentDB (데이터 조회)
8. EC2 (API Server) → Client (API 응답)
```

## 파일 구조 (aws-infra/)

```
aws-infra/
├── main.tf              (기존 — EC2, SG, Key Pair)
├── networking.tf        (신규 — Private Subnets, NAT GW, Route Tables)
├── s3.tf                (신규 — S3 Bucket, Event Notification)
├── lambda.tf            (신규 — Lambda Function, IAM Role, SG)
├── documentdb.tf        (신규 — DocumentDB Cluster, Instance, Subnet Group, SG)
├── variables.tf         (기존 — 새 변수 추가)
├── outputs.tf           (기존 — 새 출력 추가)
├── providers.tf         (기존 — 변경 없음)
├── terraform.tfstate    (기존)
└── user-data.sh         (기존)
```
