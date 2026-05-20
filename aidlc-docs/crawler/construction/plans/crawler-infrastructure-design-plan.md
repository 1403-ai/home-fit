# Infrastructure Design Plan - SH Crawler

## Plan Overview

이미 Requirements Analysis에서 대부분의 인프라 결정이 완료되었습니다.
아래 몇 가지 세부 사항만 확인이 필요합니다.

---

## Questions

### Question 1
Lambda 함수의 메모리 크기와 타임아웃을 어떻게 설정할까요?

A) 256MB / 60초 (가벼운 크롤링, PDF 수가 적을 때)
B) 512MB / 120초 (중간 규모, PDF 여러 개 다운로드)
C) 1024MB / 300초 (대규모, 많은 PDF 동시 처리)
X) Other (please describe after [Answer]: tag below)

[Answer]: C

### Question 2
S3 버킷 이름 prefix는 어떻게 할까요? (기존 Terraform의 name_prefix = "home-fit" 패턴 사용)

A) home-fit-announcements (공고 전용 버킷)
B) home-fit-data (범용 데이터 버킷, announcements/ prefix로 구분)
C) home-fit-crawler (크롤러 전용 버킷)
X) Other (please describe after [Answer]: tag below)

[Answer]: home-fit-documents

### Question 3
Lambda 함수 코드 배포 방식은 어떻게 할까요?

A) Terraform에서 직접 zip 패키징 + 배포 (archive_file + aws_lambda_function)
B) GitHub Actions에서 빌드 후 S3에 업로드 → Terraform은 S3 참조만
C) ECR 컨테이너 이미지로 배포 (Docker Lambda)
X) Other (please describe after [Answer]: tag below)

[Answer]: 그냥 직접 AWS 콘솔에서 코드 업로드 

---

## Design Steps (to execute after answers)

- [x] 1. S3 버킷 리소스 설계 (버킷 정책, 라이프사이클 규칙)
- [x] 2. IAM Role/Policy 설계 (Lambda 실행 역할, S3 접근 권한)
- [x] 3. Lambda 함수 리소스 설계 (런타임, 메모리, 타임아웃, 환경변수)
- [x] 4. EventBridge Scheduler 규칙 설계 (12시간 주기)
- [x] 5. CloudWatch Logs 설정 (로그 그룹, 보존 기간)
- [x] 6. 배포 아키텍처 다이어그램 생성
