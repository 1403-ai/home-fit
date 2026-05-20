/**
 * number input의 value를 표시용 문자열로 변환
 * 값이 0이면 빈 문자열을 반환하여 leading zero 문제를 방지
 */
export function displayNumberValue(value: number): string {
  return value === 0 ? '' : String(value);
}

/**
 * number input의 onChange 이벤트에서 숫자 값을 파싱
 * 빈 문자열이면 0을 반환
 */
export function parseNumberInput(inputValue: string): number {
  if (inputValue === '' || inputValue === '-') return 0;
  const parsed = Number(inputValue);
  return isNaN(parsed) ? 0 : parsed;
}
