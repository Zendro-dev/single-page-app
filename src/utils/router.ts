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
export function parseUrlQuery(query: PathParams): ParsedQuery {
  const { model, create, read, update } = query;

  const request = create
    ? 'create'
    : read
    ? 'read'
    : update
    ? 'update'
    : undefined;

  const resource = create ?? read ?? update;

  return {
    model,
    request,
    resource,
  };
}
