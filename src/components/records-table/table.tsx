import React, { useMemo, useReducer, ReactElement } from 'react';
import { useRouter } from 'next/router';
import {
  Table,
  TableBody,
  makeStyles,
  TableContainer,
  Typography,
  CircularProgress,
  Fade,
  createStyles,
} from '@material-ui/core';
import EnhancedTableHead from './table-head';
import EnhancedTableRow from './table-row';
import TableToolbar from './table-toolbar';
import RecordsTablePagination from './table-pagination';
import useSWR from 'swr';
import { readMany, requestOne } from '@/utils/requests';
import useAuth from '@/hooks/useAuth';
import { ParsedAttribute } from '@/types/models';
import {
  ComposedQuery,
  QueryModelTableRecordsCountVariables,
  QueryModelTableRecordsVariables,
  QueryVariableOrder,
  QueryVariablePagination,
  QueryVariableSearch,
  RawQuery,
} from '@/types/queries';
import { createSearch } from '@/utils/search';

export interface EnhancedTableProps {
  modelName: string;
  attributes: ParsedAttribute[];
  requests: {
    read: RawQuery;
    delete: RawQuery;
    count: RawQuery;
  };
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

export default function EnhancedTable({
  modelName,
  attributes,
  requests,
}: EnhancedTableProps): ReactElement {
  // ? To accomodate associations will need to recive the operation as well
  const classes = useStyles();
  const router = useRouter();

  const [variables, dispatch] = useReducer(variablesReducer, initialVariables);

  const handleSetOrder = (value: QueryVariableOrder): void => {
    dispatch({ type: 'SET_ORDER', payload: value });
  };
  const handleActionClick = (
    action: 'create' | 'read' | 'update' | 'delete'
  ) => async (primaryKey: string | number) => {
    const route = `/${modelName}/item?${action}=${primaryKey}`;
    switch (action) {
      case 'read':
      case 'update':
        router.push(route);
        break;
      case 'create':
        router.push(`/${modelName}/item`);
        break;
      case 'delete': {
        const { query, resolver } = requests.delete;
        const idField = attributes[0].name;
        const request: ComposedQuery = {
          resolver,
          query,
          variables: { [idField]: primaryKey },
        };
        // TODO handle Errors
        // ? possibly mutate local data and run the refetch in background?
        if (auth.user?.token) {
          await requestOne(auth.user?.token, request);
          mutateRecords();
          mutateCount();
        }
        break;
      }
    }
  };

  const handleSetSearch = (value: string): void => {
    const search = createSearch(value, attributes);

    if (value === '') {
      dispatch({ type: 'RESET' });
    } else {
      dispatch({ type: 'SET_SEARCH', payload: search });
    }
  };

  const { auth } = useAuth();

  // Data Fetching: Records
  const readRequest = useMemo(() => {
    return {
      query: requests.read.query,
      resolver: requests.read.resolver,
      variables: variables,
    } as ComposedQuery<QueryModelTableRecordsVariables>;
  }, [variables, requests.read]);

  const {
    data: records,
    mutate: mutateRecords,
    isValidating: isValidatingRecords,
  } = useSWR(
    auth?.user?.token ? [auth.user.token, readRequest] : null,
    readMany,
    {
      // TODO error handling
      onError: (error) => {
        console.error(error);
      },
    }
  );

  // Data Fetching: Count
  const countRequest = useMemo(() => {
    return {
      query: requests.count.query,
      resolver: requests.count.resolver,
      variables: variables,
    } as ComposedQuery<QueryModelTableRecordsCountVariables>;
  }, [variables, requests.count]);

  const { data: count, mutate: mutateCount } = useSWR(
    auth?.user?.token ? [auth.user.token, countRequest] : null,
    requestOne,
    {
      // TODO error handling
      onError: (error) => {
        console.error(error);
      },
    }
  );

  const handlePagination = (action: string): void => {
    const limit = variables.pagination.first ?? variables.pagination.last;
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
            after: records ? records.pageInfo.endCursor : undefined,
          },
        });
        break;
      case 'backward':
        dispatch({
          type: 'SET_PAGINATION',
          payload: {
            last: limit,
            before: records ? records.pageInfo.startCursor : undefined,
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

  return (
    <TableContainer className={classes.root}>
      <TableToolbar
        modelName={modelName}
        permissions={auth.user?.permissions[modelName] ?? []}
        onAdd={handleActionClick('create')}
        onReload={() => mutateRecords()}
        onSearch={handleSetSearch}
      />

      <div className={classes.tableWrapper}>
        <Table stickyHeader size="medium">
          <EnhancedTableHead
            permissions={auth.user?.permissions[modelName] ?? []}
            attributes={attributes}
            handleSetOrder={handleSetOrder}
          />
          {records && !isValidatingRecords && (
            <Fade in={!isValidatingRecords}>
              <TableBody>
                {records.data.map((record, index) => (
                  // TODO key should use primaryKey
                  <EnhancedTableRow
                    attributes={attributes}
                    permissions={auth.user?.permissions[modelName] ?? []}
                    record={record}
                    key={`${record}-${index}`}
                    onRead={handleActionClick('read')}
                    onUpdate={handleActionClick('update')}
                    onDelete={handleActionClick('delete')}
                  />
                ))}
              </TableBody>
            </Fade>
          )}
        </Table>
        {isValidatingRecords && (
          <div className={classes.tablePlaceholder}>
            <Fade in={isValidatingRecords}>
              <CircularProgress color="primary" disableShrink={true} />
            </Fade>
          </div>
        )}
        {!isValidatingRecords && (!records || records?.data.length === 0) && (
          <div className={classes.tablePlaceholder}>
            <Typography variant="body1">No data to display</Typography>
          </div>
        )}
      </div>

      <RecordsTablePagination
        className={classes.pagination}
        onPagination={handlePagination}
        count={count}
        options={[5, 10, 15, 20, 25, 50]}
        paginationLimit={
          variables.pagination.first ?? variables.pagination.last
        }
        onPaginationLimitChange={handlePaginationLimitChange}
        hasFirstPage={records?.pageInfo.hasPreviousPage}
        hasLastPage={records?.pageInfo.hasNextPage}
        hasPreviousPage={records?.pageInfo.hasPreviousPage}
        hasNextPage={records?.pageInfo.hasNextPage}
      />
    </TableContainer>
  );
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      overflow: 'auto',
    },
    tableWrapper: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      overflow: 'auto',
    },
    tablePlaceholder: {
      display: 'flex',
      flexGrow: 0.5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    pagination: {
      padding: theme.spacing(6, 2),
    },
  })
);
