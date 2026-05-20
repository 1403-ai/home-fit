/**
 * 숫자를 천 단위 콤마가 포함된 문자열로 변환
 * 예: 1000000 → "1,000,000"
 */
export function formatNumberWithComma(value: number): string {
  if (value === 0) return '';
  return value.toLocaleString('ko-KR');
}

/**
 * 콤마가 포함된 문자열을 숫자로 파싱
 * 예: "1,000,000" → 1000000
 */
export function parseCommaNumber(input: string): number {
  if (input === '' || input === '-') return 0;
  const cleaned = input.replace(/,/g, '');
  const parsed = Number(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * number input의 value를 표시용 문자열로 변환 (comma 포맷 적용)
 * 값이 0이면 빈 문자열을 반환하여 placeholder가 보이도록 함
 */
export function displayNumberValue(value: number): string {
  if (value === 0) return '';
  return value.toLocaleString('ko-KR');
}

/**
 * number input의 onChange 이벤트에서 숫자 값을 파싱
 * 콤마를 제거한 후 숫자로 변환
 * 빈 문자열이면 0을 반환
 */
export function parseNumberInput(inputValue: string): number {
  if (inputValue === '' || inputValue === '-') return 0;
  const cleaned = inputValue.replace(/,/g, '');
  // 숫자와 소수점만 허용
  if (!/^-?\d*\.?\d*$/.test(cleaned)) return 0;
  const parsed = Number(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}
