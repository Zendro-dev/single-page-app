import React, { useReducer, ReactElement, useState } from 'react';
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
import TableToolbar from './table-toolbar';
import EnhancedTableRow from './table-row';
import RecordsTablePagination from './table-pagination';
import useSWR from 'swr';
import { graphqlRequest } from '@/utils/requests';
import useAuth from '@/hooks/useAuth';
import { DataRecord, ParsedAttribute } from '@/types/models';
import {
  QueryModelTableRecordsVariables,
  QueryVariableOrder,
  QueryVariablePagination,
  QueryVariableSearch,
  RawQuery,
} from '@/types/queries';
import { createSearch } from '@/utils/search';
import useToastNotification from '@/hooks/useToastNotification';
import {
  EdgePageInfo,
  PageInfo,
  ReadManyResponse,
  RequestOneResponse,
} from '@/types/requests';
import { isEmptyArray, isNullorEmpty } from '@/utils/validation';

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

function unwrapConnection(
  data: ReadManyResponse,
  resolver: string
): EdgePageInfo {
  return {
    data: data[resolver].edges.map((edge) => edge.node),
    pageInfo: data[resolver].pageInfo,
  };
}

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
  /* HOOKS */
  const classes = useStyles();
  const router = useRouter();
  const { showSnackbar } = useToastNotification();
  const { auth } = useAuth();

  const [count, setCount] = useState<number>(0);
  const [rows, setRows] = useState<DataRecord[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    startCursor: null,
    endCursor: null,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const [variables, dispatch] = useReducer(variablesReducer, initialVariables);

  /* Handlers */
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
        const idField = attributes[0].name;
        if (auth.user?.token) {
          try {
            const { errors } = await graphqlRequest(
              auth.user?.token,
              requests.delete.query,
              {
                [idField]: primaryKey,
              }
            );
            if (!isNullorEmpty(errors))
              showSnackbar('Error in Graphql response', 'error', errors);

            mutateRecords();
            mutateCount();
          } catch (error) {
            console.log(error);
            showSnackbar('Error in request to server', 'error', error.response);
          }
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
            after: !isEmptyArray(rows) ? pageInfo.endCursor : undefined,
          },
        });
        break;
      case 'backward':
        dispatch({
          type: 'SET_PAGINATION',
          payload: {
            last: limit,
            before: !isEmptyArray(rows) ? pageInfo.startCursor : undefined,
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

  /* DATA FETCHING */
  // Records
  const { mutate: mutateRecords, isValidating: isValidatingRecords } = useSWR(
    auth?.user?.token
      ? [auth.user.token, requests.read.query, variables]
      : null,
    graphqlRequest,
    {
      onSuccess: ({ data, errors }) => {
        if (!isNullorEmpty(data)) {
          const connection = unwrapConnection(
            data as ReadManyResponse,
            requests.read.resolver
          );
          setRows(connection.data);
          setPageInfo(connection.pageInfo);
        }

        if (!isNullorEmpty(errors))
          showSnackbar('Error in Graphql response', 'error', errors);
      },
      onError: (error) => {
        console.error(error);
        showSnackbar('Error in request to server', 'error', error.response);
      },
      shouldRetryOnError: false,
    }
  );

  // Count
  const { mutate: mutateCount } = useSWR(
    auth?.user?.token
      ? [auth.user.token, requests.count.query, variables]
      : null,
    graphqlRequest,
    {
      onSuccess: ({ data, errors }) => {
        const countData = data as RequestOneResponse<number>;
        if (!isNullorEmpty(data)) setCount(countData[requests.count.resolver]);

        if (!isNullorEmpty(errors))
          showSnackbar('Error in Graphql response', 'error', errors);
      },
      onError: (error) => {
        console.error(error);
        showSnackbar('Error in request to server', 'error', error.response);
      },
      shouldRetryOnError: false,
    }
  );

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
          {!isEmptyArray(rows) && !isValidatingRecords && (
            <Fade in={!isValidatingRecords}>
              <TableBody>
                {rows.map((record, index) => (
                  // TODO key should use primaryKey value
                  <EnhancedTableRow
                    attributes={attributes}
                    permissions={auth.user?.permissions[modelName] ?? []}
                    record={record}
                    key={`${index}`}
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
        {!isValidatingRecords && isEmptyArray(rows) && (
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
        hasFirstPage={pageInfo.hasPreviousPage}
        hasLastPage={pageInfo.hasNextPage}
        hasPreviousPage={pageInfo.hasPreviousPage}
        hasNextPage={pageInfo.hasNextPage}
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
