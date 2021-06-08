import { useMemo } from 'react';
import { QueryVariablePagination } from '@/types/queries';

export type TablePaginationPosition = 'first' | 'last' | 'next' | 'previous';

export interface UseTablePaginationProps {
  cursor: string | null;
  limit: number;
  position: TablePaginationPosition;
}

export default function usePagination({
  cursor,
  limit,
  position,
}: UseTablePaginationProps): QueryVariablePagination {
  const pagination = useMemo(() => {
    switch (position) {
      case 'first':
        return { first: limit };
      case 'last':
        return { last: limit };
      case 'next':
        return {
          first: limit,
          after: cursor, // endCursor
        };
      case 'previous':
        return {
          last: limit,
          before: cursor, // startCursor
        };
    }
  }, [cursor, limit, position]);

  return pagination;
}
