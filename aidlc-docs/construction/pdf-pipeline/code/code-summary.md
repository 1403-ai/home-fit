# Code Summary - PDF Pipeline Infrastructure

## Generated Files

### New Files (aws-infra/)

| File | Purpose |
|------|---------|
| `networking.tf` | Private Subnets (2 AZ), NAT Gateway, EIP, Route Table |
| `s3.tf` | S3 Bucket, encryption, public access block, event notification → Lambda |
| `lambda.tf` | Lambda function, IAM role/policies, security group, CloudWatch logs |
| `documentdb.tf` | DocumentDB cluster, instance, subnet group, security group |

### Modified Files (aws-infra/)

| File | Changes |
|------|---------|
| `variables.tf` | Added: private subnet CIDRs, S3 bucket name, Lambda memory/timeout, DocumentDB credentials/instance class, Bedrock model ID |
| `outputs.tf` | Added: DocumentDB endpoint/port, S3 bucket name/ARN, Lambda ARN/name, NAT Gateway IP |
| `main.tf` | No changes needed (existing egress "All outbound" already covers DocumentDB access) |

## Architecture Summary

```
Crawler → S3 (raw-pdfs/*.pdf)
              ↓ (S3 Event Notification)
         Lambda (pdf-analyzer)
              ↓ (Bedrock InvokeModel via NAT GW)
         Claude Opus 4 → 분석 결과
              ↓
         DocumentDB (homefit DB)
              ↑
         EC2 API Server (기존)
```

## Key Configuration

- **Lambda**: Node.js 20.x, 1024MB RAM, 15min timeout, VPC-attached
- **DocumentDB**: Engine 5.0, db.t3.medium, encrypted, 7-day backup
- **S3**: SSE-S3 encryption, public access blocked, versioning disabled
- **Networking**: 2 private subnets, NAT Gateway for Lambda internet access
- **IAM**: Least-privilege (S3 GetObject on raw-pdfs/*, Bedrock InvokeModel on specific model)

## Required Input

`docdb_master_password` 변수는 sensitive로 선언되어 있으며, `terraform apply` 시 입력하거나 `terraform.tfvars` 파일에 설정 필요:

```hcl
docdb_master_password = "your-secure-password-here"
```
