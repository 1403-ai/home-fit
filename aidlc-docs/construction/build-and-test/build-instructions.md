# Build Instructions - PDF Pipeline Infrastructure

## Prerequisites
- **Build Tool**: Terraform >= 1.5
- **AWS CLI**: 설정 완료 (profile: `aidlc`)
- **AWS Region**: us-east-1
- **Dependencies**: hashicorp/aws ~> 5.0, hashicorp/tls ~> 4.0, hashicorp/local ~> 2.0, hashicorp/archive ~> 2.0
- **System Requirements**: macOS (darwin), terraform binary 설치됨

## Build Steps

### 1. Terraform 초기화
```bash
cd aws-infra
terraform init
```
- 이미 실행됨 (archive provider 추가 후 `terraform init -upgrade` 완료)

### 2. 환경 변수 / tfvars 설정

`aws-infra/terraform.tfvars` 파일 생성 (또는 환경변수로 전달):

```hcl
docdb_master_password = "YOUR_SECURE_PASSWORD_HERE"

# 선택적 오버라이드 (기본값 사용 시 생략 가능)
# s3_bucket_name        = "home-fit-documents"
# docdb_master_username = "homefit_admin"
# docdb_instance_class  = "db.t3.medium"
# lambda_memory_size    = 1024
# lambda_timeout        = 900
# bedrock_model_id      = "us.anthropic.claude-opus-4-0-20250514"
```

> ⚠️ `terraform.tfvars`는 `.gitignore`에 추가하여 비밀번호가 커밋되지 않도록 할 것

### 3. Terraform Plan (Dry Run)
```bash
terraform plan -out=tfplan
```

**Expected Output**:
- Plan: ~15 to add, 0 to change, 0 to destroy
- 새 리소스: subnets, NAT GW, EIP, route table, S3 bucket, Lambda, DocumentDB cluster/instance, security groups, IAM roles

### 4. Terraform Apply
```bash
terraform apply tfplan
```

**Expected Output**:
- Apply complete! Resources: ~15 added, 0 changed, 0 destroyed.
- Outputs: docdb_endpoint, s3_bucket_name, lambda_function_arn, nat_gateway_ip

### 5. Verify Build Success
- **DocumentDB Endpoint**: `terraform output docdb_endpoint`
- **S3 Bucket**: `terraform output s3_bucket_name`
- **Lambda ARN**: `terraform output lambda_function_arn`
- **NAT Gateway IP**: `terraform output nat_gateway_ip`

## Troubleshooting

### S3 Bucket Name Already Exists
- **Cause**: S3 버킷 이름은 글로벌 유니크해야 함
- **Solution**: `variables.tf`에서 `s3_bucket_name` 기본값을 변경하거나 `terraform.tfvars`에서 오버라이드
  ```hcl
  s3_bucket_name = "home-fit-documents-{your-account-id}"
  ```

### DocumentDB Creation Timeout
- **Cause**: DocumentDB 클러스터 생성에 10-15분 소요
- **Solution**: 정상적인 동작. `terraform apply`가 완료될 때까지 대기

### Private Subnet CIDR Conflict
- **Cause**: Default VPC의 기존 서브넷과 CIDR 충돌
- **Solution**: `private_subnet_cidr_a`, `private_subnet_cidr_b` 변수를 사용하지 않는 CIDR로 변경
  ```hcl
  private_subnet_cidr_a = "172.31.128.0/20"
  private_subnet_cidr_b = "172.31.144.0/20"
  ```

### Bedrock Model Access Denied
- **Cause**: Bedrock 모델 접근 권한이 활성화되지 않음
- **Solution**: AWS Console → Bedrock → Model access에서 Claude Opus 4 모델 접근 요청
