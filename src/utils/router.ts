import { CrudRequest } from '@/types/requests';

/**
 * Compute the requested model operation from the URL path and model name.
 * @param path current router path (`router.asPath`)
 * @param model requested model name
 */
export function getPathRequest(
  path: string,
  model: string
): CrudRequest | undefined {
  let lastChunk = path.split('/').pop();
  if (!lastChunk) return;

  const query = lastChunk.indexOf('?');
  if (query > -1) lastChunk = lastChunk.substring(0, query);
  if (!lastChunk) return;

  return lastChunk === model || lastChunk === 'details'
    ? 'read'
    : lastChunk === 'edit'
    ? 'update'
    : lastChunk === 'new'
    ? 'create'
    : undefined;
}
