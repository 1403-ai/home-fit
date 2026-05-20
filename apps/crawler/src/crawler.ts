import * as cheerio from 'cheerio';
import type { AnnouncementEntry, AnnouncementDetail, AttachmentInfo } from './types.js';

const BASE_URL = 'https://www.i-sh.co.kr';

/** 공고 목록 페이지 URL (임대+분양 전체) */
const LIST_URL =
  `${BASE_URL}/main/lay2/program/S1T294C295/www/brd/m_241/list.do` +
  `?multi_itm_seqs=1,2,4,8,16,32,64,128,256,512,1024`;

/** 공고 상세 페이지 URL */
const VIEW_URL = `${BASE_URL}/main/lay2/program/S1T294C295/www/brd/m_241/view.do`;

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

const FETCH_DELAY_MS = 1500;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  return response.text();
}

/**
 * 공고 목록 페이지에서 공고 엔트리를 추출합니다.
 * 첫 페이지(최신 10건)만 크롤링합니다.
 */
export async function fetchAnnouncementList(): Promise<AnnouncementEntry[]> {
  console.log(`[crawler] Fetching list: ${LIST_URL}`);
  const html = await fetchHtml(LIST_URL);
  const $ = cheerio.load(html);

  const entries: AnnouncementEntry[] = [];

  // SH 게시판은 테이블 형태로 목록을 표시
  // 각 행에서 nttId, 제목, 부서, 날짜를 추출
  $('table tbody tr, .board_list tbody tr, .bbs_list tbody tr').each((_, row) => {
    const $row = $(row);
    const cells = $row.find('td');

    if (cells.length < 3) return;

    // 첫 번째 셀: 번호 (nttId)
    const nttId = $(cells[0]).text().trim();
    if (!nttId || nttId === 'NEW' || isNaN(Number(nttId))) return;

    // 두 번째 셀: 제목 (링크 포함)
    const titleCell = $(cells[1]);
    const titleLink = titleCell.find('a');
    const title = titleLink.text().trim() || titleCell.text().trim();

    // 링크에서 nttId 추출 시도 (onclick 또는 href에서)
    const href = titleLink.attr('href') || '';
    const onclick = titleLink.attr('onclick') || '';
    let extractedId = nttId;

    // href에서 nttId 파라미터 추출
    const nttIdMatch = href.match(/nttId=(\d+)/) || onclick.match(/nttId=(\d+)/) || onclick.match(/'(\d+)'/);
    if (nttIdMatch) {
      extractedId = nttIdMatch[1];
    }

    // 부서, 날짜
    const department = cells.length >= 4 ? $(cells[2]).text().trim() : '';
    const date = cells.length >= 4 ? $(cells[3]).text().trim() : $(cells[2]).text().trim();

    if (title) {
      entries.push({
        nttId: extractedId,
        title,
        department,
        date,
      });
    }
  });

  // 테이블 파싱 실패 시 대체 파싱 (리스트형 게시판)
  if (entries.length === 0) {
    $('a[href*="view.do"], a[onclick*="view"]').each((_, el) => {
      const $el = $(el);
      const href = $el.attr('href') || '';
      const onclick = $el.attr('onclick') || '';
      const title = $el.text().trim();

      const idMatch = href.match(/nttId=(\d+)/) || onclick.match(/(\d{4,})/);
      if (idMatch && title && title.length > 5) {
        entries.push({
          nttId: idMatch[1],
          title,
          department: '',
          date: '',
        });
      }
    });
  }

  console.log(`[crawler] Found ${entries.length} announcements`);
  return entries;
}

/**
 * 공고 상세 페이지에서 첨부파일(PDF) 정보를 추출합니다.
 */
export async function fetchAnnouncementDetail(nttId: string): Promise<AnnouncementDetail> {
  const url = `${VIEW_URL}?nttId=${nttId}`;
  console.log(`[crawler] Fetching detail: nttId=${nttId}`);

  await delay(FETCH_DELAY_MS);
  const html = await fetchHtml(url);
  const $ = cheerio.load(html);

  const attachments: AttachmentInfo[] = [];

  // 첨부파일 링크 추출 (PDF 파일만)
  // SH 사이트는 보통 첨부파일을 다운로드 링크로 제공
  $('a[href*="download"], a[href*="fileDown"], a[href*="atch"]').each((_, el) => {
    const $el = $(el);
    const href = $el.attr('href') || '';
    const fileName = $el.text().trim() || $el.attr('title') || '';

    if (isPdfFile(fileName, href)) {
      const downloadUrl = href.startsWith('http') ? href : `${BASE_URL}${href}`;
      attachments.push({ fileName: sanitizeFileName(fileName), downloadUrl });
    }
  });

  // 대체 패턴: onclick에 다운로드 함수가 있는 경우
  if (attachments.length === 0) {
    $('a[onclick*="download"], a[onclick*="fileDown"]').each((_, el) => {
      const $el = $(el);
      const onclick = $el.attr('onclick') || '';
      const fileName = $el.text().trim();

      if (isPdfFile(fileName, onclick)) {
        // onclick에서 URL 또는 파일 ID 추출
        const urlMatch = onclick.match(/['"]([^'"]*(?:download|fileDown|atch)[^'"]*)['"]/);
        if (urlMatch) {
          const downloadUrl = urlMatch[1].startsWith('http') ? urlMatch[1] : `${BASE_URL}${urlMatch[1]}`;
          attachments.push({ fileName: sanitizeFileName(fileName), downloadUrl });
        }
      }
    });
  }

  // 추가 패턴: 첨부파일 영역에서 모든 링크 확인
  if (attachments.length === 0) {
    $('.file_list a, .attach a, .atch_list a, [class*="file"] a, [class*="attach"] a').each((_, el) => {
      const $el = $(el);
      const href = $el.attr('href') || '';
      const fileName = $el.text().trim();

      if (fileName && href && isPdfFile(fileName, href)) {
        const downloadUrl = href.startsWith('http') ? href : `${BASE_URL}${href}`;
        attachments.push({ fileName: sanitizeFileName(fileName), downloadUrl });
      }
    });
  }

  const title = $('h3, h4, .view_title, .bbs_title, [class*="title"]').first().text().trim() || `공고_${nttId}`;

  console.log(`[crawler] nttId=${nttId}: found ${attachments.length} PDF attachments`);

  return { nttId, title, attachments };
}

function isPdfFile(fileName: string, urlOrOnclick: string): boolean {
  const lower = (fileName + urlOrOnclick).toLowerCase();
  return lower.includes('.pdf') || lower.includes('pdf');
}

function sanitizeFileName(name: string): string {
  // 파일명에서 불필요한 공백/특수문자 정리
  let sanitized = name.replace(/[\r\n\t]/g, '').trim();
  // .pdf 확장자가 없으면 추가
  if (!sanitized.toLowerCase().endsWith('.pdf')) {
    sanitized += '.pdf';
  }
  return sanitized;
}
