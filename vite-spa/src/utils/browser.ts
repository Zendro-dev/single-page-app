/**
 * Check whether the current browser is Safari.
 * @returns whether the current browser is Safari
 */
export function isSafari(): boolean {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
