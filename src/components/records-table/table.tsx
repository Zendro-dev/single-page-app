import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { useReducer, ReactElement, useState } from 'react';
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
import EnhancedTableRow, { TableRowAssociationHandler } from './table-row';
import RecordsTablePagination from './table-pagination';
import useSWR from 'swr';
import { DataRecord, ParsedAttribute } from '@/types/models';
import {
  QueryModelTableRecordsVariables,
  QueryVariableOrder,
  QueryVariablePagination,
  QueryVariables,
  QueryVariableSearch,
  RawQuery,
} from '@/types/queries';
import { createSearch } from '@/utils/search';
import { EdgePageInfo, PageInfo, ReadManyResponse } from '@/types/requests';
import { isEmptyArray, isNullorEmpty } from '@/utils/validation';

import {
  useAuth,
  useDialog,
  useToastNotification,
  useZendroClient,
} from '@/hooks';
import { ExtendedClientError } from '@/types/errors';
import { ModelUrlQuery } from '@/types/routes';

export interface EnhancedTableProps {
  className?: string;
  modelName: string;
  attributes: ParsedAttribute[];
  associationView?: 'details' | 'update' | 'new';
  filterID?: string | number;
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
  className,
  modelName,
  attributes,
  requests,
  associationView,
}: EnhancedTableProps): ReactElement {
  // ? To accomodate associations will need to receive the operation as well

  /* STATE */
  const [count, setCount] = useState<number>(0);
  const [rows, setRows] = useState<DataRecord[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    startCursor: null,
    endCursor: null,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  // ? new Set() worth it? or is it unique by nature anyways (as soon as I click again I remove from list anyways)
  const [recordsToAdd, setRecordsToAdd] = useState<(string | number)[]>([]);
  const [recordsToRemove, setRecordsToRemove] = useState<(string | number)[]>(
    []
  );

  const [variables, dispatch] = useReducer(variablesReducer, initialVariables);

  /* HOOKS */
  const classes = useStyles();
  const router = useRouter();
  const { showSnackbar } = useToastNotification();
  const dialog = useDialog();
  const zendro = useZendroClient();
  const { auth } = useAuth();

  const modelPermissions = auth.user?.permissions[modelName];
  const query = router.query as ModelUrlQuery;

  /* HANDLERS */
  const handleSetOrder = (field: string): void => {
    const isAsc =
      field === variables.order?.field && variables.order.order === 'ASC';
    const order = isAsc ? 'DESC' : 'ASC';

    dispatch({ type: 'SET_ORDER', payload: { field, order } });
  };

  const handleOnCreate = (): void => {
    router.push(`/models/${modelName}/new`);
  };

  const handleOnRead = (primaryKey: string | number): void => {
    router.push(`/${query.group}/${modelName}/details?id=${primaryKey}`);
  };

  const handleOnUpdate = (primaryKey: string | number): void => {
    router.push(`/${query.group}/${modelName}/edit?id=${primaryKey}`);
  };

  const handleOnDelete = (primaryKey: string | number): void => {
    dialog.openConfirm({
      title: 'Are you sure you want to delete this item?',
      message: `Item with id ${primaryKey} in model ${modelName}.`,
      okText: 'YES',
      cancelText: 'NO',
      onOk: async () => {
        const idField = attributes[0].name;
        try {
          await zendro.request(requests.delete.query, {
            [idField]: primaryKey,
          });
          mutateRecords();
          mutateCount();
        } catch (error) {
          showSnackbar('Error in request to server', 'error', error);
        }
      },
    });
  };

  const associationHandler: TableRowAssociationHandler = (
    primaryKey,
    list,
    action
  ) => {
    console.log({ primaryKey, list, action });
    switch (action) {
      case 'add':
        if (list === 'toAdd')
          setRecordsToAdd((recordsToAdd) => [...recordsToAdd, primaryKey]);
        else
          setRecordsToRemove((recordsToRemove) => [
            ...recordsToRemove,
            primaryKey,
          ]);
        break;
      case 'remove':
        if (list === 'toAdd')
          setRecordsToAdd(recordsToAdd.filter((item) => item !== primaryKey));
        else
          setRecordsToRemove(
            recordsToRemove.filter((item) => item !== primaryKey)
          );
        break;
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
  const { mutate: mutateRecords, isValidating: isValidatingRecords } = useSWR<
    ReadManyResponse,
    ExtendedClientError<ReadManyResponse>
  >(
    [requests.read.query, variables],
    (query: string, variables: QueryVariables) =>
      zendro.request(query, variables),
    {
      onSuccess: (data) => {
        if (!isNullorEmpty(data)) {
          const connection = unwrapConnection(data, requests.read.resolver);
          setRows(connection.data);
          setPageInfo(connection.pageInfo);
        }
      },
      onError: (error) => {
        const genericError = error.response.error;
        const graphqlErrors = error.response.errors;

        if (graphqlErrors)
          showSnackbar('Error in Graphql response', 'error', graphqlErrors);

        if (genericError)
          showSnackbar('Error in request to server', 'error', genericError);
      },
      shouldRetryOnError: false,
    }
  );

  // Count
  const { mutate: mutateCount } = useSWR<
    Record<string, number>,
    ExtendedClientError<Record<string, number>>
  >(
    [requests.count.query, variables],
    (query: string, variables: QueryVariables) =>
      zendro.request(query, variables),
    {
      onSuccess: (data) => {
        if (!isNullorEmpty(data)) {
          setCount(data[requests.count.resolver]);
        }
      },
      onError: (error) => {
        const genericError = error.response.error;
        const graphqlErrors = error.response.errors;

        if (graphqlErrors)
          showSnackbar('Error in Graphql response', 'error', graphqlErrors);

        if (genericError)
          showSnackbar('Error in request to server', 'error', genericError);
      },
      shouldRetryOnError: false,
    }
  );

  return (
    <TableContainer className={clsx(classes.root, className)}>
      <TableToolbar
        modelName={modelName}
        permissions={auth.user?.permissions[modelName] ?? []}
        onAdd={handleOnCreate}
        onReload={() => mutateRecords()}
        onSearch={handleSetSearch}
      />

      <div className={classes.tableWrapper}>
        <Table stickyHeader size="medium">
          <EnhancedTableHead
            actionsColSpan={
              associationView
                ? 1
                : modelPermissions?.includes('*')
                ? 3
                : modelPermissions?.filter((action) => action !== 'create')
                    .length
            }
            attributes={attributes}
            onSortLabelClick={handleSetOrder}
            activeOrder={variables.order?.field ?? attributes[0].name}
            orderDirection={variables.order?.order ?? 'ASC'}
          />
          <Fade in={!isValidatingRecords && !isEmptyArray(rows)}>
            <TableBody>
              {rows.map((record, index) => {
                const primaryKey = record[attributes[0].name] as
                  | string
                  | number;
                return (
                  // TODO key should use primaryKey value
                  <EnhancedTableRow
                    attributes={attributes}
                    record={record}
                    key={primaryKey}
                    isMarked={
                      associationView
                        ? recordsToAdd
                            .concat(recordsToRemove)
                            .includes(primaryKey)
                        : undefined
                    }
                    isAssociated={
                      associationView
                        ? index % 2 === 0
                          ? true
                          : false
                        : undefined
                    }
                    actions={{
                      read: !associationView ? handleOnRead : undefined,
                      update:
                        (modelPermissions?.includes('update') ||
                          modelPermissions?.includes('*')) &&
                        !associationView
                          ? handleOnUpdate
                          : undefined,
                      delete:
                        (modelPermissions?.includes('delete') ||
                          modelPermissions?.includes('*')) &&
                        !associationView
                          ? handleOnDelete
                          : undefined,
                      associationHandler: associationView
                        ? associationHandler
                        : undefined,
                    }}
                  />
                );
              })}
            </TableBody>
          </Fade>
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
      <div>{`recordsToAdd: ${recordsToAdd.join(',')}`}</div>
      <div>{`recordsToRemove: ${recordsToRemove.join(',')}`}</div>

      <RecordsTablePagination
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
      flexGrow: 1,
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
      position: 'absolute',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },
    pagination: {
      padding: theme.spacing(6, 2),
    },
  })
);
