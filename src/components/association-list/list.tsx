import { useMemo, useState } from 'react';
import useSWR from 'swr';

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
import {
  DataRecord,
  ParsedAssociation,
  ParsedAttribute,
  ParsedDataModel2,
} from '@/types/models';
import { PageInfo } from '@/types/requests';
import {
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TablePagination,
  TableRow,
  TableRowAssociationHandler,
  TableSearch,
  useTablePagination,
  UseTablePaginationProps,
  useTableSearch,
  useTableOrder,
  TableRecord,
} from '@/zendro/model-table';
import { AssociationFilter } from '@/zendro/model-table/hooks/useSearch';
import { getInflections } from '@/utils/inflection';
import { UseOrderProps } from '@/zendro/model-table/hooks/useOrder';
import useRecords from '@/zendro/model-table/hooks/useRecords';
import { QueryModelTableRecordsVariables } from '@/types/queries';
import { ParsedPermissions } from '@/types/acl';

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

interface AssocTable {
  data: TableRecord[];
  pageInfo?: PageInfo;
  permissions: ParsedPermissions;
  schema: ParsedDataModel2;
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

  // const assocTable = useMemo(() => {
  //   return getModel(selectedAssoc.target);
  // }, [selectedAssoc, getModel]);

  // // Showing records
  // const [records, setRecords] = useState<{
  //   data: DataRecordWithAssoc[];
  //   pageInfo?: PageInfo;
  // }>({
  //   data: [],
  //   pageInfo: {
  //     startCursor: null,
  //     endCursor: null,
  //     hasPreviousPage: false,
  //     hasNextPage: false,
  //   },
  // });

