import { PathParams } from '@/types/models';
import { CrudRequest } from '@/types/requests';

interface ParsedQuery {
  model: string;
  request?: CrudRequest;
  resource?: string;
}
/**
 * Compute the type of operation requested from the URL query.
 * @param query valid Zendro url query
 */
export function parseUrlQuery(path: string, query: PathParams): ParsedQuery {
  const { model, read, update } = query ?? {};
  const create = path.split('/').pop() === 'item';

  const request = create
    ? 'create'
    : read
    ? 'read'
    : update
    ? 'update'
    : undefined;

  const resource = read ?? update ?? undefined;

  return {
    model,
    request,
    resource,
  };
}
