import { CrudRequest } from '@/types/requests';

/**
 * Get the CRUD request from the URL path
 * @param path current route path (`e.g from router.asPath`)
 */
export function getPathRequest(path: string): CrudRequest | undefined {
  const routePath = getRoutePath(path);
  const routeChunks = routePath.split('/');
  const lastChunk = routeChunks.pop();

  switch (lastChunk) {
    case 'details':
      return 'read';

    case 'edit':
      return 'update';

    case 'new':
      return 'create';

    case 'delete':
      return 'delete';

    default:
      return undefined;
  }
}

export function getRoutePath(path: string): string {
  const queryIndex = path.lastIndexOf('?');
  if (queryIndex === -1) return path;
  return path.substring(0, queryIndex);
}
