# Code Generation Plan - PDF Pipeline Infrastructure

## Unit Context
- **Unit Name**: pdf-pipeline
- **Project Type**: Brownfield (기존 Terraform 인프라에 추가)
- **Workspace Root**: /Users/junhyung/Projects/home-fit
- **Code Location**: /Users/junhyung/Projects/home-fit/aws-infra/
- **Existing Files to Modify**: `main.tf` (EC2 SG egress 추가), `variables.tf` (새 변수), `outputs.tf` (새 출력)

## Dependencies
- 기존 `aws_vpc.default`, `aws_security_group.ec2` 리소스 참조
- 기존 `data.aws_subnets.default` 참조

---

## Generation Steps

### Step 1: networking.tf — Private Subnets, NAT Gateway, Route Tables
- [x] Private Subnet 2개 생성 (2 AZ, DocumentDB 서브넷 그룹 요구사항)
- [x] Elastic IP 생성 (NAT Gateway용)
- [x] NAT Gateway 생성 (Public Subnet에 배치)
- [x] Private Route Table 생성 (0.0.0.0/0 → NAT Gateway)
- [x] Route Table Association (Private Subnets)

### Step 2: s3.tf — S3 Bucket, Event Notification
- [x] S3 버킷 생성 (SSE-S3 암호화, 버저닝 비활성화)
- [x] S3 버킷 퍼블릭 액세스 차단
- [x] S3 이벤트 알림 설정 (raw-pdfs/ prefix, .pdf suffix → Lambda)
- [x] Lambda permission for S3 invocation

### Step 3: lambda.tf — Lambda Function, IAM Role, Security Group
- [x] Lambda 실행 IAM Role 생성
- [x] IAM Policy 생성 (S3 GetObject, Bedrock InvokeModel, VPC, CloudWatch Logs)
- [x] Lambda Security Group 생성
- [x] CloudWatch Log Group 생성
- [x] Lambda Function 리소스 생성 (placeholder zip, VPC 설정)

### Step 4: documentdb.tf — DocumentDB Cluster, Instance, Subnet Group, Security Group
- [x] DocumentDB Security Group 생성
- [x] DocumentDB Subnet Group 생성 (Private Subnets)
- [x] DocumentDB Cluster 생성
- [x] DocumentDB Cluster Instance 생성

### Step 5: variables.tf 수정 — 새 변수 추가
- [x] DocumentDB 관련 변수 (master_username, master_password, instance_class)
- [x] Lambda 관련 변수 (memory_size, timeout)
- [x] S3 관련 변수 (bucket_name)

### Step 6: outputs.tf 수정 — 새 출력 추가
- [x] DocumentDB endpoint 출력
- [x] S3 bucket name 출력
- [x] Lambda function ARN 출력
- [x] NAT Gateway public IP 출력

### Step 7: main.tf 수정 — 기존 EC2 Security Group에 DocumentDB egress 추가
- [x] EC2 SG에 TCP 27017 outbound → DocumentDB SG 추가 (기존 "All outbound" egress로 이미 충족)

### Step 8: Documentation Summary
- [x] `aidlc-docs/construction/pdf-pipeline/code/code-summary.md` 생성

---

## Total Steps: 8
## Estimated Scope: 4개 신규 Terraform 파일 + 3개 기존 파일 수정 + 1개 문서
