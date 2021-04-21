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
    async (assocName: string, assocTarget: string): Promise<void> => {
      const model = getModel(assocTarget);
      const assoc = zendro.queries[modelName].assoc[assocTarget];
      const response = await queryAssocRecords(assoc.query, assoc.transform);

      if (response) {
        const parsedRecords = await parseAssocRecords(
          response.records,
          model.schema.primaryKey,
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
    [getModel, modelName, parseAssocRecords, queryAssocRecords, zendro.queries]
  );

  useEffect(
    function loadFirstMountAssociationData() {
      const { name, target } = associations[0];
      loadAssocData(name, target);
    },
    [associations, loadAssocData]
  );

  const handleOnAssociationSelect = (target: string, name: string): void => {
    if (target !== assocTable.modelName) loadAssocData(name, target);
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
    <div className={classes.root}>
      <div className={classes.toolbar}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TableSearch
            placeholder={`Search ${assocTable.assocName}`}
            onSearchClick={handleSearch}
          />

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

          <IconButton
            tooltip={`Save ${assocTable.modelName} data`}
            onClick={() => {
              console.log(assocTable.modelName);
            }}
          >
            <SaveIcon />
          </IconButton>

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
      marginTop: theme.spacing(2),
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
