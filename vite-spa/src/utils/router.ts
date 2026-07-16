/**
 * Parse a raw url into a string stripped of url queries.
 * @param path raw path including url queries
 * @returns parsed path without url queries
 */
export function parseRoute(path: string): { path: string; query?: string } {
  const queryIndex = path.lastIndexOf('?');
  if (queryIndex === -1)
    return {
      path,
      query: undefined,
    };
  return {
    path: path.substring(0, queryIndex),
    query: path.substring(queryIndex),
  };
}
