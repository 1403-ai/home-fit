import type {
  Answer,
  QuestionState,
  ResultState,
  StateNode,
  Transition,
} from '../types/qa';

/**
 * Type guard: checks if a state node is a QuestionState.
 */
export function isQuestionState(state: StateNode): state is QuestionState {
  return state.type === 'question';
}

/**
 * Type guard: checks if a state node is a ResultState.
 */
export function isResultState(state: StateNode): state is ResultState {
  return state.type === 'result';
}

/**
 * Evaluates a transition condition against an answer.
 */
function matchesCondition(
  condition: Transition['condition'],
  answer: Answer,
): boolean {
  if (condition === 'default') return true;

  const { op, value } = condition;

  switch (op) {
    case 'eq':
      return answer === value;
    case 'neq':
      return answer !== value;
    case 'lt':
      return typeof answer === 'number' && answer < (value as number);
    case 'lte':
      return typeof answer === 'number' && answer <= (value as number);
    case 'gt':
      return typeof answer === 'number' && answer > (value as number);
    case 'gte':
      return typeof answer === 'number' && answer >= (value as number);
    default:
      return false;
  }
}

/**
 * Evaluates transitions in order and returns the next state ID.
 * Falls back to the first 'default' transition if no condition matches.
 * Throws if no transition matches (should not happen with well-formed data).
 */
export function evaluateTransition(
  transitions: Transition[],
  answer: Answer,
): string {
  for (const t of transitions) {
    if (matchesCondition(t.condition, answer)) {
      return t.next;
    }
  }
  // Should never reach here if state machine has a default transition
  throw new Error('No matching transition found for the given answer.');
}
