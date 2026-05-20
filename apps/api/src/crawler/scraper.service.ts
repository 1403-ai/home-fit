import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

export interface RawAnnouncement {
  seq: string;
  title: string;
  status: string;
  detail_url: string;
  date: string | null;
}

const BASE_URL = 'https://www.i-sh.co.kr';
const LIST_URL =
  'https://www.i-sh.co.kr/main/lay2/program/S1T294C295/www/brd/m_241/list.do?multi_itm_seqs=1,2,4,8,16,32,64,128,256,512,1024';

const USER_AGENT = 'HomeFitAI-Crawler/1.0 (+https://github.com/home-fit-ai)';
const REQUEST_DELAY_MS = 1500;
const REQUEST_TIMEOUT_MS = 30_000;

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  async fetchListPage(): Promise<RawAnnouncement[]> {
    this.logger.log(`Fetching list page: ${LIST_URL}`);

    const response = await axios.get(LIST_URL, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: REQUEST_TIMEOUT_MS
    });

    const $ = cheerio.load(response.data);
    const announcements: RawAnnouncement[] = [];

    $('table tbody tr').each((_index, row) => {
      const $row = $(row);
      const cells = $row.find('td');

      if (cells.length < 2) return;

      const titleCell = $row.find('td a');
      const href = titleCell.attr('href') ?? '';
      const title = titleCell.text().trim();

      if (!title || !href) return;

      // seq 추출: URL 파라미터 또는 행 데이터에서
      const seqMatch = href.match(/ntt_sn=(\d+)/) ?? href.match(/\/(\d+)(?:\?|$)/);
      const seq = seqMatch?.[1] ?? '';

      if (!seq) return;

      // 상태 추출 (게시판 구조에 따라 조정 필요)
      const statusText = cells.last().text().trim() || cells.eq(cells.length - 2).text().trim();

      // 날짜 추출
      const dateText = $row.find('td').filter((_i, el) => {
        const text = $(el).text().trim();
        return /\d{4}[-./]\d{2}[-./]\d{2}/.test(text);
      }).first().text().trim() || null;

      const detailUrl = href.startsWith('http') ? href : `${BASE_URL}${href}`;

      announcements.push({
        seq,
        title,
        status: statusText,
        detail_url: detailUrl,
        date: dateText
      });
    });

    this.logger.log(`Parsed ${announcements.length} announcements from list page`);
    return announcements;
  }

  async fetchDetailPage(detailUrl: string): Promise<string[]> {
    await this.delay(REQUEST_DELAY_MS);

    this.logger.debug(`Fetching detail page: ${detailUrl}`);

    const response = await axios.get(detailUrl, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: REQUEST_TIMEOUT_MS
    });

    const $ = cheerio.load(response.data);
    const pdfUrls: string[] = [];

    $('a[href]').each((_index, el) => {
      const href = $(el).attr('href') ?? '';
      if (href.toLowerCase().endsWith('.pdf') || href.includes('/download/') || href.includes('atch_file')) {
        const fullUrl = href.startsWith('http') ? href : `${BASE_URL}${href}`;
        pdfUrls.push(fullUrl);
      }
    });

    this.logger.debug(`Found ${pdfUrls.length} PDF links on detail page`);
    return pdfUrls;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
