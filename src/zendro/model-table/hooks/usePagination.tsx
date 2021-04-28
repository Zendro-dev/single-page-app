import { useEffect, useState } from 'react';
import { QueryVariablePagination } from '@/types/queries';
import { PageInfo } from '@/types/requests';
import { TableRecord } from '../table';

export type TablePage = 'first' | 'last' | 'next' | 'previous';

export interface UsePaginationProps {
  records: TableRecord[];
  pageInfo: PageInfo;
  tablePage: TablePage;
  tableLimit: number;
}

export default function usePagination({
  records,
  pageInfo,
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
          after: records.length ? pageInfo.endCursor : undefined,
        });
        break;
      case 'previous':
        setPagination({
          last: tableLimit,
          before: records.length ? pageInfo.startCursor : undefined,
        });
        break;
    }
  }, [tableLimit, tablePage, pageInfo, records, setPagination]);

  return pagination;
}
