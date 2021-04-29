import { useCallback, useEffect, useMemo, useState } from 'react';

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
import {
  Table,
  TablePagination,
  TableRowAssociationHandler,
  TableSearch,
  useTablePagination,
  UseTablePaginationProps,
  useTableSearch,
  useTableOrder,
} from '@/zendro/model-table';
import { AssociationFilter } from '@/zendro/model-table/hooks/useSearch';
import { getInflections } from '@/utils/inflection';
import { UseOrderProps } from '@/zendro/model-table/hooks/useOrder';
import useRecords from '@/zendro/model-table/hooks/useRecords';
import { QueryModelTableRecordsVariables } from '@/types/queries';

interface AssociationListProps {
  associations: ParsedAssociation[];
  attributes: ParsedAttribute[];
  modelName: string;
  recordId: string | number;
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

  // Selected association
  const [selectedAssoc, setSelectedAssoc] = useState({
    target: associations[0].target,
    name: associations[0].name,
    type: associations[0].type,
  });

  const assocTable = useMemo(() => {
    return getModel(selectedAssoc.target).schema;
  }, [selectedAssoc, getModel]);

  // Showing records
  const [records, setRecords] = useState<{
    data: DataRecordWithAssoc[];
    pageInfo?: PageInfo;
  }>({
    data: [],
    pageInfo: {
      startCursor: null,
      endCursor: null,
      hasPreviousPage: false,
      hasNextPage: false,
    },
  });

  const [recordsTotal, setRecordsTotal] = useState<number>(0);

  const [recordsFilter, setRecordsFilter] = useState<AssociationFilter>(
    'no-filter'
  );
  const [recordsToAdd, setRecordsToAdd] = useState<(string | number)[]>([]);
  const [recordsToRemove, setRecordsToRemove] = useState<(string | number)[]>(
    []
  );

  /* VARIABLES */

  const [searchText, setSearchText] = useState('');
  const tableSearch = useTableSearch({
    associationFilter: recordsFilter,
    attributes: assocTable.attributes,
    primaryKey: assocTable.primaryKey,
    recordsToAdd,
    recordsToRemove,
    searchText,
  });

  const [order, setOrder] = useState<UseOrderProps>();
  const tableOrder = useTableOrder({
    sortDirection: order?.sortDirection,
    sortField: order?.sortField,
  });

  const [pagination, setPagination] = useState<UseTablePaginationProps>({
    limit: 5,
    position: 'first',
    cursor: null,
  });
  const tablePagination = useTablePagination(pagination);

  /* QUERIES */

  const recordsQuery = useMemo(() => {
    if (associationView === 'details' || recordsFilter === 'associated')
      return zendro.queries[modelName].withFilter[selectedAssoc.target]
        .readFiltered;
    else
      return zendro.queries[modelName].withFilter[selectedAssoc.target].readAll;
  }, [
    selectedAssoc.target,
    associationView,
    modelName,
    zendro.queries,
    recordsFilter,
  ]);

  const parsedRecords = useRecords({
    assocName: recordsQuery.assocResolver,
    assocPrimaryKey: primaryKey,
    assocPrimaryKeyValue: recordId as string,
    records: records.data,
  });

  // const countQuery = useMemo(() => {
  //   if (associationView === 'details' || associationFilter === 'associated')
  //     return zendro.queries[modelName].withFilter[selected.target]
  //       .countFiltered;
  //   else return zendro.queries[selected.target].countAll;
  // }, [selected, associationView, modelName, zendro.queries, associationFilter]);

  const queryAssocRecords = useCallback(
    async (query: string, transform?: string): Promise<void> => {
      let data: AssocResponse;

      console.log('queryAssocRecords RUNS ========== ');
      console.log({ tablePagination });

      const variables: QueryModelTableRecordsVariables = {
        search: tableSearch,
        order: tableOrder,
        pagination: tablePagination,
        assocPagination: { first: 1 },
        [primaryKey]: recordId,
      };

      try {
        if (transform) {
          data = await zendro.metaRequest<AssocResponse>(query, {
            jq: transform,
            variables,
          });
        } else {
          data = await zendro.request<AssocResponse>(query, variables);
        }
        console.log({ dataRecords: data.records });

        setRecords({
          data: data.records,
          pageInfo: data.pageInfo,
        });
      } catch (error) {
        showSnackbar('There was an error', 'error', error);
      }
    },
    [
      primaryKey,
      recordId,
      setRecords,
      showSnackbar,
      tableOrder,
      tablePagination,
      tableSearch,
      zendro,
    ]
  );

  useEffect(() => {
    queryAssocRecords(recordsQuery.query, recordsQuery.transform);
  }, [queryAssocRecords, recordsQuery]);

  const handleOnAsociationSelect = (target: string, name: string): void => {
    const assoc = associations.find(
      (association) => association.target === target
    ) as ParsedAssociation;
    if (target !== selectedAssoc.target) {
      setSelectedAssoc({ target, name, type: assoc.type });
      // setAssociationFilter('no-filter');
      // setSearchText('');
      // setRecordsToAdd([]);
      // setRecordsToRemove([]);
    }
  };

