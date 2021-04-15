import { useEffect, useMemo, useRef, useState } from 'react';
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

  const { query, transform, assocResolver } = zendro.queries[modelName].assoc[
    selected
  ];

  console.log('render');

  // const {
  //   query,
  //   associationAttributes,
  //   assocResolver,
  //   transform,
  // } = useMemo(() => {
  //   const { query, transform, assocResolver, attributes } = zendro.queries[
  //     modelName
  //   ].assoc[selected];
  //   // console.log({ query, assocResolver, attributes });
  //   // console.log(transform);
  //   return {
  //     query,
  //     associationAttributes: attributes,
  //     assocResolver: assocResolver as string,
  //     transform,
  //   };
  // }, [selected, modelName, zendro.queries]);

  const {
    variables,
    handleOrder,
    handleSearch,
    handlePagination,
    handlePaginationLimitChange,
  } = useVariables(attributes, records, pageInfo);

  // console.log({ variables });

  const { data, mutate: mutateRecords } = useSWR(
    [query, variables, transform],
    (query: string, variables: QueryVariables, transform?: string) => {
      if (transform) {
        return zendro.metaRequest<{
          pageInfo: PageInfo;
          records: DataRecordWithAssoc<string>[];
        }>(query, {
          jq: transform,
          variables,
        });
      } else {
        return zendro.request<{
          pageInfo: PageInfo;
          records: DataRecordWithAssoc<string>[];
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

  useEffect(
    function composeAssocTableData() {
      if (data) {
        // console.log({ data });
        const parsedRecords = data.records.reduce((acc, record) => {
          const assocPrimaryKey = assocModel.schema.primaryKey;
          const assocPrimaryKeyValue = record[assocPrimaryKey] as string;

          const recordPrimaryKey = attributes[0].name;
          const recordPrimaryKeyValue = record[assocResolver][
            recordPrimaryKey
          ] as string;

          const isMarked = recordsToAdd
            .concat(recordsToRemove)
            .includes(assocPrimaryKeyValue);

          const isAssociated =
            !isNullorUndefined(recordPrimaryKeyValue) &&
            recordPrimaryKeyValue === recordId;

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
    },
    [
      assocModel,
      // associationAttributes,
      assocResolver,
      attributes,
      data,
      recordId,
      recordsToAdd,
      recordsToRemove,
    ]
  );

  const handleOnAssociationClick = (target: string) => (): void => {
    // setRecords([]);
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
          attributes={assocModel.schema.attributes}
          records={records}
          activeOrder={variables.order?.field ?? assocModel.schema.primaryKey}
          orderDirection={variables.order?.order ?? 'ASC'}
          onSetOrder={handleOrder}
          onAssociate={handleOnMarkForAssociationClick}
          isValidatingRecords={false}
          primaryKey={assocModel.schema.primaryKey}
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
