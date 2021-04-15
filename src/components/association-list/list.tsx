import { useCallback, useEffect, useState } from 'react';
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
import { PageInfo } from '@/types/requests';
import { isNullorUndefined } from '@/utils/validation';

interface AssociationListProps {
  associations: ParsedAssociation[];
  attributes: ParsedAttribute[];
  modelName: string;
  recordId?: string | number;
  primaryKey: string;
}

interface AssocResponse {
  pageInfo: PageInfo;
  records: DataRecordWithAssoc[];
}

type DataRecordWithAssoc = DataRecord & Record<string, DataRecord>;

export default function AssociationsList({
  associations,
  attributes,
  modelName,
  recordId,
}: AssociationListProps): React.ReactElement {
  const { showSnackbar } = useToastNotification();
  const getModel = useModel();
  const classes = useStyles();
  const zendro = useZendroClient();

  const [assocTable, setAssocTable] = useState<{
    attributes: ParsedAttribute[];
    modelName: string;
    pageInfo: PageInfo;
    primaryKey: string;
    records: TableRecord[];
  }>(() => {
    const model = getModel(associations[0].target);
    return {
      attributes: model.schema.attributes,
      modelName: model.schema.model,
      pageInfo: {
        startCursor: null,
        endCursor: null,
        hasPreviousPage: false,
        hasNextPage: false,
      },
      primaryKey: model.schema.primaryKey,
      records: [],
    };
  });
  const [count, setCount] = useState<number>(0);

  const [recordsToAdd, setRecordsToAdd] = useState<(string | number)[]>([]);
  const [recordsToRemove, setRecordsToRemove] = useState<(string | number)[]>(
    []
  );

  console.log('render');

  const {
    variables,
    handleOrder,
    handleSearch,
    handlePagination,
    handlePaginationLimitChange,
  } = useVariables(attributes, assocTable.records, assocTable.pageInfo);

  const queryAssocRecords = useCallback(
    async (
      query: string,
      transform?: string
    ): Promise<AssocResponse | undefined> => {
      let data: AssocResponse | undefined;

      try {
        if (transform) {
          data = await zendro.metaRequest<AssocResponse>(query, {
            jq: transform,
            variables,
          });
        } else {
          data = await zendro.request<AssocResponse>(query, variables);
        }

        return data;
      } catch (error) {
        showSnackbar('There was an error', 'error', error);
      }
    },
    [showSnackbar, variables, zendro]
  );

  const parseAssocRecords = useCallback(
    async (
      records: DataRecordWithAssoc[],
      assocPrimaryKey: string,
      assocResolver: string
    ): Promise<TableRecord[]> => {
      const parsedRecords = records.reduce((acc, record) => {
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

      return parsedRecords;
    },
    [attributes, recordId, recordsToAdd, recordsToRemove]
  );

  const loadAssocData = useCallback(
    async (assocModelName: string): Promise<void> => {
      const model = getModel(assocModelName);
      const assoc = zendro.queries[modelName].assoc[assocModelName];
      const response = await queryAssocRecords(assoc.query, assoc.transform);

      if (response) {
        const parsedRecords = await parseAssocRecords(
          response.records,
          model.schema.primaryKey,
          assoc.assocResolver
        );
        setAssocTable({
          attributes: model.schema.attributes,
          modelName: assocModelName,
          pageInfo: response.pageInfo,
          primaryKey: model.schema.primaryKey,
          records: parsedRecords,
        });
      }
    },
    [getModel, modelName, parseAssocRecords, queryAssocRecords, zendro.queries]
  );

  useEffect(
    function loadFirstMountAssociationData() {
      loadAssocData(associations[0].target);
    },
    [associations, loadAssocData]
  );

  const handleOnAssociationClick = (
    target: string
  ) => async (): Promise<void> => {
    if (target !== assocTable.modelName) loadAssocData(target);
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
          onReload={() => loadAssocData(assocTable.modelName)}
          onSearch={handleSearch}
        />
        <Table
          associationView="details"
          attributes={assocTable.attributes}
          records={assocTable.records}
          activeOrder={variables.order?.field ?? assocTable.primaryKey}
          orderDirection={variables.order?.order ?? 'ASC'}
          onSetOrder={handleOrder}
          onAssociate={handleOnMarkForAssociationClick}
          isValidatingRecords={false}
          primaryKey={assocTable.primaryKey}
        />
        <TablePagination
          onPagination={handlePagination}
          count={count}
          options={[5, 10, 15, 20, 25, 50]}
          paginationLimit={
            variables.pagination.first ?? variables.pagination.last
          }
          onPaginationLimitChange={handlePaginationLimitChange}
          hasFirstPage={assocTable.pageInfo.hasPreviousPage}
          hasLastPage={assocTable.pageInfo.hasNextPage}
          hasPreviousPage={assocTable.pageInfo.hasPreviousPage}
          hasNextPage={assocTable.pageInfo.hasNextPage}
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
