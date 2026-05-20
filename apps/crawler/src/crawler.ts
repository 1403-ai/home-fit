import * as cheerio from 'cheerio';
import type { AnnouncementEntry, AnnouncementDetail, AttachmentInfo } from './types.js';

const BASE_URL = 'https://www.i-sh.co.kr';
const MULTI_ITEM_SEQS = '1,2,4,8,16,32,64,128,256,512,1024';

/** 공고 목록 페이지 URL (임대+분양 전체) */
const LIST_URL =
  `${BASE_URL}/main/lay2/program/S1T294C295/www/brd/m_241/list.do` +
  `?multi_itm_seqs=${MULTI_ITEM_SEQS}`;

/** 공고 상세 페이지 URL */
const VIEW_URL = `${BASE_URL}/main/lay2/program/S1T294C295/www/brd/m_241/view.do`;

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

const FETCH_DELAY_MS = Number(process.env.SH_FETCH_DELAY_MS ?? 300);
const FETCH_TIMEOUT_MS = Number(process.env.SH_FETCH_TIMEOUT_MS ?? 20_000);
const DEFAULT_MAX_LIST_PAGES = parseMaxListPages(process.env.CRAWL_MAX_LIST_PAGES);
const MIN_REMAINING_MS = 45_000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface FetchAnnouncementListOptions {
  maxPages?: number;
  deadlineMs?: number;
}

interface ShFileInfo {
  brdId: string;
  seq: string;
  fileSeq: string;
  fileSize?: string | number;
  oriFileNm: string;
  fileTp: string;
}

