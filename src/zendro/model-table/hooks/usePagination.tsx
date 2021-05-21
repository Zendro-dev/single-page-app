import { useEffect, useMemo, useState } from 'react';
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
  // const [pagination, setPagination] = useState<QueryVariablePagination>({
  //   first: limit,
  // });

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

  // useEffect(() => {
  //   console.log('-- usePagination --');
  //   switch (position) {
  //     case 'first':
  //       setPagination({ first: limit });
  //       break;
  //     case 'last':
  //       setPagination({ last: limit });
  //       break;
  //     case 'next':
  //       setPagination({
  //         first: limit,
  //         after: cursor, // endCursor
  //       });
  //       break;
  //     case 'previous':
  //       setPagination({
  //         last: limit,
  //         before: cursor, // startCursor
  //       });
  //       break;
  //   }
  // }, [cursor, limit, position, setPagination]);

  return pagination;
}
