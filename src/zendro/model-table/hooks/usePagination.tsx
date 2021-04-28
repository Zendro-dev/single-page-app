import { useEffect, useState } from 'react';
import { QueryVariablePagination } from '@/types/queries';
import { PageInfo } from '@/types/requests';

export type TablePage = 'first' | 'last' | 'next' | 'previous';

export interface UsePaginationProps {
  recordCount: number;
  endCursor: string | null;
  startCursor: string | null;
  tablePage: TablePage;
  tableLimit: number;
}

export default function usePagination({
  recordCount,
  endCursor,
  startCursor,
  tablePage,
  tableLimit,
}: UsePaginationProps): QueryVariablePagination {
  const [pagination, setPagination] = useState<QueryVariablePagination>({
    first: tableLimit,
  });

  useEffect(() => {
    switch (tablePage) {
      case 'first':
        setPagination({ first: tableLimit });
        break;
      case 'last':
        setPagination({ last: tableLimit });
        break;
      case 'next':
        setPagination({
          first: tableLimit,
          after: recordCount ? endCursor : undefined,
        });
        break;
      case 'previous':
        setPagination({
          last: tableLimit,
          before: recordCount ? startCursor : undefined,
        });
        break;
    }
  }, [
    tableLimit,
    tablePage,
    endCursor,
    startCursor,
    recordCount,
    setPagination,
  ]);

  return pagination;
}
