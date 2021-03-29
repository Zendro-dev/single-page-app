/**
 * Check whether an array or mapped type has non-falsy values.
 * @param x array or object to check
 * @returns whether the object has non-falsy values
 */
export function hasValues(x: unknown[] | Record<string, unknown>): boolean {
  return Object.values(x).some((x) => x);
}

/**
 * Check whether an unknown variable is:
 * - an empty array
 * - an empty object
 * - null
 * - undefined
 * @param x variable to check
 */
export function isNullorEmpty(x: unknown): boolean {
  if (isNullorUndefined(x)) return true;
  if (isObject(x)) return Object.keys(x).length === 0;
  if (Array.isArray(x)) return x.length === 0;
  return false;
}

/**
 * Check whether an unknown variable is null or undefined.
 * @param x variable to validate
 */
export function isNullorUndefined(x: unknown): x is null | undefined {
  return x === null || x === undefined;
}

/**
 * Check whether a variable is an empty type of Array.
 * @param x variable to validate
 */
export function isEmptyArray(x: unknown): boolean {
  return Array.isArray(x) && x.length === 0;
}

/**
 * Check whether a variable is an empty type of Record<string,unknown>.
 * @param x variable to validate
 */
export function isEmptyObject(x: unknown): boolean {
  return isObject(x) ? Object.keys(x).length === 0 : false;
}

/**
 * Check whether a variable is of type Record<string,unknown> and empty.
 * @param x variable to validate
 * @returns whether _x_ is an empty object
 */
export function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x);
}

export function isIntValue(value: string): boolean {
  const int = parseInt(value);
  return !value.includes('.') && !isNaN(int) && typeof int === 'number';
}
