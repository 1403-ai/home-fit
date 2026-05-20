# Infrastructure Design - SH Crawler

## Overview

SH 서울주택도시공사 크롤링 Lambda 함수를 위한 AWS 인프라 설계.
기존 `aws-infra/` Terraform에 리소스를 추가하며, Lambda 코드 배포는 AWS 콘솔에서 수동으로 진행.

---

## AWS Resources

### 1. S3 Bucket

| 항목 | 값 |
|------|-----|
| Bucket Name | `home-fit-documents-{account_id}` (계정별 고유) |
| Region | us-east-1 (기존 인프라와 동일) |
| Versioning | Disabled (PDF 파일 덮어쓰기 없음) |
| Encryption | AES-256 (SSE-S3) |
| Public Access | 전체 차단 (Block all public access) |
| Lifecycle | 없음 (PDF 영구 보관) |

**Object Key Pattern**:
```
announcements/{board_type}/{seq}/{filename}.pdf
```
- `board_type`: `rental` 또는 `sale`
- `seq`: 공고 고유번호
- `filename`: 원본 PDF 파일명

### 2. IAM Role (Lambda Execution Role)

| 항목 | 값 |
|------|-----|
| Role Name | `home-fit-crawler-lambda-role` |
| Trust Policy | Lambda service (`lambda.amazonaws.com`) |
| Managed Policies | `AWSLambdaBasicExecutionRole` (CloudWatch Logs) |

**Inline Policy** (`home-fit-crawler-s3-policy`):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:ListBucket",
        "s3:HeadObject"
      ],
      "Resource": [
        "arn:aws:s3:::home-fit-documents-*",
        "arn:aws:s3:::home-fit-documents-*/*"
      ]
    }
  ]
}
```

### 3. Lambda Function

| 항목 | 값 |
|------|-----|
| Function Name | `home-fit-crawler` |
| Runtime | nodejs20.x |
| Architecture | arm64 (Graviton2, 비용 효율) |
| Memory | 1024 MB |
| Timeout | 300초 (5분) |
| Handler | `index.handler` |
| Code Deploy | AWS 콘솔에서 수동 zip 업로드 |

**Environment Variables**:
| Key | Value |
|-----|-------|
| `S3_BUCKET_NAME` | S3 버킷 이름 (Terraform output 참조) |
| `NODE_ENV` | `production` |

### 4. EventBridge Scheduler

| 항목 | 값 |
|------|-----|
| Rule Name | `home-fit-crawler-schedule` |
| Schedule | `rate(12 hours)` |
| Target | Lambda function (`home-fit-crawler`) |
| State | ENABLED |
| Retry Policy | 최대 2회 재시도 |

### 5. CloudWatch Logs

| 항목 | 값 |
|------|-----|
| Log Group | `/aws/lambda/home-fit-crawler` |
| Retention | 14일 |

---

## Terraform Resource Summary

기존 `aws-infra/main.tf`에 추가할 리소스:

| Resource Type | Resource Name | Purpose |
|---------------|---------------|---------|
| `aws_s3_bucket` | `documents` | PDF 저장 버킷 |
| `aws_s3_bucket_public_access_block` | `documents` | 퍼블릭 접근 차단 |
| `aws_s3_bucket_server_side_encryption_configuration` | `documents` | SSE-S3 암호화 |
| `aws_iam_role` | `crawler_lambda` | Lambda 실행 역할 |
| `aws_iam_role_policy` | `crawler_s3` | S3 접근 정책 |
| `aws_iam_role_policy_attachment` | `crawler_basic` | CloudWatch Logs 정책 |
| `aws_lambda_function` | `crawler` | 크롤러 Lambda 함수 |
| `aws_cloudwatch_log_group` | `crawler` | 로그 그룹 |
| `aws_cloudwatch_event_rule` | `crawler_schedule` | 12시간 스케줄 |
| `aws_cloudwatch_event_target` | `crawler` | EventBridge → Lambda 연결 |
| `aws_lambda_permission` | `crawler_eventbridge` | EventBridge 호출 권한 |

---

## Security Considerations

- Lambda는 Public (VPC 외부) - SH 웹사이트 접근을 위해 NAT 불필요
- S3 버킷 퍼블릭 접근 완전 차단
- IAM 최소 권한 원칙 (S3 PutObject/GetObject/ListBucket/HeadObject만)
- Lambda 환경변수에 민감 정보 없음 (S3 버킷 이름만)

## Cost Estimate (Monthly)

| Service | Estimate |
|---------|----------|
| Lambda | ~$0 (프리티어: 월 100만 요청, 40만 GB-초) |
| S3 | ~$0.02 (PDF 수십 개, 수 MB) |
| EventBridge | ~$0 (프리티어) |
| CloudWatch Logs | ~$0 (14일 보존, 소량 로그) |
| **Total** | **~$0.02/월** |
