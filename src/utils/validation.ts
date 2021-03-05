/**
 * Check whether an unknown variable is:
 * - an empty array
 * - an empty object
 * - null
 * - undefined
 * @param x variable to check
 */
export function isNullorEmpty(x: unknown): boolean {
  return isNullorUndefined(x) || isEmptyArray(x) || isEmptyObject(x);
}

/**
 * Check whether an unknown variable is null or undefined.
 * @param x variable to validate
 */
export function isNullorUndefined(x: unknown): x is null | undefined {
  return x === null || x === undefined;
}

/**
 * Check whether a variable is an empty array.
 * @param x variable to validate
 */
export function isEmptyArray(x: unknown): boolean {
  return Array.isArray(x) && x.length === 0;
}

/**
 * Check whether a variable is:
 * - an empty array
 * - an empty object
 * @param x variable to validate
 */
export function isEmptyObject(x: unknown): boolean {
  if (isNullorUndefined(x) || typeof x !== 'object') return false;
  const _x = x as { length: number };
  return _x.length !== undefined && _x.length === 0;
}
