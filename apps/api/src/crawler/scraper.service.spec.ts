import { Test, TestingModule } from '@nestjs/testing';
import { ScraperService } from './scraper.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ScraperService', () => {
  let service: ScraperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScraperService]
    }).compile();

    service = module.get<ScraperService>(ScraperService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchListPage', () => {
    it('should parse announcements from HTML table', async () => {
      const mockHtml = `
        <html><body>
          <table>
            <tbody>
              <tr>
                <td>1</td>
                <td><a href="/main/lay2/program/S1T294C295/www/brd/m_241/view.do?ntt_sn=12345">위례 A1-14BL 공공분양 입주자 모집공고</a></td>
                <td>2025-01-15</td>
                <td>진행중</td>
              </tr>
              <tr>
                <td>2</td>
                <td><a href="/main/lay2/program/S1T294C295/www/brd/m_241/view.do?ntt_sn=12344">마곡 공공분양 입주자 모집공고</a></td>
                <td>2025-01-10</td>
                <td>마감</td>
              </tr>
            </tbody>
          </table>
        </body></html>
      `;

      mockedAxios.get.mockResolvedValueOnce({ data: mockHtml });

      const result = await service.fetchListPage();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(
        expect.objectContaining({
          seq: '12345',
          title: '위례 A1-14BL 공공분양 입주자 모집공고',
          status: '진행중'
        })
      );
      expect(result[1]).toEqual(
        expect.objectContaining({
          seq: '12344',
          title: '마곡 공공분양 입주자 모집공고',
          status: '마감'
        })
      );
    });

    it('should return empty array when no table rows found', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: '<html><body><table><tbody></tbody></table></body></html>' });

      const result = await service.fetchListPage();

      expect(result).toHaveLength(0);
    });

    it('should skip rows without valid seq', async () => {
      const mockHtml = `
        <html><body>
          <table>
            <tbody>
              <tr>
                <td>공지</td>
                <td><a href="/notice">공지사항입니다</a></td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </body></html>
      `;

      mockedAxios.get.mockResolvedValueOnce({ data: mockHtml });

      const result = await service.fetchListPage();

      expect(result).toHaveLength(0);
    });
  });

  describe('fetchDetailPage', () => {
    it('should extract PDF URLs from detail page', async () => {
      const mockHtml = `
        <html><body>
          <a href="/download/file/12345/announcement.pdf">공고문 다운로드</a>
          <a href="/download/file/12345/appendix.pdf">별첨 다운로드</a>
          <a href="/some/other/link">기타 링크</a>
        </body></html>
      `;

      mockedAxios.get.mockResolvedValueOnce({ data: mockHtml });

      const result = await service.fetchDetailPage('https://www.i-sh.co.kr/detail/12345');

      expect(result).toHaveLength(2);
      expect(result[0]).toContain('.pdf');
      expect(result[1]).toContain('.pdf');
    });

    it('should return empty array when no PDFs found', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: '<html><body><p>No attachments</p></body></html>' });

      const result = await service.fetchDetailPage('https://www.i-sh.co.kr/detail/12345');

      expect(result).toHaveLength(0);
    });
  });
});