async function fetchHtml(url: string, init?: RequestInit): Promise<string> {
  const signal = AbortSignal.timeout(FETCH_TIMEOUT_MS);
  const response = await fetch(url, {
    ...init,
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
      ...init?.headers,
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  return response.text();
}

function hasEnoughTime(deadlineMs?: number): boolean {
  return deadlineMs === undefined || deadlineMs - Date.now() > MIN_REMAINING_MS;
}

function makeListFormBody(page: number): URLSearchParams {
  const body = new URLSearchParams();
  body.set('page', String(page));
  body.set('seq', '');
  body.set('itm_seq_1', '0');
  body.set('multi_itm_seq', '0');
  body.set('multi_itm_seqsStr', MULTI_ITEM_SEQS);
  body.set('isRecrnoti', '');
  return body;
}

function parseMaxListPages(value: string | undefined): number {
  if (value?.toLowerCase() === 'all') {
    return Number.MAX_SAFE_INTEGER;
  }

  const parsed = Number(value ?? 5);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 5;
}

/**
 * 공고 목록 페이지에서 공고 엔트리를 추출합니다.
 * 기본은 최신 5페이지(50건)를 크롤링하며, CRAWL_MAX_LIST_PAGES로 조정할 수 있습니다.
 */
export async function fetchAnnouncementList(
  options: FetchAnnouncementListOptions = {}
): Promise<AnnouncementEntry[]> {
  const maxPages = Math.max(1, options.maxPages ?? DEFAULT_MAX_LIST_PAGES);
  const entries: AnnouncementEntry[] = [];
  const seen = new Set<string>();
  let lastPage: number | undefined;

  for (let page = 1; page <= maxPages; page++) {
    if (!hasEnoughTime(options.deadlineMs)) {
      console.warn(`[crawler] Stop list crawl before page=${page}: not enough Lambda time remains`);
      break;
    }

    if (page > 1) {
      await delay(FETCH_DELAY_MS);
    }

    console.log(`[crawler] Fetching list page=${page}: ${LIST_URL}`);
    const html =
      page === 1
        ? await fetchHtml(LIST_URL)
        : await fetchHtml(VIEW_URL.replace('/view.do', '/list.do'), {
            method: 'POST',
            body: makeListFormBody(page),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Referer: LIST_URL,
            },
          });

    if (page === 1) {
      lastPage = parseLastPage(html);
      if (lastPage) {
        const effectivePages = Math.min(maxPages, lastPage);
        console.log(`[crawler] List pagination detected: lastPage=${lastPage}, crawlPages=${effectivePages}`);
      }
    }

    const pageEntries = parseAnnouncementList(html, page).filter((entry) => {
      if (seen.has(entry.nttId)) return false;
      seen.add(entry.nttId);
      return true;
    });

    console.log(`[crawler] Found ${pageEntries.length} announcements on page=${page}`);
    entries.push(...pageEntries);

    if (pageEntries.length === 0) break;
    if (lastPage !== undefined && page >= lastPage) break;
  }

  console.log(`[crawler] Found ${entries.length} announcements total`);
  return entries;
}

function parseLastPage(html: string): number | undefined {
  const $ = cheerio.load(html);
  const pageNumbers: number[] = [];

  $('.pagingWrap a[onclick*="getPaging"]').each((_, el) => {
    const onclick = $(el).attr('onclick') || '';
    const page = Number(onclick.match(/getPaging\((\d+)/)?.[1]);
    if (Number.isFinite(page) && page > 0) {
      pageNumbers.push(page);
    }
  });

  const lastPage = Math.max(...pageNumbers);
  return Number.isFinite(lastPage) ? lastPage : undefined;
}

function parseAnnouncementList(html: string, sourcePage: number): AnnouncementEntry[] {
  const $ = cheerio.load(html);
  const entries: AnnouncementEntry[] = [];

  $('.listTable table tbody tr, table tbody tr').each((_, row) => {
    const $row = $(row);
    const cells = $row.find('td');

    if (cells.length < 4) return;

    const titleCell = $(cells[1]);
    const titleLink = titleCell.find('a[onclick*="getDetailView"]').first();
    if (titleLink.length === 0) return;

    const onclick = titleLink.attr('onclick') || '';
    const seq = extractSeq(onclick);
    if (!seq) return;

    const titleLinkForText = titleLink.clone();
    titleLinkForText.find('.icoNew').remove();

    const title = cleanText(titleLinkForText.text());
    if (!title) return;

    entries.push({
      nttId: seq,
      title,
      department: cleanText($(cells[2]).text()),
      date: cleanText($(cells[3]).text()),
      noticeNo: cleanText($(cells[0]).text()),
      detailUrl: `${VIEW_URL}?seq=${seq}`,
      sourcePage,
    });
  });

  if (entries.length === 0) {
    $('a[onclick*="getDetailView"], a[href*="view.do"]').each((_, el) => {
      const $el = $(el);
      const href = $el.attr('href') || '';
      const onclick = $el.attr('onclick') || '';
      const seq = extractSeq(onclick) || extractSeq(href);
      const title = cleanText($el.text());

      if (seq && title && title.length > 5) {
        entries.push({
          nttId: seq,
          title,
          department: '',
          date: '',
          detailUrl: `${VIEW_URL}?seq=${seq}`,
          sourcePage,
        });
      }
    });
  }

  return entries;
}

/**
 * 공고 상세 페이지에서 첨부파일(PDF) 정보를 추출합니다.
 */
export async function fetchAnnouncementDetail(nttId: string): Promise<AnnouncementDetail> {
  console.log(`[crawler] Fetching detail: seq=${nttId}`);

  await delay(FETCH_DELAY_MS);
  const html = await fetchHtml(VIEW_URL, {
    method: 'POST',
    body: makeDetailFormBody(nttId),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Referer: LIST_URL,
    },
  });
  const $ = cheerio.load(html);

  const title =
    cleanText($('.detailTable caption').first().text()) ||
    cleanText($('caption, h3, h4, .view_title, .bbs_title, [class*="title"]').first().text()) ||
    `공고_${nttId}`;

  const attachments = dedupeAttachments([
    ...parseInnorixDownList(html),
    ...parseDirectAttachmentLinks($),
  ]);

  console.log(`[crawler] seq=${nttId}: found ${attachments.length} PDF attachments`);

  return { nttId, title, attachments };
}

function makeDetailFormBody(seq: string): URLSearchParams {
  const body = makeListFormBody(1);
  body.set('seq', seq);
  return body;
}

function extractSeq(value: string): string | undefined {
  return (
    value.match(/getDetailView\(['"]?(\d+)['"]?\)/)?.[1] ||
    value.match(/[?&]seq=(\d+)/)?.[1] ||
    value.match(/[?&]nttId=(\d+)/)?.[1] ||
    value.match(/['"](\d{4,})['"]/)?.[1]
  );
}

function parseInnorixDownList(html: string): AttachmentInfo[] {
  const downListMatch = html.match(/initParam\.downList\s*=\s*(\[[\s\S]*?\]);/);
  if (!downListMatch) return [];

  try {
    const files = JSON.parse(downListMatch[1]) as ShFileInfo[];
    return files
      .filter((file) => isPdfFile(file.oriFileNm, ''))
      .map((file) => {
        const params = new URLSearchParams({
          brdId: file.brdId,
          seq: file.seq,
          fileTp: file.fileTp,
          fileSeq: String(file.fileSeq),
        });

        return {
          fileName: sanitizeFileName(file.oriFileNm),
          downloadUrl: `${BASE_URL}/main/com/file/innoFD.do?${params.toString()}`,
          fileSize: Number(file.fileSize) || undefined,
        };
      });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[crawler] Failed to parse initParam.downList: ${message}`);
    return [];
  }
}

function parseDirectAttachmentLinks($: cheerio.CheerioAPI): AttachmentInfo[] {
  const attachments: AttachmentInfo[] = [];

  $('a[href*="download"], a[href*="fileDown"], a[href*="innoFD"], a[href*="atch"], .file_list a, .attach a, .atch_list a, [class*="file"] a, [class*="attach"] a').each((_, el) => {
    const $el = $(el);
    const href = $el.attr('href') || '';
    const fileName = cleanText($el.text()) || cleanText($el.attr('title') || '');

    if (href && isPdfFile(fileName, href)) {
      attachments.push({
        fileName: sanitizeFileName(fileName),
        downloadUrl: resolveUrl(href),
      });
    }
  });

  return attachments;
}

function dedupeAttachments(attachments: AttachmentInfo[]): AttachmentInfo[] {
  const seen = new Set<string>();
  return attachments.filter((attachment) => {
    const key = `${attachment.fileName}:${attachment.downloadUrl}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function isPdfFile(fileName: string, urlOrOnclick: string): boolean {
  const lower = (fileName + urlOrOnclick).toLowerCase();
  return lower.includes('.pdf');
}

function sanitizeFileName(name: string): string {
  // 파일명에서 불필요한 공백/특수문자 정리
  let sanitized = cleanText(name);
  if (!sanitized) {
    sanitized = 'attachment.pdf';
  }
  // .pdf 확장자가 없으면 추가
  if (!sanitized.toLowerCase().endsWith('.pdf')) {
    sanitized += '.pdf';
  }
  return sanitized;
}

function cleanText(value: string): string {
  return value.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function resolveUrl(href: string): string {
  return new URL(href, BASE_URL).toString();
}
