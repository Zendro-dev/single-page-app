import { TableRecord } from '@/components/records-table/table2';
import { ParsedAttribute } from '@/types/models';
import {
  QueryModelTableRecordsVariables,
  QueryVariableOrder,
  QueryVariablePagination,
  QueryVariableSearch,
} from '@/types/queries';
import { PageInfo } from '@/types/requests';
import { createSearch } from '@/utils/search';
import { isEmptyArray } from '@/utils/validation';
import { useReducer } from 'react';

interface UseVariables {
  variables: QueryModelTableRecordsVariables;
  handleSearch: (value: string) => void;
  handleOrder: (field: string) => void;
  handlePagination: (action: string) => void;
  handlePaginationLimitChange: (
    event: React.ChangeEvent<{ value: number }>
  ) => void;
}

type VariableAction =
  | { type: 'SET_SEARCH'; payload: QueryVariableSearch }
  | { type: 'SET_ORDER'; payload: QueryVariableOrder }
  | { type: 'SET_PAGINATION'; payload: QueryVariablePagination }
  | { type: 'RESET' };

const initialVariables: QueryModelTableRecordsVariables = {
  search: undefined,
  order: undefined,
  pagination: { first: 25 },
  assocPagination: { first: 1 },
};

const variablesReducer = (
  variables: QueryModelTableRecordsVariables,
  action: VariableAction
): QueryModelTableRecordsVariables => {
  switch (action.type) {
    case 'SET_SEARCH':
      return {
        ...variables,
        search: action.payload,
      };
    case 'SET_ORDER':
      return {
        ...variables,
        order: action.payload,
      };
    case 'SET_PAGINATION':
      return {
        ...variables,
        pagination: action.payload,
      };
    case 'RESET':
      return {
        search: undefined,
        order: undefined,
        pagination: { first: 25 },
      };
  }
};

export default function useVariables(
  attributes: ParsedAttribute[],
  records: TableRecord[],
  pageInfo: PageInfo
): UseVariables {
  const [variables, dispatch] = useReducer(variablesReducer, initialVariables);

  /* SEARCH */
  const handleSearch = (value: string): void => {
    const search = createSearch(value, attributes);

    if (value === '') {
      dispatch({ type: 'RESET' });
    } else {
      dispatch({ type: 'SET_SEARCH', payload: search });
    }
  };

  /* ORDER */
  const handleOrder = (field: string): void => {
    const isAsc =
      field === variables.order?.field && variables.order.order === 'ASC';
    const order = isAsc ? 'DESC' : 'ASC';

    dispatch({ type: 'SET_ORDER', payload: { field, order } });
  };

  /* PAGINATION */
  const handlePagination = (action: string): void => {
    const limit = variables.pagination.first ?? variables.pagination.last;
    console.log({ action, limit, records, pageInfo });
    switch (action) {
      case 'first':
        dispatch({
          type: 'SET_PAGINATION',
          payload: {
            first: limit,
          },
        });
        break;
      case 'last':
        dispatch({
          type: 'SET_PAGINATION',
          payload: {
            last: limit,
          },
        });
        break;
      case 'forward':
        dispatch({
          type: 'SET_PAGINATION',
          payload: {
            first: limit,
            after: !isEmptyArray(records) ? pageInfo.endCursor : undefined,
          },
        });
        break;
      case 'backward':
        dispatch({
          type: 'SET_PAGINATION',
          payload: {
            last: limit,
            before: !isEmptyArray(records) ? pageInfo.startCursor : undefined,
          },
        });
        break;
    }
  };

  const handlePaginationLimitChange = (
    event: React.ChangeEvent<{ value: number }>
  ): void => {
    const limit = variables.pagination.first ?? variables.pagination.last;
    if (event.target.value !== limit) {
      dispatch({
        type: 'SET_PAGINATION',
        payload: {
          first: event.target.value,
          includeCursor: false,
        },
      });
    }
  };

  return {
    variables,
    handleSearch,
    handleOrder,
    handlePagination,
    handlePaginationLimitChange,
  };
}
