import { React, useMemo, useState, useReducer } from 'react';
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
import { useSelector } from 'react-redux';
import { authSelector } from '@/store/auth-slice';
import { readMany } from '@/utils/requests';
import useAuth from '@/hooks/useAuth';

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

const initialVariables = {
  search: undefined,
  order: undefined,
  pagination: { first: 10 },
};

const ACTIONS = {
  SET_SEARCH: 'setSearch',
  SET_ORDER: 'setOrder',
  SET_PAGINATION: 'setPagination',
};

const variablesReducer = (variables, action) => {
  switch (action.type) {
    case ACTIONS.SET_SEARCH:
      return {
        ...variables,
        search: action.value,
      };
    case ACTIONS.SET_ORDER:
      console.log(action);
      return {
        ...variables,
        order: action.value,
      };
    case ACTIONS.SET_PAGINATION:
      return {
        ...variables,
        pagination: action.value,
      };
  }
};

export default function EnhancedTable({ modelName, attributes, rawQuery }) {
  // ? To accomodate associations will need to recive the operation as well
  const classes = useStyles();

  const [variables, dispatch] = useReducer(variablesReducer, initialVariables);

  const handleSetOrder = (value) => {
    dispatch({ type: ACTIONS.SET_ORDER, value });
  };

  const { auth } = useAuth();

  const request = useMemo(() => {
    return {
      query: rawQuery.query,
      resolver: rawQuery.resolver,
      variables: variables,
    };
  }, [variables, rawQuery]);

  const { data, error, isValidating } = useSWR(
    auth?.user?.token ? [auth.user.token, request] : null,
    readMany
  );

  return (
    <TableContainer component={Paper} className={classes.paper}>
      <div>TOOLBAR</div>
      <div className={classes.tableWrapper}>
        <Table stickyHeader size="small">
          <EnhancedTableHead
            attributes={attributes}
            handleSetOrder={handleSetOrder}
          />

          {data && !isValidating ? (
            <TableBody>
              {data.map((record, index) => (
                // TODO key should use primaryKey
                <EnhancedTableRow
                  attributes={attributes}
                  record={record}
                  key={`${record[0]}-${index}`}
                />
              ))}
            </TableBody>
          ) : (
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
        </Table>
      </div>
      <div style={{ textAlign: 'right' }}>PAGINATION</div>
    </TableContainer>
  );
}
