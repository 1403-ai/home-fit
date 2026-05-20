# Integration Test Instructions - PDF Pipeline Infrastructure

## Purpose
인프라 리소스 간 연결이 올바르게 설정되었는지 검증합니다.

---

## Test Scenarios

### Scenario 1: S3 → Lambda 트리거 검증
- **Description**: S3에 PDF 업로드 시 Lambda가 정상 트리거되는지 확인
- **Setup**: `terraform apply` 완료 후
- **Test Steps**:
  ```bash
  # 1. 테스트 PDF 업로드
  aws s3 cp test.pdf s3://$(terraform output -raw s3_bucket_name)/raw-pdfs/test.pdf --profile aidlc

  # 2. Lambda 실행 로그 확인 (30초 대기 후)
  aws logs tail /aws/lambda/home-fit-pdf-analyzer --since 1m --profile aidlc
  ```
- **Expected Results**: Lambda 함수가 실행되고 CloudWatch Logs에 "Placeholder" 메시지 출력
- **Cleanup**:
  ```bash
  aws s3 rm s3://$(terraform output -raw s3_bucket_name)/raw-pdfs/test.pdf --profile aidlc
  ```

### Scenario 2: Lambda → DocumentDB 연결 검증
- **Description**: Lambda가 VPC 내에서 DocumentDB에 접근 가능한지 확인
- **Setup**: Lambda 코드를 DocumentDB 연결 테스트 코드로 업데이트 필요 (실제 코드 배포 후)
- **Test Steps**:
  ```bash
  # DocumentDB 엔드포인트 확인
  terraform output docdb_endpoint

  # Lambda 환경변수에 DocumentDB 정보가 설정되었는지 확인
  aws lambda get-function-configuration \
    --function-name home-fit-pdf-analyzer \
    --query 'Environment.Variables' \
    --profile aidlc
  ```
- **Expected Results**: `DOCDB_ENDPOINT`, `DOCDB_PORT`, `DOCDB_USERNAME` 환경변수가 올바르게 설정됨

### Scenario 3: Lambda → Bedrock API 접근 검증
- **Description**: Lambda가 NAT Gateway를 통해 Bedrock API에 접근 가능한지 확인
- **Setup**: Bedrock 모델 접근 권한 활성화 필요
- **Test Steps**:
  ```bash
  # NAT Gateway 상태 확인
  aws ec2 describe-nat-gateways \
    --filter "Name=tag:Name,Values=home-fit-nat-gw" \
    --query 'NatGateways[0].State' \
    --profile aidlc

  # Lambda IAM Role에 Bedrock 권한 확인
  aws iam list-role-policies \
    --role-name home-fit-lambda-pdf-analyzer-role \
    --profile aidlc
  ```
- **Expected Results**: NAT Gateway 상태 "available", Bedrock 정책 연결됨

### Scenario 4: EC2 → DocumentDB 연결 검증
- **Description**: 기존 EC2 API 서버에서 DocumentDB에 접근 가능한지 확인
- **Setup**: EC2 인스턴스에 SSH 접속
- **Test Steps**:
  ```bash
  # EC2에 SSH 접속
  ssh -i aws-infra/home-fit-key.pem ec2-user@$(terraform output -raw public_ip)

  # DocumentDB 연결 테스트 (mongosh 또는 telnet)
  telnet $(terraform output -raw docdb_endpoint) 27017
  ```
- **Expected Results**: TCP 27017 포트 연결 성공

---

## 네트워크 연결 종합 검증

```bash
# 모든 Security Group 규칙 확인
echo "=== Lambda SG ==="
aws ec2 describe-security-groups \
  --filters "Name=group-name,Values=home-fit-lambda-sg" \
  --query 'SecurityGroups[0].{Ingress:IpPermissions,Egress:IpPermissionsEgress}' \
  --profile aidlc

echo "=== DocumentDB SG ==="
aws ec2 describe-security-groups \
  --filters "Name=group-name,Values=home-fit-docdb-sg" \
  --query 'SecurityGroups[0].{Ingress:IpPermissions,Egress:IpPermissionsEgress}' \
  --profile aidlc

echo "=== EC2 SG ==="
aws ec2 describe-security-groups \
  --filters "Name=group-name,Values=home-fit-sg" \
  --query 'SecurityGroups[0].{Ingress:IpPermissions,Egress:IpPermissionsEgress}' \
  --profile aidlc
```

---

## Cleanup (테스트 후)
테스트 데이터만 정리. 인프라는 유지:
```bash
aws s3 rm s3://$(terraform output -raw s3_bucket_name)/raw-pdfs/test.pdf --profile aidlc
```
