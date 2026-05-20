import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import type { AnnouncementSummary, AnnouncementStatus, StatusFilter } from '../types/announcement';
import { filterByStatus } from './filterAnnouncements';

// --- PBT-07: Domain-specific generator for AnnouncementSummary ---

const announcementStatusArb: fc.Arbitrary<AnnouncementStatus> = fc.constantFrom(
  '진행중' as const,
  '예정' as const,
);

const announcementSummaryArb: fc.Arbitrary<AnnouncementSummary> = fc.record({
  seq: fc.stringMatching(/^2026-\d{4}$/),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  housing_type: fc.constantFrom('장기전세', '국민임대', '행복주택', '공공분양'),
  supply_category: fc.constantFrom('임대' as const, '분양' as const),
  status: announcementStatusArb,
  application_start: fc.option(
    fc.date({ min: new Date('2026-01-01'), max: new Date('2026-12-31') }).map(
      (d) => d.toISOString().slice(0, 10),
    ),
    { nil: null },
  ),
  application_end: fc.option(
    fc.date({ min: new Date('2026-01-01'), max: new Date('2026-12-31') }).map(
      (d) => d.toISOString().slice(0, 10),
    ),
    { nil: null },
  ),
  unit_count: fc.integer({ min: 1, max: 5000 }),
});

const announcementListArb = fc.array(announcementSummaryArb, { minLength: 0, maxLength: 50 });

const statusFilterArb: fc.Arbitrary<StatusFilter> = fc.constantFrom(
  '전체' as const,
  '진행중' as const,
  '예정' as const,
);

// --- PBT-10: Example-based tests (complement PBT) ---

describe('filterByStatus — example-based tests', () => {
  const sampleItems: AnnouncementSummary[] = [
    {
      seq: '001',
      title: '국민임대 공고',
      housing_type: '국민임대',
      supply_category: '임대',
      status: '진행중',
      application_start: '2026-05-01',
      application_end: '2026-05-15',
      unit_count: 100,
    },
    {
      seq: '002',
      title: '공공분양 공고',
      housing_type: '공공분양',
      supply_category: '분양',
      status: '예정',
      application_start: '2026-06-01',
      application_end: '2026-06-15',
      unit_count: 200,
    },
  ];

  it('returns all items when filter is "전체"', () => {
    expect(filterByStatus(sampleItems, '전체')).toEqual(sampleItems);
  });

  it('returns only "진행중" items', () => {
    const result = filterByStatus(sampleItems, '진행중');
    expect(result).toHaveLength(1);
    expect(result[0].seq).toBe('001');
  });

  it('returns only "예정" items', () => {
    const result = filterByStatus(sampleItems, '예정');
    expect(result).toHaveLength(1);
    expect(result[0].seq).toBe('002');
  });

  it('returns empty array when no items match', () => {
    const onlyActive: AnnouncementSummary[] = [sampleItems[0]];
    expect(filterByStatus(onlyActive, '예정')).toEqual([]);
  });

  it('handles empty input array', () => {
    expect(filterByStatus([], '진행중')).toEqual([]);
  });
});

// --- PBT-03: Invariant properties ---

describe('filterByStatus — property-based tests', () => {
  it('PBT-03: "전체" filter preserves all items (size invariant)', () => {
    fc.assert(
      fc.property(announcementListArb, (items) => {
        const result = filterByStatus(items, '전체');
        expect(result).toHaveLength(items.length);
        expect(result).toEqual(items);
      }),
      { seed: 42 }, // PBT-08: fixed seed for reproducibility
    );
  });

  it('PBT-03: filtered result is always a subset of input', () => {
    fc.assert(
      fc.property(announcementListArb, statusFilterArb, (items, filter) => {
        const result = filterByStatus(items, filter);
        expect(result.length).toBeLessThanOrEqual(items.length);
        for (const item of result) {
          expect(items).toContainEqual(item);
        }
      }),
      { seed: 42 },
    );
  });

  it('PBT-03: all filtered items match the selected status', () => {
    fc.assert(
      fc.property(
        announcementListArb,
        fc.constantFrom('진행중' as const, '예정' as const),
        (items, filter) => {
          const result = filterByStatus(items, filter);
          for (const item of result) {
            expect(item.status).toBe(filter);
          }
        },
      ),
      { seed: 42 },
    );
  });

  it('PBT-03: partition invariant — "진행중" + "예정" counts equal total', () => {
    fc.assert(
      fc.property(announcementListArb, (items) => {
        const active = filterByStatus(items, '진행중');
        const upcoming = filterByStatus(items, '예정');
        expect(active.length + upcoming.length).toBe(items.length);
      }),
      { seed: 42 },
    );
  });

  // --- PBT-04: Idempotence ---

  it('PBT-04: filtering twice yields same result as once (idempotence)', () => {
    fc.assert(
      fc.property(announcementListArb, statusFilterArb, (items, filter) => {
        const once = filterByStatus(items, filter);
        const twice = filterByStatus(once, filter);
        expect(twice).toEqual(once);
      }),
      { seed: 42 },
    );
  });
});
