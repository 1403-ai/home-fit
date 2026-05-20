import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import type { Answer, Transition, QAStateMachine } from '../types/qa';
import {
  evaluateTransition,
  isQuestionState,
  isResultState,
} from './qaStateMachine';
import { mockStateMachines } from '../mocks/qa-state-machines';

// --- PBT-07: Domain-specific generators ---

const booleanAnswerArb = fc.boolean();
const numberAnswerArb = fc.integer({ min: 0, max: 10000 });
const choiceAnswerArb = fc.constantFrom(
  '일반공급',
  '특별공급(신혼부부)',
  '특별공급(청년)',
  '특별공급(장애인)',
);
const answerArb: fc.Arbitrary<Answer> = fc.oneof(
  booleanAnswerArb,
  numberAnswerArb,
  choiceAnswerArb,
);

const transitionWithDefaultArb: fc.Arbitrary<Transition[]> = fc
  .array(
    fc.record({
      condition: fc.record({
        op: fc.constantFrom('eq', 'neq', 'lt', 'lte', 'gt', 'gte'),
        value: fc.oneof(
          fc.boolean() as fc.Arbitrary<unknown>,
          fc.integer({ min: 0, max: 1000 }) as fc.Arbitrary<unknown>,
          fc.constantFrom('일반공급', '특별공급(신혼부부)') as fc.Arbitrary<unknown>,
        ),
      }),
      next: fc.stringMatching(/^[a-z_][a-z0-9_]*$/),
    }),
    { minLength: 0, maxLength: 5 },
  )
  .map((transitions) => [
    ...transitions,
    { condition: 'default' as const, next: 'fallback_state' },
  ]);

// --- PBT-10: Example-based tests ---

describe('qaStateMachine — example-based tests', () => {
  it('evaluateTransition returns correct next state for boolean eq true', () => {
    const transitions: Transition[] = [
      { condition: { op: 'eq', value: false }, next: 'fail' },
      { condition: 'default', next: 'pass' },
    ];
    expect(evaluateTransition(transitions, true)).toBe('pass');
  });

  it('evaluateTransition returns correct next state for boolean eq false', () => {
    const transitions: Transition[] = [
      { condition: { op: 'eq', value: false }, next: 'fail' },
      { condition: 'default', next: 'pass' },
    ];
    expect(evaluateTransition(transitions, false)).toBe('fail');
  });

  it('evaluateTransition handles lte for number', () => {
    const transitions: Transition[] = [
      { condition: { op: 'lte', value: 354 }, next: 'pass' },
      { condition: { op: 'lte', value: 400 }, next: 'conditional' },
      { condition: 'default', next: 'fail' },
    ];
    expect(evaluateTransition(transitions, 300)).toBe('pass');
    expect(evaluateTransition(transitions, 354)).toBe('pass');
    expect(evaluateTransition(transitions, 380)).toBe('conditional');
    expect(evaluateTransition(transitions, 500)).toBe('fail');
  });

  it('evaluateTransition handles choice eq', () => {
    const transitions: Transition[] = [
      { condition: { op: 'eq', value: '일반공급' }, next: 'general' },
      { condition: { op: 'eq', value: '특별공급(신혼부부)' }, next: 'newlywed' },
      { condition: 'default', next: 'general' },
    ];
    expect(evaluateTransition(transitions, '일반공급')).toBe('general');
    expect(evaluateTransition(transitions, '특별공급(신혼부부)')).toBe('newlywed');
    expect(evaluateTransition(transitions, '특별공급(청년)')).toBe('general');
  });

  it('isQuestionState and isResultState type guards work', () => {
    const machine = mockStateMachines['2026-0042'];
    expect(isQuestionState(machine.states['q1'])).toBe(true);
    expect(isResultState(machine.states['q1'])).toBe(false);
    expect(isResultState(machine.states['r_pass'])).toBe(true);
    expect(isQuestionState(machine.states['r_pass'])).toBe(false);
  });
});

// --- PBT-03: Invariant properties ---

describe('qaStateMachine — property-based tests', () => {
  it('PBT-03: evaluateTransition with default always returns a string', () => {
    fc.assert(
      fc.property(transitionWithDefaultArb, answerArb, (transitions, answer) => {
        const result = evaluateTransition(transitions, answer);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      }),
      { seed: 42 },
    );
  });

  it('PBT-04: evaluating same answer twice gives same result (deterministic)', () => {
    fc.assert(
      fc.property(transitionWithDefaultArb, answerArb, (transitions, answer) => {
        const first = evaluateTransition(transitions, answer);
        const second = evaluateTransition(transitions, answer);
        expect(first).toBe(second);
      }),
      { seed: 42 },
    );
  });

  it('PBT-03: result is always one of the defined next states in transitions', () => {
    fc.assert(
      fc.property(transitionWithDefaultArb, answerArb, (transitions, answer) => {
        const result = evaluateTransition(transitions, answer);
        const validNextStates = transitions.map((t) => t.next);
        expect(validNextStates).toContain(result);
      }),
      { seed: 42 },
    );
  });

  // PBT-06: Stateful — random answer sequences always terminate or stay in valid states
  it('PBT-06: random answer sequences on mock machine always reach valid states', () => {
    const machineEntries = Object.values(mockStateMachines);

    fc.assert(
      fc.property(
        fc.constantFrom(...machineEntries),
        fc.array(answerArb, { minLength: 1, maxLength: 10 }),
        (machine: QAStateMachine, answers: Answer[]) => {
          let currentId = machine.initial;

          for (const answer of answers) {
            const state = machine.states[currentId];
            if (!state || isResultState(state)) break;

            const nextId = evaluateTransition(state.transitions, answer);
            expect(nextId in machine.states).toBe(true);
            currentId = nextId;
          }

          // After all answers, we should be at a valid state
          expect(currentId in machine.states).toBe(true);
        },
      ),
      { seed: 42 },
    );
  });
});
