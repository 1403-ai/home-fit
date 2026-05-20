export type InputType = 'boolean' | 'number' | 'choice';

export type EligibilityResult = '적합' | '부적합' | '조건부';

export interface Transition {
  condition: { op: string; value: unknown } | 'default';
  next: string;
}

export interface QuestionState {
  type: 'question';
  text: string;
  input: InputType;
  unit?: string;
  options?: string[];
  profile_key?: string;
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
  cost: { label: string; amount: number; period?: string }[];
}

export interface ResultState {
  type: 'result';
  result: EligibilityResult;
  reason?: string;
  warnings?: string[];
  units?: ResultUnit[];
  source_url?: string;
}

export type StateNode = QuestionState | ResultState;

export interface QAStateMachine {
  initial: string;
  states: Record<string, StateNode>;
  meta: { total_questions: number };
}

export type Answer = boolean | number | string;

export interface AnswerEntry {
  stateId: string;
  answer: Answer;
}
