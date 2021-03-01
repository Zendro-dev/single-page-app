import React, { useMemo, useReducer, ReactElement } from 'react';
import {
  Table,
  TableBody,
  makeStyles,
  Paper,
  TableContainer,
  Typography,
  Box,
  CircularProgress,
} from '@material-ui/core';
import EnhancedTableHead from './EnhancedTableHead';
import EnhancedTableRow from './EnhancedTableRow';
import useSWR from 'swr';
import { readMany } from '@/utils/requests';
import useAuth from '@/hooks/useAuth';
import { ParsedAttribute } from '@/types/models';
import {
  ComposedQuery,
  QueryModelTableRecordsVariables,
  QueryVariableOrder,
  QueryVariablePagination,
  QueryVariableSearch,
  RawQuery,
} from '@/types/queries';

interface EnhancedTableProps {
  modelName: string;
  attributes: ParsedAttribute[];
  rawQuery: RawQuery;
}

type Action =
  | { type: 'SET_SEARCH'; value: QueryVariableSearch }
  | { type: 'SET_ORDER'; value: QueryVariableOrder }
  | { type: 'SET_PAGINATION'; value: QueryVariablePagination };

const initialVariables: QueryModelTableRecordsVariables = {
  search: undefined,
  order: undefined,
  pagination: { first: 10 },
};

const variablesReducer = (
  variables: QueryModelTableRecordsVariables,
  action: Action
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
  }
};

export default function EnhancedTable({
  modelName,
  attributes,
  rawQuery,
}: EnhancedTableProps): ReactElement {
  // ? To accomodate associations will need to recive the operation as well
  const classes = useStyles();

  const [variables, dispatch] = useReducer(variablesReducer, initialVariables);

  const handleSetOrder = (value: QueryVariableOrder): void => {
    dispatch({ type: 'SET_ORDER', value });
  };

  const { auth } = useAuth();

  const request = useMemo(() => {
    return {
      query: rawQuery.query,
      resolver: rawQuery.resolver,
      variables: variables,
    } as ComposedQuery<QueryModelTableRecordsVariables>;
  }, [variables, rawQuery]);

  const { data, isValidating } = useSWR(
    auth?.user?.token ? [auth.user.token, request] : null,
    readMany,
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

          {data && !isValidating && (
            <TableBody>
              {data.map((record, index) => (
                // TODO key should use primaryKey
                <EnhancedTableRow
                  attributes={attributes}
                  record={record}
                  key={`${record}-${index}`}
                />
              ))}
            </TableBody>
          )}
        </Table>
        {!data && (
          <Box
            display="flex"
            width="100%"
            height="100%"
            position="absolute"
            justifyContent="center"
            alignItems="center"
          >
            {isValidating ? (
              <CircularProgress color="primary" disableShrink={true} />
            ) : (
              <Typography variant="body1">No data to display</Typography>
            )}
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
    minWidth: '50%',
  },
  tableBackdrop: {
    WebkitTapHighlightColor: 'transparent',
    minWidth: '100%',
    minHeight: '100%',
  },
}));
