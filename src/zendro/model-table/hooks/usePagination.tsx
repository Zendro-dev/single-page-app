import { useMemo } from 'react';
import { QueryVariablePagination } from '@/types/queries';

export type TablePaginationPosition = 'first' | 'last' | 'next' | 'previous';

export interface UseTablePaginationProps {
  cursor: string | null;
  limit: number;
  position: TablePaginationPosition;
  includeCursor?: boolean;
}

export default function usePagination({
  cursor,
  limit,
  position,
  includeCursor,
}: UseTablePaginationProps): QueryVariablePagination {
  const pagination = useMemo(() => {
    switch (position) {
      case 'first':
        return { first: limit, includeCursor };
      case 'last':
        return { last: limit, includeCursor };
      case 'next':
        return {
          first: limit,
          after: cursor, // endCursor
          includeCursor,
        };
      case 'previous':
        return {
          last: limit,
          before: cursor, // startCursor
          includeCursor,
        };
    }
  }, [cursor, limit, position, includeCursor]);

  return pagination;
}
