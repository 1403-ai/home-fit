// --- Announcement ---
export interface AnnouncementSummary {
  seq: string;
  title: string;
  housing_type: string;
  supply_category: '임대' | '분양';
  status: '진행중' | '예정';
  application_start: string | null;
  application_end: string | null;
  unit_count: number;
  source_url: string | null;
}

// --- Q&A State Machine ---
export interface Transition {
  condition: {
    op: 'eq' | 'gt' | 'lt' | 'gte' | 'lte';
    value: string | number | boolean;
  };
  next: string;
}

export interface QuestionState {
  type: 'question';
  text: string;
  input: 'boolean' | 'number' | 'choice';
  unit?: string;
  options?: string[];
  profile_key?: string | null;
  help?: { ref: string };
  transitions: Transition[];
}

export interface ResultUnit {
  complex_name: string;
  location: string;
  unit_type: string;
  area_sqm: number;
  supply_count: number;
  track: string;
  cost: Array<{
    label: string;
    amount: number;
    period: 'monthly' | 'once' | null;
  }>;
}

export interface ResultState {
  type: 'result';
  result: '적합' | '부적합' | '조건부';
  reason?: string;
  warnings?: string[];
  units?: ResultUnit[];
  source_url?: string;
}

export type State = QuestionState | ResultState;

export interface QAStateMachine {
  initial: string;
  meta: { total_questions: number };
  states: Record<string, State>;
}

// --- Glossary ---
export interface GlossaryEntry {
  term: string;
  category: '소득기준' | '주택정보' | '자격요건' | '공급유형';
  description: string;
  related: string[];
}

// --- Analysis Result ---
export interface AnalysisResult {
  announcements: AnnouncementSummary[];
  qa_state_machine: QAStateMachine;
  glossary: GlossaryEntry[];
}
