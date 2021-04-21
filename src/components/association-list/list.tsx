import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  List,
  ListItem,
  TableContainer,
  Typography,
} from '@material-ui/core';
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
import { getInflections } from '@/utils/inflection';

interface AssociationListProps {
  associations: ParsedAssociation[];
  attributes: ParsedAttribute[];
  modelName: string;
  recordId?: string | number;
  primaryKey: string;
  associationView: 'new' | 'update' | 'detail';
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
  primaryKey,
  associationView,
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
  const [selected, setSelected] = useState({
    target: associations[0].target,
    name: associations[0].name,
    type: associations[0].type,
  });

  // const selectedAssociation = useMemo(() => getModel(selected.target), [
  //   selected,
  //   getModel,
  // ]);

  // const queries = useCallback(
  //   () => {
  //     callback
  //   },
  //   [input],
  // )

  // console.log(selectedAssociation);

  console.log('render');

  const {
    variables,
    handleOrder,
    handleSearch,
    handlePagination,
    handlePaginationLimitChange,
  } = useVariables(attributes, assocTable.records, assocTable.pageInfo);

  // if (associationView === 'detail') {
  //   variables.search = {
  //     field: primaryKey,
  //     value: recordId as string,
  //     operator: 'eq',
  //   };
  // }

  const queryAssocRecords = useCallback(
    async (
      query: string,
      transform?: string
    ): Promise<AssocResponse | undefined> => {
      let data: AssocResponse | undefined;
      if (associationView !== 'detail') {
        variables.assocSearch = {
          field: primaryKey,
          value: recordId as string,
          operator: 'eq',
        };
      } else {
        variables[primaryKey] = recordId;
      }
      console.log({ variables });
      try {
        if (transform) {
          data = await zendro.metaRequest<AssocResponse>(query, {
            jq: transform,
            variables,
          });
        } else {
          data = await zendro.request<AssocResponse>(query, variables);
        }
        console.log({ data });
        return data;
      } catch (error) {
        showSnackbar('There was an error', 'error', error);
      }
    },
    [showSnackbar, variables, zendro, primaryKey, recordId]
  );

  const parseAssocRecords = useCallback(
    (
      records: DataRecordWithAssoc[],
      // assocPrimaryKey: string,
      assocResolver: string
    ): TableRecord[] => {
      const parsedRecords = records.reduce((acc, record, index) => {
        // const assocPrimaryKeyValue = record[assocPrimaryKey] as string;
        const recordPrimaryKey = attributes[0].name;
        const recordPrimaryKeyValue =
          record[assocResolver] &&
          (record[assocResolver][recordPrimaryKey] as string);

        // const isMarked = recordsToAdd
        //   .concat(recordsToRemove)
        //   .includes(assocPrimaryKeyValue);

        const isAssociated =
          !isNullorUndefined(recordPrimaryKeyValue) &&
          recordPrimaryKeyValue === recordId;

        // console.log(`${index} - ${recordPrimaryKeyValue} - ${recordId}`);

        const parsedRecord: TableRecord = {
          data: record,
          isMarked: false,
          isAssociated,
        };

        return [...acc, parsedRecord];
      }, [] as TableRecord[]);

      return parsedRecords;
    },
    [attributes, recordId]
  );

  const loadAssocData = useCallback(
    async (assocModelName: string): Promise<void> => {
      const model = getModel(assocModelName);
      const assoc =
        associationView === 'detail'
          ? zendro.queries[modelName].withFilter[assocModelName].readFiltered
          : zendro.queries[modelName].withFilter[assocModelName].readAll;

      console.log({ assoc });
      const response = await queryAssocRecords(assoc.query, assoc.transform);
      // console.log({ response });
      setRecordsToAdd([]);
      setRecordsToRemove([]);
      if (response && recordId) {
        const parsedRecords = parseAssocRecords(
          response.records,
          // model.schema.primaryKey,
          assoc.assocResolver
        );
        // setRawRecords(response.records);
        setAssocTable({
          attributes: model.schema.attributes,
          modelName: assocModelName,
          pageInfo: response.pageInfo,
          primaryKey: model.schema.primaryKey,
          records: parsedRecords,
        });
      }
    },
    [
      getModel,
      modelName,
      queryAssocRecords,
      zendro.queries,
      parseAssocRecords,
      recordId,
      associationView,
    ]
  );

  const loadAssocCount = useCallback(
    async (assocModelName: string): Promise<void> => {
      let data;
      const assoc =
        associationView === 'detail'
          ? zendro.queries[modelName].withFilter[assocModelName].countFiltered
          : zendro.queries[assocModelName].countAll;
      if (!assoc) {
        setCount(1);
        return;
      }
      console.log('countAssoc: ', assoc);
      try {
        if (assoc.transform) {
          data = await zendro.metaRequest(assoc.query, {
            jq: assoc.transform,
            variables,
          });
        } else {
          data = await zendro.request(assoc.query, variables);
        }
        console.log('countData: ', data);
        setCount(data);
      } catch (error) {
        showSnackbar('There was an error', 'error', error);
      }
    },
    [showSnackbar, variables, zendro, associationView, modelName]
  );

