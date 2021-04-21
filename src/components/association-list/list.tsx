import { useCallback, useEffect, useState } from 'react';

import { TableContainer } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  FilterAltOutlined as FilterIcon,
  Link as LinkIcon,
  LinkOff as LinkOffIcon,
  Repeat as ToManyIcon,
  RepeatOne as ToOneIcon,
  Replay as ReloadIcon,
  Save as SaveIcon,
} from '@material-ui/icons';

import { IconButton } from '@/components/buttons';
import { StyledSelect } from '@/components/fields';
import { useModel, useToastNotification, useZendroClient } from '@/hooks';
import { DataRecord, ParsedAssociation, ParsedAttribute } from '@/types/models';
import { PageInfo } from '@/types/requests';
import { isNullorUndefined } from '@/utils/validation';
import {
  Table,
  TablePagination,
  TableRecord,
  TableRowAssociationHandler,
  TableSearch,
  useVariables,
} from '@/zendro/model-table';
import { getInflections } from '@/utils/inflection';

interface AssociationListProps {
  associations: ParsedAssociation[];
  attributes: ParsedAttribute[];
  modelName: string;
  recordId?: string | number;
  primaryKey: string;
  associationView: 'new' | 'update' | 'details';
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
    assocName: string;
    attributes: ParsedAttribute[];
    modelName: string;
    pageInfo: PageInfo;
    primaryKey: string;
    records: TableRecord[];
  }>(() => {
    const model = getModel(associations[0].target);
    return {
      assocName: associations[0].name,
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
      if (associationView !== 'details') {
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
    [showSnackbar, variables, zendro, primaryKey, recordId, associationView]
  );

  const parseAssocRecords = useCallback(
    (records: DataRecordWithAssoc[], assocResolver: string): TableRecord[] => {
      const parsedRecords = records.reduce((acc, record) => {
        const recordPrimaryKey = attributes[0].name;
        const recordPrimaryKeyValue =
          record[assocResolver] &&
          (record[assocResolver][recordPrimaryKey] as string);

        const isAssociated =
          !isNullorUndefined(recordPrimaryKeyValue) &&
          recordPrimaryKeyValue === recordId;

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
    async (assocName: string, assocTarget: string): Promise<void> => {
      const model = getModel(assocTarget);
      const assoc =
        associationView === 'details'
          ? zendro.queries[modelName].withFilter[assocTarget].readFiltered
          : zendro.queries[modelName].withFilter[assocTarget].readAll;

      console.log({ assoc });
      const response = await queryAssocRecords(assoc.query, assoc.transform);
      setRecordsToAdd([]);
      setRecordsToRemove([]);
      if (response && recordId) {
        const parsedRecords = parseAssocRecords(
          response.records,
          assoc.assocResolver
        );
        setAssocTable({
          assocName: assocName,
          attributes: model.schema.attributes,
          modelName: assocTarget,
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
        associationView === 'details'
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
      loadAssocData(selected.name, selected.target);
      loadAssocCount(selected.target);
    },
    [associations, loadAssocData, loadAssocCount, selected]
  );

  const handleOnAssociationSelect = (target: string, name: string): void => {
    const assoc = associations.find(
      (association) => association.target === target
    ) as ParsedAssociation;
    if (target !== selected.target) {
      setSelected({ target, name, type: assoc.type });
      setRecordsToAdd([]);
      setRecordsToRemove([]);
    }
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
    try {
      await zendro.request<Record<string, DataRecord>>(
        zendro.queries[modelName].updateOne.query,
        assocVariables
      );
    } catch (error) {
      console.error(error);
    }
    loadAssocData(selected.name, selected.target);
  };

  return (
    <div className={classes.root}>
      <div className={classes.toolbar}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TableSearch
            placeholder={`Search ${assocTable.assocName}`}
            onSearchClick={handleSearch}
          />
          {associationView !== 'details' && (
            <StyledSelect
              className={classes.toolbarFilters}
              id={`${modelName}-association-filters`}
              label={`Select ${assocTable.assocName} filters`}
              items={[
                {
                  id: 'select-filter',
                  text: 'No Filters',
                  icon: FilterIcon,
                },
                {
                  id: 'associated',
                  text: 'Associated',
                  icon: LinkIcon,
                },
                {
                  id: 'not-associated',
                  text: 'Not Associated',
                  icon: LinkOffIcon,
                },
                {
                  id: 'marked-for-association',
                  text: 'Marked For Association',
                  icon: LinkIcon,
                },
                {
                  id: 'marked-for-disassociation',
                  text: 'Marked for Disassociation',
                  icon: LinkOffIcon,
                },
              ]}
            />
          )}
        </div>

        <div className={classes.toolbarActions}>
          <IconButton
            tooltip={`Reload ${modelName} data`}
            onClick={() =>
              loadAssocData(assocTable.assocName, assocTable.modelName)
            }
          >
            <ReloadIcon />
          </IconButton>
          {associationView !== 'details' && (
            <IconButton
              tooltip={`Save ${assocTable.modelName} data`}
              onClick={handleSubmit}
            >
              <SaveIcon />
            </IconButton>
          )}

          <StyledSelect
            className={classes.toolbarAssocSelect}
            id={`${modelName}-association-select`}
            label={`Select ${modelName} association`}
            items={associations.map(({ name, target, type }) => ({
              id: target,
              text: name,
              icon: type === 'to_many' ? ToManyIcon : ToOneIcon,
            }))}
            onChange={handleOnAssociationSelect}
          />
        </div>
      </div>

      <TableContainer className={classes.table}>
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
    </div>
  );
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
    table: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      flexGrow: 1,
      overflow: 'auto',
      padding: theme.spacing(2, 0),
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: theme.spacing(8),
    },
    toolbarFilters: {
      marginLeft: theme.spacing(4),
    },
    toolbarActions: {
      display: 'flex',
      alignItems: 'center',
      '& button:hover, label:hover': {
        color: theme.palette.primary.main,
      },
    },
    toolbarAssocSelect: {
      marginLeft: theme.spacing(4),
    },
  })
);
