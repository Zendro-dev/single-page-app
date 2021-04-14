import { createStyles, makeStyles } from '@material-ui/core/styles';
import { List, ListItem, TableContainer, Typography } from '@material-ui/core';
import { useToastNotification, useZendroClient } from '@/hooks';
import { ParsedAssociation, ParsedAttribute } from '@/types/models';
import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { PageInfo } from '@/types/requests';
import { TableRecord } from '../records-table/table2';
import { TableRowAssociationHandler } from '../records-table/table-row';
import { QueryVariables } from '@/types/queries';
import {
  EnhancedTable,
  RecordsTablePagination,
  TableToolBar,
  useVariables,
} from '@/components/records-table';

interface AssociationListProps {
  associations: ParsedAssociation[];
  attributes: ParsedAttribute[];
  modelName: string;
  recordId?: string | number;
  primaryKey: string;
}

export default function AssociationsList({
  associations,
  attributes,
  modelName,
  recordId,
  primaryKey,
}: AssociationListProps): React.ReactElement {
  const { showSnackbar } = useToastNotification();
  const [selected, setSelected] = useState<string>(associations[0].target);
  const classes = useStyles();
  const zendro = useZendroClient();

  const [count, setCount] = useState<number>(0);
  const [records, setRecords] = useState<TableRecord[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    startCursor: null,
    endCursor: null,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  const [recordsToAdd, setRecordsToAdd] = useState<(string | number)[]>([]);
  const [recordsToRemove, setRecordsToRemove] = useState<(string | number)[]>(
    []
  );

  const {
    query,
    associationAttributes,
    assocResolver,
    transform,
  } = useMemo(() => {
    const { query, transform, assocResolver, attributes } = zendro.queries[
      modelName
    ].assoc[selected];
    console.log({ query, assocResolver, attributes });
    console.log(transform);
    return {
      query,
      associationAttributes: attributes,
      assocResolver,
      transform,
    };
  }, [selected, modelName, zendro.queries]);

  const {
    variables,
    handleOrder,
    handleSearch,
    handlePagination,
    handlePaginationLimitChange,
  } = useVariables(attributes, records, pageInfo);

  console.log({ variables });

  const { data, mutate: mutateRecords } = useSWR(
    transform ? [query, variables, selected] : null,
    (query: string, variables: QueryVariables) => {
      if (transform) {
        return zendro.metaRequest<any>(query, {
          jq: transform,
          variables,
        });
      } else {
        return zendro.request(query, variables);
      }
    },
    {
      onError: (error) => {
        showSnackbar('There was an error', 'error', error);
      },
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  // const { data: count } = useSWR(
  //   [query, variables, selected],
  //   (query: string, variables: QueryVariables) =>
  //     zendro.request(query, {
  //       variables,
  //     }),
  //   {
  //     onError: (error) => {
  //       showSnackbar('There was an error', 'error', error);
  //     },
  //     shouldRetryOnError: false,
  //     revalidateOnFocus: false,
  //   }
  // );

  useEffect(() => {
    // setRecords([]);
    if (data) {
      console.log(data);
      const parsedRecords = data.records.reduce((acc: any, curr: any) => {
        const o = { data: curr, isMarked: false, isAssociated: false };
        // o.isMarked = false;
        o.isMarked = recordsToAdd
          .concat(recordsToRemove)
          .includes(curr[associationAttributes[0].name]);

        o.isAssociated =
          assocResolver &&
          curr[assocResolver] &&
          curr[assocResolver][primaryKey] === recordId;
        acc.push(o);
        return acc;
      }, []) as TableRecord[];

      setPageInfo(data.pageInfo);
      setRecords(parsedRecords);
    }
    return () => setRecords([]);
  }, [
    selected,
    data,
    assocResolver,
    primaryKey,
    recordId,
    recordsToAdd,
    recordsToRemove,
    associationAttributes,
  ]);

  const handleOnAssociationClick = (target: string) => (): void => {
    setSelected(target);
  };

  const handleOnAssociationKeyDown = (): void => {
    //
  };

  const handleOnCreate = (): void => {
    //
  };

  const handleOnMarkForAssociationClick: TableRowAssociationHandler = (
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

  return (
    <>
      <TableContainer className={classes.root}>
        <TableToolBar
          modelName={modelName}
          onAdd={handleOnCreate}
          onReload={() => mutateRecords()}
          onSearch={handleSearch}
        />
        <EnhancedTable
          associationView="details"
          attributes={associationAttributes}
          records={records}
          activeOrder={variables.order?.field ?? associationAttributes[0].name}
          orderDirection={variables.order?.order ?? 'ASC'}
          onSetOrder={handleOrder}
          onAssociate={handleOnMarkForAssociationClick}
          isValidatingRecords={false}
          primaryKey={associationAttributes[0].name}
        />
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
      <List className={classes.nav}>
        {associations.map((association) => (
          <ListItem
            key={`${association.name}-assoc-list`}
            className={classes.navItem}
            button
            onClick={handleOnAssociationClick(association.target)}
            onKeyDown={handleOnAssociationKeyDown}
          >
            <Typography component="p" fontSize={15} fontWeight="bold">
              {association.name.toUpperCase()}
            </Typography>
            <Typography component="p" variant="subtitle1" color="GrayText">
              {association.type}
            </Typography>
          </ListItem>
        ))}
      </List>
    </>
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
    table: {
      padding: theme.spacing(2, 4),
    },
    nav: {
      // display: 'none',
      display: 'block',
      padding: 0,
      borderLeft: '1px solid',
      borderLeftColor: theme.palette.grey[300],
      // [theme.breakpoints.up('md')]: {
      // },
    },
    navItem: {
      position: 'relative',
      display: 'block',
      padding: theme.spacing(4, 8),
      '&:not(:first-child)': {
        borderTop: '1px solid',
        borderTopColor: theme.palette.grey[300],
      },
    },
  })
);
