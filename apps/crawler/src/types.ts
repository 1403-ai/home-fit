/** 게시판에서 추출한 공고 요약 정보 */
export interface AnnouncementEntry {
  /** 게시글 고유 번호 (nttId) */
  nttId: string;
  /** 공고 제목 */
  title: string;
  /** 작성 부서 */
  department: string;
  /** 등록일 (YYYY-MM-DD) */
  date: string;
}

/** 공고 상세에서 추출한 첨부파일 정보 */
export interface AttachmentInfo {
  /** 원본 파일명 */
  fileName: string;
  /** 다운로드 URL */
  downloadUrl: string;
}

/** 공고 상세 정보 (첨부파일 포함) */
export interface AnnouncementDetail {
  nttId: string;
  title: string;
  attachments: AttachmentInfo[];
}

/** S3에 업로드된 PDF 결과 */
export interface UploadResult {
  nttId: string;
  fileName: string;
  s3Key: string;
  success: boolean;
  error?: string;
}

/** Lambda 실행 결과 */
export interface CrawlResult {
  /** 크롤링한 총 공고 수 */
  totalAnnouncements: number;
  /** 신규 공고 수 (S3에 없던 것) */
  newAnnouncements: number;
  /** 업로드 성공 PDF 수 */
  uploadedPdfs: number;
  /** 업로드 실패 PDF 수 */
  failedPdfs: number;
  /** 업로드 결과 상세 */
  details: UploadResult[];
  /** 실행 시각 */
  executedAt: string;
}