  const [assocTable, setAssocTable] = useState<AssocTable>(() => {
    const model = getModel(selectedAssoc.target);
    return {
      data: [],
      pageInfo: {
        startCursor: null,
        endCursor: null,
        hasPreviousPage: false,
        hasNextPage: false,
      },
      ...model,
    };
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
    attributes: assocTable.schema.attributes,
    primaryKey: assocTable.schema.primaryKey,
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

  const countQuery = useMemo(() => {
    if (associationView === 'details' || recordsFilter === 'associated')
      return zendro.queries[modelName].withFilter[selectedAssoc.target]
        .countFiltered;
    else return zendro.queries[selectedAssoc.target].countAll;
  }, [
    selectedAssoc.target,
    associationView,
    modelName,
    zendro.queries,
    recordsFilter,
  ]);

  // const parsedRecords = useRecords({
  //   assocName:
  //     recordsFilter === 'associated' ? undefined : recordsQuery.assocResolver,
  //   assocPrimaryKey: primaryKey,
  //   assocPrimaryKeyValue: recordId as string,
  //   records: records.data,
  // });

  /* FETCH RECORDS */
  const { mutate: mutateRecords } = useSWR(
    [recordsQuery, tableSearch, tableOrder, tablePagination],
    async (): Promise<AssocResponse | undefined> => {
      let data: AssocResponse;

      console.log(' ========== fetchTableRecords RUNS ========== ');
      console.log({ tableSearch });

      const variables: QueryModelTableRecordsVariables = {
        search: tableSearch,
        order: tableOrder,
        pagination: tablePagination,
        assocPagination: { first: 1 },
        [primaryKey]: recordId,
      };

      try {
        if (recordsQuery.transform) {
          data = await zendro.metaRequest<AssocResponse>(recordsQuery.query, {
            jq: recordsQuery.transform,
            variables,
          });
        } else {
          data = await zendro.request<AssocResponse>(
            recordsQuery.query,
            variables
          );
        }
        return data;
        // console.log({ dataRecords: data.records });
      } catch (error) {
        showSnackbar('There was an error', 'error', error);
      }
    },
    {
      onSuccess: (data) => {
        if (data) {
          const assocName =
            recordsFilter === 'associated'
              ? undefined
              : recordsQuery.assocResolver;
          const assocPrimaryKey = primaryKey;
          const assocPrimaryKeyValue = recordId as string;

          const parsedRecords = data.records.reduce<TableRecord[]>(
            (acc, record) => {
              const isAssociated =
                assocName && assocPrimaryKey && assocPrimaryKeyValue
                  ? record[assocName]?.[assocPrimaryKey] ===
                    assocPrimaryKeyValue
                  : true;

              const parsedRecord: TableRecord = {
                data: record,
                isAssociated,
              };

              return [...acc, parsedRecord];
            },
            [] as TableRecord[]
          );

          const model = getModel(selectedAssoc.target);

          setAssocTable((state) => ({
            data: parsedRecords,
            pageInfo: data.pageInfo,
            name: selectedAssoc.name,
            ...model,
          }));
        }
        // setRecords({
        //   data: data.records,
        //   pageInfo: data.pageInfo,
        // });
      },
    }
  );

  /* FETCH COUNT */
  const { mutate: mutateCount } = useSWR(
    [countQuery, tableSearch],
    async (): Promise<Record<'count', number> | undefined> => {
      let data: Record<'count', number>;

      const variables: QueryModelTableRecordsVariables = {
        search: tableSearch,
        [primaryKey]: recordId,
      };

      // console.log({ countQuery });
      // console.log({ variables });

      if (!countQuery) {
        return { count: 1 };
      }
      try {
        if (countQuery.transform) {
          data = await zendro.metaRequest(countQuery.query, {
            jq: countQuery.transform,
            variables,
          });
          // console.log({ data });
        } else {
          data = await zendro.request(countQuery.query, variables);
        }
        return data;
        // setRecordsTotal(data.count);
      } catch (error) {
        showSnackbar('There was an error', 'error', error);
      }
    },
    {
      onSuccess: (data) => {
        if (data) {
          setRecordsTotal(data.count);
        }
      },
    }
  );

  const handleOnAsociationSelect = (target: string, name: string): void => {
    const assoc = associations.find(
      (association) => association.target === target
    ) as ParsedAssociation;
    if (target !== selectedAssoc.target) {
      setOrder(undefined);
      setRecordsToAdd([]);
      setRecordsToRemove([]);
      setSelectedAssoc({ target, name, type: assoc.type });
      // setAssociationFilter('no-filter');
    }
  };

  const handleOnMarkForAssociationClick: TableRowAssociationHandler = (
    recordToMark,
    list,
    action
  ) => {
    // const currAssocRecord = parsedRecords.find((record) => record.isAssociated);
    const currAssocRecord = assocTable.data.find(
      (record) => record.isAssociated
    );
    const currAssocRecordId = currAssocRecord
      ? (currAssocRecord.data[assocTable.schema.primaryKey] as string | number)
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
      await zendro.request<Record<string, DataRecord>>(
        zendro.queries[modelName].updateOne.query,
        assocVariables
      );
      showSnackbar('Associations updated successfully', 'success');
    } catch (error) {
      console.error(error);
    }
    setRecordsToAdd([]);
    setRecordsToRemove([]);
    mutateRecords();
    mutateCount();
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
              mutateRecords();
              mutateCount();
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
        // associationView={associationView}
        // attributes={assocTable.attributes}
        // records={parsedRecords}
        // activeOrder={order?.sortField ?? assocTable.primaryKey}
        // orderDirection={order?.sortDirection ?? 'ASC'}
        // onSetOrder={(field) =>
        //   setOrder((state) => ({
        //     ...state,
        //     sortField: field,
        //     sortDirection: !state?.sortDirection
        //       ? 'ASC'
        //       : state.sortDirection === 'ASC'
        //       ? 'DESC'
        //       : 'ASC',
        //   }))
        // }
        // onAssociate={handleOnMarkForAssociationClick}
        // isValidatingRecords={false}
        // primaryKey={assocTable.primaryKey}
        // recordsToAdd={recordsToAdd}
        // recordsToRemove={recordsToRemove}
        >
          <TableHeader
            actionsColSpan={1}
            attributes={assocTable.schema.attributes}
            onSortLabelClick={(field) =>
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
            activeOrder={order?.sortField ?? assocTable.schema.primaryKey}
            orderDirection={order?.sortDirection ?? 'ASC'}
          />

          <TableBody>
            {/* {parsedRecords.map((record) => { */}
            {assocTable.data.map((record) => {
              const recordPK = assocTable.schema.primaryKey;
              const recordId = record.data[recordPK] as string | number;
              return (
                <TableRow
                  attributes={assocTable.schema.attributes}
                  record={record.data}
                  key={recordId}
                  isMarked={
                    recordsToAdd &&
                    recordsToRemove &&
                    recordsToAdd.concat(recordsToRemove).includes(recordId)
                  }
                  isAssociated={record.isAssociated}
                  actions={{
                    associationHandler: handleOnMarkForAssociationClick,
                  }}
                />
              );
            })}
          </TableBody>
        </Table>

        <TablePagination
          count={recordsTotal}
          options={[2, 5, 15, 20, 25, 50]}
          paginationLimit={tablePagination.first ?? tablePagination.last}
          hasFirstPage={assocTable.pageInfo?.hasPreviousPage}
          hasLastPage={assocTable.pageInfo?.hasNextPage}
          hasPreviousPage={assocTable.pageInfo?.hasPreviousPage}
          hasNextPage={assocTable.pageInfo?.hasNextPage}
          startCursor={assocTable.pageInfo?.startCursor ?? null}
          endCursor={assocTable.pageInfo?.endCursor ?? null}
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
