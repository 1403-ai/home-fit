import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AnnouncementSummary, StatusFilter } from '../types/announcement';
import { filterByStatus } from '../utils/filterAnnouncements';
import './AnnouncementsPage.css';

const API_BASE_URL = 'https://www.homefit1403.site/api';
const STATUS_FILTERS: StatusFilter[] = ['전체', '진행중', '예정'];

function formatDateRange(start: string | null, end: string | null): string {
  if (!start && !end) return '일정 미정';
  if (start && end) return `${start} ~ ${end}`;
  if (start) return `${start} ~`;
  return `~ ${end}`;
}

export function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('전체');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const response = await fetch(`${API_BASE_URL}/announcements`);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        const data = (await response.json()) as AnnouncementSummary[];
        setAnnouncements(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    void fetchAnnouncements();
  }, []);

  const filtered = filterByStatus(announcements, activeFilter);

  if (loading) {
    return (
      <main className="announcements-page" data-testid="announcements-page">
        <p className="announcements-loading">공고 목록을 불러오는 중...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="announcements-page" data-testid="announcements-page">
        <p className="announcements-error">오류: {error}</p>
      </main>
    );
  }

  return (
    <main className="announcements-page" data-testid="announcements-page">
      <header className="announcements-header">
        <h1>공고 목록</h1>
        <p className="announcements-subtitle">
          SH 서울주택도시공사 임대/분양 공고 현황
        </p>
      </header>

      <nav
        className="announcements-filters"
        aria-label="공고 상태 필터"
        data-testid="announcements-filters"
      >
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            className={`filter-tab ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter)}
            aria-pressed={activeFilter === filter}
            data-testid={`filter-tab-${filter}`}
          >
            {filter}
          </button>
        ))}
      </nav>

      <ul className="announcements-list" data-testid="announcements-list">
        {filtered.map((item) => (
          <li
            key={item._id}
            className="announcement-item clickable"
            data-testid={`announcement-item-${item.seq}`}
            onClick={() => navigate(`/announcements/${item.seq}/questions`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigate(`/announcements/${item.seq}/questions`);
              }
            }}
          >
            <div className="announcement-item-header">
              <h2 className="announcement-title">{item.title}</h2>
              <span
                className={`badge status-badge status-${item.status === '진행중' ? 'active' : 'upcoming'}`}
              >
                {item.status}
              </span>
            </div>

            <div className="announcement-meta">
              {item.housing_type && (
                <span className="badge housing-badge">{item.housing_type}</span>
              )}
              {item.supply_category && (
                <span
                  className={`badge supply-badge supply-${item.supply_category === '임대' ? 'rent' : item.supply_category === '분양' ? 'sale' : 'other'}`}
                >
                  {item.supply_category}
                </span>
              )}
              <span className="meta-separator" aria-hidden="true">
                ·
              </span>
              <span className="announcement-date">
                {formatDateRange(item.application_start, item.application_end)}
              </span>
              {item.unit_count != null && (
                <>
                  <span className="meta-separator" aria-hidden="true">
                    ·
                  </span>
                  <span className="announcement-units">
                    {item.unit_count}세대
                  </span>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="announcements-empty" data-testid="announcements-empty">
          해당 상태의 공고가 없습니다.
        </p>
      )}
    </main>
  );
}
