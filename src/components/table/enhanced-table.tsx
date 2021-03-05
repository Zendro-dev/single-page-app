import React, { useMemo, useReducer, ReactElement } from 'react';
import { useRouter } from 'next/router';
import {
  Table,
  TableBody,
  makeStyles,
  Paper,
  TableContainer,
  Typography,
  Box,
  CircularProgress,
  Fade,
} from '@material-ui/core';
import EnhancedTableHead from './enhanced-tablehead';
import EnhancedTableRow, { ActionHandler } from './enhanced-tablerow';
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
  | { type: 'SET_SEARCH'; value: QueryVariableSearch }
  | { type: 'SET_ORDER'; value: QueryVariableOrder }
  | { type: 'SET_PAGINATION'; value: QueryVariablePagination }
  | { type: 'RESET'; value: QueryVariablePagination };

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
        search: action.value,
      };
    case 'SET_ORDER':
      return {
        ...variables,
        order: action.value,
      };
    case 'SET_PAGINATION':
      return {
        ...variables,
        pagination: action.value,
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
    dispatch({ type: 'SET_ORDER', value });
  };
  const handleActionClick: ActionHandler = async (primaryKey, action) => {
    const route = `/${modelName}/item?${action}=${primaryKey}`;
    switch (action) {
      case 'read':
      case 'update':
        router.push(route);
        break;
      case 'delete': {
        console.log(action + ' - ' + primaryKey);
        const { query, resolver } = requests.delete;
        const request: ComposedQuery = {
          resolver,
          query,
          variables: { id: primaryKey },
        };
        console.log(request);
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
  } = useSWR<unknown[]>(
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
      variables: variables.search,
    } as ComposedQuery<QueryModelTableRecordsCountVariables>;
  }, [variables.search, requests.count]);

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

  return (
    <TableContainer component={Paper} className={classes.paper}>
      <div>{`TOOLBAR - ${modelName}`}</div>
      <div className={classes.tableWrapper}>
        <Table stickyHeader size="small">
          <EnhancedTableHead
            attributes={attributes}
            handleSetOrder={handleSetOrder}
          />
          {records && !isValidatingRecords && (
            <Fade in={!isValidatingRecords}>
              <TableBody>
                {records.map((record, index) => (
                  // TODO key should use primaryKey
                  <EnhancedTableRow
                    attributes={attributes}
                    record={record}
                    key={`${record}-${index}`}
                    onAction={handleActionClick}
                  />
                ))}
              </TableBody>
            </Fade>
          )}
        </Table>
        {isValidatingRecords && (
          <Box
            display="flex"
            width="100%"
            height="100%"
            position="absolute"
            justifyContent="center"
            alignItems="center"
          >
            <Fade in={isValidatingRecords}>
              <CircularProgress color="primary" disableShrink={true} />
            </Fade>
          </Box>
        )}
        {!isValidatingRecords &&
          Array.isArray(records) &&
          records.length === 0 && (
            <Box
              display="flex"
              width="100%"
              height="100%"
              position="absolute"
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant="body1">No data to display</Typography>
            </Box>
          )}
      </div>
      <div style={{ textAlign: 'right' }}>PAGINATION</div>
    </TableContainer>
  );
}

const useStyles = makeStyles(() => ({
  tableWrapper: {
    height: `calc(100vh - 72px - 48px - 128px - 80px)`,
    minWidth: 570,
    overflow: 'auto',
    position: 'relative',
  },
  paper: {
    overflow: 'auto',
    height: `calc(100vh - 72px  - 48px)`,
    minWidth: 570,
  },
  tableBackdrop: {
    WebkitTapHighlightColor: 'transparent',
    minWidth: '100%',
    minHeight: '100%',
  },
}));