  useEffect(
    function loadFirstMountAssociationData() {
      console.log('Fetch records');
      loadAssocData(selected.target);
      loadAssocCount(selected.target);
    },
    [associations, loadAssocData, loadAssocCount, selected.target]
  );

  const handleOnAssociationClick = (
    target: string,
    type: 'to_one' | 'to_many' | 'to_many_through_sql_cross_table',
    name: string
  ) => async (): Promise<void> => {
    if (target !== selected.target) {
      // loadAssocData(target);
      // loadAssocCount(target);
      setSelected({ ...selected, target, name, type });
      setRecordsToAdd([]);
      setRecordsToRemove([]);
    }
  };

  const handleOnAssociationKeyDown = (): void => {
    //
  };

  const handleOnCreate = (): void => {
    //
  };

  const handleOnMarkForAssociationClick: TableRowAssociationHandler = (
    recordToMark,
    list,
    action
  ) => {
    // console.log({ primaryKey, list, action });
    // const currAssoc = assocTable.records.filter(
    //   (record) => record.isAssociated
    // )[0].data[selectedAssociation.schema.primaryKey] as string | number;
    // console.log(currAssoc);
    switch (action) {
      case 'add':
        if (list === 'toAdd') {
          // if (selected.type === 'to_one' && currAssoc) {
          //   setRecordsToAdd([recordToMark]);
          //   setRecordsToRemove((recordsToRemove) => [
          //     ...recordsToRemove,
          //     currAssoc,
          //   ]);
          // } else {
          setRecordsToAdd((recordsToAdd) => [...recordsToAdd, recordToMark]);
          // }
        } else
          setRecordsToRemove((recordsToRemove) => [
            ...recordsToRemove,
            recordToMark,
          ]);
        break;
      case 'remove':
        if (list === 'toAdd')
          setRecordsToAdd(recordsToAdd.filter((item) => item !== recordToMark));
        else
          setRecordsToRemove(
            recordsToRemove.filter((item) => item !== recordToMark)
          );
        break;
    }
  };

  const handleSubmit = async (): Promise<void> => {
    // console.log(zendro.queries[modelName].updateOne.query);
    // console.log(assocTable.modelName);
    const { namePlCp, nameCp } = getInflections(selected.name);
    const mutationName = selected.type === 'to_one' ? nameCp : namePlCp;
    const assocVariables = {
      [primaryKey]: recordId,
      [`add${mutationName}`]:
        selected.type === 'to_one' ? recordsToAdd.toString() : recordsToAdd,
      [`remove${mutationName}`]:
        selected.type === 'to_one'
          ? recordsToRemove.toString()
          : recordsToRemove,
    };
    // console.log(zendro.queries[modelName].updateOne.query);
    // console.log({ assocVariables });
    try {
      const response = await zendro.request<Record<string, DataRecord>>(
        zendro.queries[modelName].updateOne.query,
        assocVariables
      );
      // console.log({ response });
    } catch (error) {
      console.error(error);
    }
    loadAssocData(selected.target);
  };

  return (
    <>
      <TableContainer className={classes.root}>
        {/* <div>{JSON.stringify(assocTable.records)}</div> */}
        <TableToolBar
          modelName={modelName}
          onAdd={handleOnCreate}
          onReload={() => loadAssocData(assocTable.modelName)}
          onSearch={handleSearch}
        />
        <Table
          associationView={associationView}
          attributes={assocTable.attributes}
          records={assocTable.records}
          activeOrder={variables.order?.field ?? assocTable.primaryKey}
          orderDirection={variables.order?.order ?? 'ASC'}
          onSetOrder={handleOrder}
          onAssociate={handleOnMarkForAssociationClick}
          isValidatingRecords={false}
          primaryKey={assocTable.primaryKey}
          recordsToAdd={recordsToAdd}
          recordsToRemove={recordsToRemove}
        />
        <TablePagination
          onPagination={handlePagination}
          count={count}
          options={[5, 10, 15, 20, 25, 50]}
          paginationLimit={
            variables.pagination.first ?? variables.pagination.last
          }
          onPaginationLimitChange={handlePaginationLimitChange}
          hasFirstPage={
            assocTable.pageInfo ? assocTable.pageInfo.hasPreviousPage : false
          }
          hasLastPage={
            assocTable.pageInfo ? assocTable.pageInfo.hasNextPage : false
          }
          hasPreviousPage={
            assocTable.pageInfo ? assocTable.pageInfo.hasPreviousPage : false
          }
          hasNextPage={
            assocTable.pageInfo ? assocTable.pageInfo.hasNextPage : false
          }
        />
      </TableContainer>

      <List className={classes.nav}>
        {associations.map((association) => (
          <ListItem
            key={`${association.name}-assoc-list`}
            className={classes.navItem}
            button
            onClick={handleOnAssociationClick(
              association.target,
              association.type,
              association.name
            )}
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
      <Button onClick={handleSubmit}>Submit</Button>
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