  const handleOnMarkForAssociationClick: TableRowAssociationHandler = (
    recordToMark,
    list,
    action
  ) => {
    const currAssocRecord = records.data.find((record) => record.isAssociated);
    const currAssocRecordId = currAssocRecord
      ? (currAssocRecord.data[assocTable.primaryKey] as string | number)
      : undefined;
    switch (action) {
      case 'add':
        if (list === 'toAdd') {
          if (selectedAssoc.type === 'to_one') {
            setRecordsToAdd([recordToMark]);
            if (currAssocRecordId)
              setRecordsToRemove((recordsToRemove) => [
                ...recordsToRemove,
                currAssocRecordId,
              ]);
          } else {
            setRecordsToAdd((recordsToAdd) => [...recordsToAdd, recordToMark]);
          }
        } else
          setRecordsToRemove((recordsToRemove) => [
            ...recordsToRemove,
            recordToMark,
          ]);
        break;
      case 'remove':
        if (list === 'toAdd') {
          setRecordsToAdd(recordsToAdd.filter((item) => item !== recordToMark));
          if (selectedAssoc.type === 'to_one') {
            setRecordsToRemove(
              recordsToRemove.filter((item) => item !== currAssocRecordId)
            );
          }
        } else
          setRecordsToRemove(
            recordsToRemove.filter((item) => item !== recordToMark)
          );
        break;
    }
  };

  const handleSubmit = async (): Promise<void> => {
    const { namePlCp, nameCp } = getInflections(selectedAssoc.name);
    const mutationName = selectedAssoc.type === 'to_one' ? nameCp : namePlCp;
    const assocVariables = {
      [primaryKey]: recordId,
      [`add${mutationName}`]:
        recordsToAdd.length > 0
          ? selectedAssoc.type === 'to_one'
            ? recordsToAdd.toString()
            : recordsToAdd
          : undefined,
      [`remove${mutationName}`]:
        recordsToRemove.length > 0
          ? selectedAssoc.type === 'to_one'
            ? recordsToRemove.toString()
            : recordsToRemove
          : undefined,
    };
    try {
      const response = await zendro.request<Record<string, DataRecord>>(
        zendro.queries[modelName].updateOne.query,
        assocVariables
      );
      showSnackbar('Associations updated successfully', 'success');
    } catch (error) {
      console.error(error);
    }
    // variablesDispatch({ type: 'RESET' });
    setRecordsToAdd([]);
    setRecordsToRemove([]);
    // loadAssocData2();
    // loadAssocCount2();
  };

  const handleOnAssociationFilterSelect = (filter: string): void => {
    setRecordsFilter(filter as AssociationFilter);
  };

  return (
    <div className={classes.root}>
      <div className={classes.toolbar}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TableSearch
            placeholder={`Search ${selectedAssoc.name}`}
            value={searchText}
            onSearch={(value) => setSearchText(value)}
            // onChange={(event) => setSearchText(event.target.value)}
            onReset={() => setSearchText('')}
          />
          {associationView !== 'details' && (
            <StyledSelect
              className={classes.toolbarFilters}
              id={`${modelName}-association-filters`}
              label={`Select ${selectedAssoc.name} filters`}
              onChange={handleOnAssociationFilterSelect}
              selected={recordsFilter}
              items={[
                {
                  id: 'no-filter',
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
                  id: 'records-to-add',
                  text: 'Marked For Association',
                  icon: LinkIcon,
                },
                {
                  id: 'records-to-remove',
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
            onClick={() => {
              // loadAssocData2();
              // loadAssocCount2();
            }}
          >
            <ReloadIcon />
          </IconButton>
          {associationView !== 'details' && (
            <IconButton
              tooltip={`Save ${selectedAssoc.target} data`}
              onClick={handleSubmit}
              disabled={
                recordsToAdd.length === 0 && recordsToRemove.length === 0
              }
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
            onChange={handleOnAsociationSelect}
            selected={selectedAssoc.target}
          />
        </div>
      </div>

      <TableContainer className={classes.table}>
        <Table
          associationView={associationView}
          attributes={assocTable.attributes}
          records={parsedRecords}
          activeOrder={order?.sortField ?? assocTable.primaryKey}
          orderDirection={order?.sortDirection ?? 'ASC'}
          onSetOrder={(field) =>
            setOrder((state) => ({
              ...state,
              sortField: field,
              sortDirection: !state?.sortDirection
                ? 'ASC'
                : state.sortDirection === 'ASC'
                ? 'DESC'
                : 'ASC',
            }))
          }
          onAssociate={handleOnMarkForAssociationClick}
          isValidatingRecords={false}
          primaryKey={assocTable.primaryKey}
          recordsToAdd={recordsToAdd}
          recordsToRemove={recordsToRemove}
        />
        <TablePagination
          count={recordsTotal}
          options={[2, 5, 15, 20, 25, 50]}
          paginationLimit={tablePagination.first ?? tablePagination.last}
          hasFirstPage={records.pageInfo?.hasPreviousPage}
          hasLastPage={records.pageInfo?.hasNextPage}
          hasPreviousPage={records.pageInfo?.hasPreviousPage}
          hasNextPage={records.pageInfo?.hasNextPage}
          startCursor={records.pageInfo?.startCursor ?? null}
          endCursor={records.pageInfo?.endCursor ?? null}
          onPageChange={(position, cursor) => {
            setPagination((state) => ({ ...state, position, cursor }));
          }}
          onPageSizeChange={(limit) => {
            setPagination((state) => ({ ...state, limit }));
          }}
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
