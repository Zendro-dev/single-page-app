import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { List, ListItem, TableContainer, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useModel, useToastNotification, useZendroClient } from '@/hooks';
import {
  Table,
  TablePagination,
  TableRecord,
  TableRowAssociationHandler,
  TableToolBar,
  useVariables,
} from '@/components/records-table';
import { DataRecord, ParsedAssociation, ParsedAttribute } from '@/types/models';
import { QueryVariables } from '@/types/queries';
import { PageInfo } from '@/types/requests';
import { isNullorUndefined } from '@/utils/validation';

interface AssociationListProps {
  associations: ParsedAssociation[];
  attributes: ParsedAttribute[];
  modelName: string;
  recordId?: string | number;
  primaryKey: string;
}

type DataRecordWithAssoc<T extends string> = DataRecord & Record<T, DataRecord>;

export default function AssociationsList({
  associations,
  attributes,
  modelName,
  recordId,
  primaryKey,
}: AssociationListProps): React.ReactElement {
  const { showSnackbar } = useToastNotification();
  const [selected, setSelected] = useState<string>(associations[0].target);
  const assocModel = useModel(selected);
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
    // console.log({ query, assocResolver, attributes });
    // console.log(transform);
    return {
      query,
      associationAttributes: attributes,
      assocResolver: assocResolver as string,
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

  // console.log({ variables });

  const { data, mutate: mutateRecords } = useSWR(
    [query, variables, selected, transform],
    (
      query: string,
      variables: QueryVariables,
      selected: string,
      transform?: string
    ) => {
      if (transform) {
        return zendro.metaRequest<{
          pageInfo: PageInfo;
          records: DataRecordWithAssoc<typeof assocResolver>[];
        }>(query, {
          jq: transform,
          variables,
        });
      } else {
        return zendro.request<{
          pageInfo: PageInfo;
          records: DataRecordWithAssoc<typeof assocResolver>[];
        }>(query, variables);
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
    if (data) {
      // console.log({ data });
      const parsedRecords = data.records.reduce((acc, record) => {
        const primaryKey = associationAttributes[0].name;
        const primaryKeyValue = record[primaryKey] as string;
        const assocPrimaryKeyValue = assocResolver
          ? (record[assocResolver][attributes[0].name] as string)
          : undefined;

        const isMarked = recordsToAdd
          .concat(recordsToRemove)
          .includes(primaryKeyValue);

        const isAssociated =
          !isNullorUndefined(assocPrimaryKeyValue) &&
          assocPrimaryKeyValue === recordId;

        const parsedRecord: TableRecord = {
          data: record,
          isMarked,
          isAssociated,
        };

        return [...acc, parsedRecord];
      }, [] as TableRecord[]);

      setPageInfo(data.pageInfo);
      setRecords(parsedRecords);
    }
    return () => setRecords([]);
  }, [
    associationAttributes,
    assocResolver,
    attributes,
    data,
    primaryKey,
    recordId,
    recordsToAdd,
    recordsToRemove,
    selected,
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
    // console.log({ primaryKey, list, action });
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
        <Table
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
        <TablePagination
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
