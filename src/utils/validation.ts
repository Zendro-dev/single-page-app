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
  // A Date has no enumerable own keys regardless of its value (its time is
  // stored in an internal slot, not a property) - Object.keys(x).length===0
  // below would always be true for one, so every valid DateTime field value
  // would count as "empty". Only an invalid Date should count as empty.
  if (x instanceof Date) return isNaN(x.getTime());
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

/**
 * Check whether a given string value is a number.
 * @param value string to check
 * @returns wheter the given value is a valid number (float or integer)
 */
export function isNumber(value: string): boolean {
  return /(^\d+(?:\.\d+)?)+$/.test(value);
}

/**
 * Check whether a given string value (e.g. from an input) is a valid integer.
 * @param value string to convert and check
 * @returns whether the given value is a valid integer
 */
export function isIntValue(value: string): boolean {
  return value.includes('.') || value.includes(' ')
    ? false
    : !isNaN(parseInt(value));
}
