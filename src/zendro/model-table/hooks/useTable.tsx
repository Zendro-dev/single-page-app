import { useMemo, useState } from 'react';

import { ParsedAttribute } from '@/types/models';
import {
  QueryModelTableRecordsVariables,
  QueryVariablePagination,
} from '@/types/queries';
import { PageInfo } from '@/types/requests';

import useOrder, { UseOrderProps } from './useOrder';
import usePagination, { UsePaginationProps } from './usePagination';
import useSearch, { UseSearchProps } from './useSearch';

interface UseTable {
  variables: QueryModelTableRecordsVariables;
}

interface UseTableProps
  extends UseOrderProps,
    UsePaginationProps,
    UseSearchProps {
  attributes: ParsedAttribute[];
  recordCount: number;
  pageInfo: PageInfo;
  associationPrimaryKeyValue: string;
  associationPrimaryKey: string;
}

export default function useTable({
  attributes,
  recordCount: recordCount,
  pageInfo,
  // PAGINATION
  tablePage,
  tableLimit,
  // SEARCH
  primaryKey,
  associationPrimaryKeyValue,
  associationPrimaryKey,
  associationFilter,
  recordsToAdd,
  recordsToRemove,
  searchText,
  // SORTING
  sortDirection,
  sortField,
}: UseTableProps): UseTable {
  const [assocPagination] = useState<QueryVariablePagination>({
    first: 1,
  });

  /* SEARCH */

  const search = useSearch({
    associationFilter,
    attributes,
    primaryKey,
    recordsToAdd,
    recordsToRemove,
    searchText,
  });

  /* PAGINATION */

  const pagination = usePagination({
    recordCount,
    endCursor: pageInfo.endCursor,
    startCursor: pageInfo.startCursor,
    tableLimit,
    tablePage,
  });

  /* SORTING */

  const order = useOrder({
    sortDirection: sortDirection,
    sortField: sortField,
  });

  /* COMPOSED VARIABLES */

  const variables = useMemo<QueryModelTableRecordsVariables>(
    () => ({
      search,
      order,
      pagination,
      assocPagination,
      assocSearch: {
        field: associationPrimaryKey,
        value: associationPrimaryKeyValue,
        operator: 'eq',
      },
      [associationPrimaryKey]: associationPrimaryKeyValue,
    }),
    [
      assocPagination,
      order,
      pagination,
      search,
      associationPrimaryKey,
      associationPrimaryKeyValue,
    ]
  );

  return {
    variables,
  };
}
