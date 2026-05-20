import type { QAStateMachine } from '../types/qa';

/**
 * Mock state machines keyed by announcement seq.
 * Covers boolean, number, and choice input types with branching transitions.
 */
export const mockStateMachines: Record<string, QAStateMachine> = {
  '2026-0042': {
    initial: 'q1',
    states: {
      q1: {
        type: 'question',
        text: '세대원 전원이 무주택자입니까?',
        input: 'boolean',
        profile_key: 'no_house',
        transitions: [
          { condition: { op: 'eq', value: false }, next: 'r_fail_house' },
          { condition: 'default', next: 'q2' },
        ],
      },
      q2: {
        type: 'question',
        text: '가구원 수는 몇 명입니까? (본인 포함)',
        input: 'number',
        unit: '명',
        profile_key: 'household_size',
        transitions: [
          { condition: { op: 'lte', value: 3 }, next: 'q3_small' },
          { condition: 'default', next: 'q3_large' },
        ],
      },
      q3_small: {
        type: 'question',
        text: '세대 월 평균 소득이 얼마입니까?',
        input: 'number',
        unit: '만원',
        profile_key: 'monthly_income',
        help: { ref: '소득기준' },
        transitions: [
          { condition: { op: 'lte', value: 354 }, next: 'r_pass' },
          { condition: { op: 'lte', value: 400 }, next: 'r_conditional' },
          { condition: 'default', next: 'r_fail_income' },
        ],
      },
      q3_large: {
        type: 'question',
        text: '세대 월 평균 소득이 얼마입니까?',
        input: 'number',
        unit: '만원',
        profile_key: 'monthly_income',
        help: { ref: '소득기준' },
        transitions: [
          { condition: { op: 'lte', value: 480 }, next: 'r_pass' },
          { condition: { op: 'lte', value: 550 }, next: 'r_conditional' },
          { condition: 'default', next: 'r_fail_income' },
        ],
      },
      r_pass: {
        type: 'result',
        result: '적합',
        units: [
          {
            complex_name: '마곡 A단지',
            location: '서울시 강서구 마곡동',
            unit_type: '39A',
            area_sqm: 39,
            supply_count: 120,
            track: '일반공급',
            cost: [
              { label: '보증금', amount: 23400000 },
              { label: '월 임대료', amount: 180000, period: '월' },
            ],
          },
        ],
        source_url: 'https://www.i-sh.co.kr/main/lay2/program/S1T294C295/www/brd/m_247/view.do?seq=2026-0042',
      },
      r_conditional: {
        type: 'result',
        result: '조건부',
        warnings: ['소득 초과 구간에 해당하여 추가 서류 확인이 필요합니다.'],
        source_url: 'https://www.i-sh.co.kr/main/lay2/program/S1T294C295/www/brd/m_247/view.do?seq=2026-0042',
      },
      r_fail_house: {
        type: 'result',
        result: '부적합',
        reason: '무주택 요건을 충족하지 않습니다. 세대원 전원이 무주택이어야 합니다.',
        source_url: 'https://www.i-sh.co.kr/main/lay2/program/S1T294C295/www/brd/m_247/view.do?seq=2026-0042',
      },
      r_fail_income: {
        type: 'result',
        result: '부적합',
        reason: '소득 기준을 초과합니다.',
        source_url: 'https://www.i-sh.co.kr/main/lay2/program/S1T294C295/www/brd/m_247/view.do?seq=2026-0042',
      },
    },
    meta: { total_questions: 3 },
  },

  '2026-0039': {
    initial: 'q1',
    states: {
      q1: {
        type: 'question',
        text: '세대원 전원이 무주택자입니까?',
        input: 'boolean',
        profile_key: 'no_house',
        transitions: [
          { condition: { op: 'eq', value: false }, next: 'r_fail_house' },
          { condition: 'default', next: 'q2' },
        ],
      },
      q2: {
        type: 'question',
        text: '신청하려는 공급 유형을 선택해 주세요.',
        input: 'choice',
        options: ['일반공급', '특별공급(신혼부부)', '특별공급(청년)', '특별공급(장애인)'],
        transitions: [
          { condition: { op: 'eq', value: '일반공급' }, next: 'q3_general' },
          { condition: { op: 'eq', value: '특별공급(신혼부부)' }, next: 'q3_newlywed' },
          { condition: 'default', next: 'q3_general' },
        ],
      },
      q3_general: {
        type: 'question',
        text: '세대 월 평균 소득이 얼마입니까?',
        input: 'number',
        unit: '만원',
        profile_key: 'monthly_income',
        transitions: [
          { condition: { op: 'lte', value: 600 }, next: 'r_pass_general' },
          { condition: 'default', next: 'r_fail_income' },
        ],
      },
      q3_newlywed: {
        type: 'question',
        text: '혼인 기간이 7년 이내입니까?',
        input: 'boolean',
        transitions: [
          { condition: { op: 'eq', value: false }, next: 'r_fail_marriage' },
          { condition: 'default', next: 'r_pass_newlywed' },
        ],
      },
      r_pass_general: {
        type: 'result',
        result: '적합',
        units: [
          {
            complex_name: '노원 B단지',
            location: '서울시 노원구 상계동',
            unit_type: '59B',
            area_sqm: 59,
            supply_count: 200,
            track: '일반공급',
            cost: [
              { label: '분양가', amount: 450000000 },
              { label: '계약금(10%)', amount: 45000000 },
            ],
          },
        ],
        source_url: 'https://www.i-sh.co.kr/main/lay2/program/S1T294C295/www/brd/m_247/view.do?seq=2026-0039',
      },
      r_pass_newlywed: {
        type: 'result',
        result: '적합',
        units: [
          {
            complex_name: '노원 B단지',
            location: '서울시 노원구 상계동',
            unit_type: '59A',
            area_sqm: 59,
            supply_count: 80,
            track: '특별공급(신혼부부)',
            cost: [
              { label: '분양가', amount: 430000000 },
              { label: '계약금(10%)', amount: 43000000 },
            ],
          },
        ],
        source_url: 'https://www.i-sh.co.kr/main/lay2/program/S1T294C295/www/brd/m_247/view.do?seq=2026-0039',
      },
      r_fail_house: {
        type: 'result',
        result: '부적합',
        reason: '무주택 요건을 충족하지 않습니다.',
        source_url: 'https://www.i-sh.co.kr/main/lay2/program/S1T294C295/www/brd/m_247/view.do?seq=2026-0039',
      },
      r_fail_income: {
        type: 'result',
        result: '부적합',
        reason: '소득 기준을 초과합니다.',
        source_url: 'https://www.i-sh.co.kr/main/lay2/program/S1T294C295/www/brd/m_247/view.do?seq=2026-0039',
      },
      r_fail_marriage: {
        type: 'result',
        result: '부적합',
        reason: '신혼부부 특별공급은 혼인 기간 7년 이내만 신청 가능합니다.',
        source_url: 'https://www.i-sh.co.kr/main/lay2/program/S1T294C295/www/brd/m_247/view.do?seq=2026-0039',
      },
    },
    meta: { total_questions: 3 },
  },
};
