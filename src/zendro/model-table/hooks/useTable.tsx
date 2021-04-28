import { ParsedAttribute } from '@/types/models';
import {
  QueryModelTableRecordsVariables,
  QueryVariableOrder,
  QueryVariablePagination,
  QueryVariables,
  QueryVariableSearch,
} from '@/types/queries';
import { PageInfo } from '@/types/requests';
import { createSearch } from '@/utils/search';
import { isEmptyArray } from '@/utils/validation';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { TableRecord } from '@/zendro/model-table/table';
import useSearch, { UseSearchProps } from './useSearch';

interface UseTable {
  variables: QueryModelTableRecordsVariables;
  setOrder: Dispatch<SetStateAction<QueryVariableOrder | undefined>>;
  setPagination: Dispatch<SetStateAction<QueryVariablePagination>>;
  setAssocPagination: Dispatch<SetStateAction<QueryVariablePagination>>;
  handleOrder: (field: string) => void;
  handlePagination: (action: string) => void;
  handlePaginationLimitChange: (
    event: React.ChangeEvent<{ value: number }>
  ) => void;
  reset: () => void;
}

interface UseTableProps extends UseSearchProps {
  attributes: ParsedAttribute[];
  records: TableRecord[];
  pageInfo: PageInfo;
  associationPrimaryKeyValue: string;
  associationPrimaryKey: string;
}

// type VariableAction =
//   | { type: 'SET_SEARCH'; payload: QueryVariableSearch }
//   | { type: 'ADD_SEARCH'; payload: QueryVariableSearch }
//   | { type: 'SET_ORDER'; payload: QueryVariableOrder }
//   | { type: 'SET_PAGINATION'; payload: QueryVariablePagination }
//   | { type: 'RESET' };

// const initialVariables: QueryModelTableRecordsVariables = {
//   search: undefined,
//   order: undefined,
//   pagination: { first: 25 },
//   assocPagination: { first: 1 },
// };

export default function useTable({
  attributes,
  records,
  pageInfo,
  searchText,
  associationFilter,
  recordsToAdd,
  recordsToRemove,
  primaryKey,
  associationPrimaryKeyValue,
  associationPrimaryKey,
}: UseTableProps): // filter: AssociatonFilter
UseTable {
  const [order, setOrder] = useState<QueryVariableOrder | undefined>(undefined);
  const [pagination, setPagination] = useState<QueryVariablePagination>({
    first: 25,
  });
  // const [recordId, setRecordId] = useState<QueryVariables | undefined>(
  //   undefined
  // );

  // const [assocSearch, setAssocSearch] = useState<
  //   QueryVariableSearch | undefined
  // >(undefined);
  const [
    assocPagination,
    setAssocPagination,
  ] = useState<QueryVariablePagination>({
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

  // const handleFilter = (value: AssociatonFilter): void => {

  // };

  console.log('useTable');

  /* ORDER */
  const handleOrder = (field: string): void => {
    const isAsc = field === order?.field && order.order === 'ASC';
    const orderToSet = isAsc ? 'DESC' : 'ASC';
    setOrder({ field, order: orderToSet });
  };

  /* PAGINATION */
  const handlePagination = (action: string): void => {
    const limit = pagination.first ?? pagination.last;
    // console.log({ action, limit, records, pageInfo });
    switch (action) {
      case 'first':
        setPagination({ first: limit });
        break;
      case 'last':
        setPagination({ last: limit });
        break;
      case 'forward':
        setPagination({
          first: limit,
          after: !isEmptyArray(records) ? pageInfo.endCursor : undefined,
        });
        break;
      case 'backward':
        setPagination({
          last: limit,
          before: !isEmptyArray(records) ? pageInfo.startCursor : undefined,
        });
        break;
    }
  };

  const handlePaginationLimitChange = (
    event: React.ChangeEvent<{ value: number }>
  ): void => {
    const limit = pagination.first ?? pagination.last;
    if (event.target.value !== limit) {
      setPagination({
        first: event.target.value,
        includeCursor: false,
      });
    }
  };

  const reset = (): void => {
    setOrder(undefined);
    setPagination({ first: 25 });
    // setAssocSearch(undefined);
    setAssocPagination({ first: 1 });
    // setRecordId({ undefined });
  };

  // const filterReset (): void => {
  //   set
  // }

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
    setOrder,
    setPagination,
    setAssocPagination,
    handleOrder,
    handlePagination,
    handlePaginationLimitChange,
    reset,
  };
}
