# Requirements Document - PDF 분석 파이프라인 인프라

## Intent Analysis

| 항목 | 내용 |
|------|------|
| **User Request** | SH 공고문 PDF 분석 파이프라인을 위한 AWS 인프라 구축 (S3, Lambda, Bedrock, DocumentDB) |
| **Request Type** | New Feature (인프라 추가) |
| **Scope Estimate** | Single Component (aws-infra/ 폴더 내 Terraform 리소스 추가) |
| **Complexity Estimate** | Moderate (여러 AWS 서비스 연동, IAM 권한 설정 필요) |

---

## 1. 기능 요구사항 (Functional Requirements)

### FR-1: S3 버킷 구성
- 단일 S3 버킷 생성 (`home-fit-documents` 또는 유사 네이밍)
- Prefix 기반 구조:
  - `raw-pdfs/` — 크롤러가 업로드하는 원본 PDF 파일
  - `processed/` — 처리 완료된 파일 (선택적)
- `raw-pdfs/` prefix에 객체 생성 시 Lambda 트리거 이벤트 설정

### FR-2: Lambda 함수
- **런타임**: Node.js (TypeScript)
- **트리거**: S3 `raw-pdfs/` prefix에 `.pdf` 파일 업로드 시 자동 실행
- **기능**:
  1. S3에서 PDF 파일 읽기
  2. Bedrock Claude Opus 4 모델 호출하여 PDF 분석
  3. 분석 결과를 일관된 Q&A 상태 머신 패턴으로 구조화
  4. 구조화된 데이터를 DocumentDB에 저장
- **타임아웃**: PDF 분석 특성상 충분한 시간 필요 (최대 15분)
- **메모리**: PDF 처리를 위한 충분한 메모리 할당

### FR-3: Bedrock 모델 접근
- **모델**: Claude Opus 4 (`us.anthropic.claude-opus-4-0-20250514`)
- Lambda에서 Bedrock InvokeModel API 호출 가능하도록 IAM 권한 설정
- us-east-1 리전에서 모델 접근 가능 확인

### FR-4: DocumentDB (MongoDB 호환)
- AWS DocumentDB 클러스터 생성
- Lambda에서 DocumentDB 접근 가능하도록 VPC/네트워크 설정
- 기존 EC2 인스턴스(API 서버)에서도 DocumentDB 접근 가능하도록 설정
- 저장 데이터: 공고 목록(AnnouncementSummary), Q&A 상태 머신(QAStateMachine), 용어 사전(Glossary)

### FR-5: 네트워크 연결
- Lambda → DocumentDB: VPC 내부 통신
- Lambda → S3: VPC Endpoint 또는 NAT Gateway
- Lambda → Bedrock: NAT Gateway 또는 VPC Endpoint
- EC2 (API 서버) → DocumentDB: 동일 VPC 내부 통신

---

## 2. 비기능 요구사항 (Non-Functional Requirements)

### NFR-1: 인프라 관리
- 모든 리소스는 `aws-infra/` 폴더 하위에서 Terraform으로 관리
- 기존 Terraform state와 호환 (동일 state file 사용)
- AWS Profile: `aidlc`
- Region: `us-east-1`

### NFR-2: 비용 최적화
- DocumentDB: 최소 인스턴스 사이즈 (db.t3.medium)
- Lambda: 사용량 기반 과금 (idle 비용 없음)
- S3: Standard 스토리지 클래스

### NFR-3: 가용성
- DocumentDB: 단일 인스턴스 (MVP 단계, 추후 Multi-AZ 확장 가능)
- Lambda: AWS 관리형 고가용성

---

## 3. 기술 결정 사항

| 결정 | 선택 | 근거 |
|------|------|------|
| MongoDB 호스팅 | AWS DocumentDB | 관리형 서비스, VPC 내부 통신, Terraform 관리 용이 |
| Lambda 런타임 | TypeScript/Node.js | 기존 프로젝트 스택과 동일 |
| Bedrock 모델 | Claude Opus 4 | PDF 문서 분석 고성능 |
| S3 구조 | 단일 버킷 + prefix | 단순한 관리, 이벤트 필터링으로 충분 |
| IaC 도구 | Terraform | 기존 인프라와 동일 도구 |
| 코드 위치 | aws-infra/ | 기존 인프라 코드와 통합 관리 |

---

## 4. Extension Configuration

| Extension | Enabled | Decided At |
|---|---|---|
| Security Baseline | No | Requirements Analysis |
| Property-Based Testing | Partial (순수 함수/직렬화만) | Requirements Analysis |

---

## 5. 아키텍처 개요

```
┌─────────────┐     ┌──────────┐     ┌──────────────┐     ┌─────────────┐     ┌────────────┐
│  Crawler    │────▶│  S3      │────▶│  Lambda      │────▶│  Bedrock    │     │ DocumentDB │
│  (Worker)   │     │  Bucket  │     │  (Analyzer)  │     │  Claude     │     │            │
└─────────────┘     └──────────┘     └──────────────┘     │  Opus 4    │     └────────────┘
                     raw-pdfs/        S3 Event Trigger      └─────────────┘           ▲
                                                                    │                 │
                                                                    └─────────────────┘
                                                                    분석 결과 저장
                                                                    
┌─────────────┐                                                           │
│  EC2        │───────────────────────────────────────────────────────────┘
│  (API)      │     DocumentDB에서 데이터 조회하여 API 서빙
└─────────────┘
```
