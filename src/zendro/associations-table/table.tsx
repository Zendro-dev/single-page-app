import { useState } from 'react';
import useSWR from 'swr';

import { TableCell as MuiTableCell, TableContainer } from '@material-ui/core';
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
import { AssocQuery, QueryModelTableRecordsVariables } from '@/types/queries';
import { ParsedPermissions } from '@/types/acl';
import { ExtendedClientError } from '@/types/errors';

interface AssociationsTableProps {
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

export default function AssociationsTable({
  associations,
  attributes,
  modelName,
  recordId,
  primaryKey,
  associationView,
}: AssociationsTableProps): React.ReactElement {
  const { showSnackbar } = useToastNotification();
  const getModel = useModel();
  const classes = useStyles();
  const zendro = useZendroClient();

  // Selected association
  const [selectedAssoc, setSelectedAssoc] = useState(() => {
    const model = getModel(associations[0].target);
    return {
      target: associations[0].target,
      name: associations[0].name,
      type: associations[0].type,
      attributes: model.schema.attributes,
      primaryKey: model.schema.primaryKey,
    };
  });

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
  const [selectedRecords, setSelectedRecords] = useState<{
    toAdd: (string | number)[];
    toRemove: (string | number)[];
  }>({
    toAdd: [],
    toRemove: [],
  });

  /* VARIABLES */

  const [searchText, setSearchText] = useState('');
  const tableSearch = useTableSearch({
    associationFilter: recordsFilter,
    attributes: selectedAssoc.attributes,
    primaryKey: selectedAssoc.primaryKey,
    selectedRecords,
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

  /* FETCH RECORDS */
  const { mutate: mutateRecords } = useSWR(
    [
      recordsFilter,
      selectedAssoc.name,
      tableSearch,
      tableOrder,
      tablePagination,
    ],
    async (): Promise<
      { records: TableRecord[]; pageInfo?: PageInfo } | undefined
    > => {
      const recordsQuery: AssocQuery =
        associationView === 'details' || recordsFilter === 'associated'
          ? zendro.queries[modelName].withFilter[selectedAssoc.target]
              .readFiltered
          : zendro.queries[modelName].withFilter[selectedAssoc.target].readAll;

      let data: AssocResponse;

      const variables: QueryModelTableRecordsVariables = {
        search: tableSearch,
        order: tableOrder,
        pagination: tablePagination,
        assocPagination: { first: 1 },
        [primaryKey]: recordId,
        assocSearch: {
          field: primaryKey,
          value: recordId as string,
          operator: 'eq',
        },
      };

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
                ? record[assocName]?.[assocPrimaryKey] === assocPrimaryKeyValue
                : true;

            const parsedRecord: TableRecord = {
              data: record,
              isAssociated,
            };

            return [...acc, parsedRecord];
          },
          [] as TableRecord[]
        );

        return {
          records: parsedRecords,
          pageInfo: data.pageInfo,
        };
      }
    },
    {
      onSuccess: (data) => {
        const model = getModel(selectedAssoc.target);

        setAssocTable({
          data: data?.records ?? [],
          pageInfo: data?.pageInfo,
          ...model,
        });

        // If association type is to_one the count can be directly derive from the data
        // since its either 0 or 1. Since there is on resolver the useSWR for count won't fire
        if (selectedAssoc.type === 'to_one') {
          setRecordsTotal(data?.records.length ?? 0);
        }
      },
      onError: (error) => {
        // TODO check clientError.response.data
        const clientError = error as ExtendedClientError<AssocResponse>;

        if (!clientError.response) {
          showSnackbar((error as Error).message, 'error');
          return;
        }

        const genericError = clientError.response.error;
        const graphqlErrors = clientError.response.errors;

        if (graphqlErrors)
          showSnackbar('Error in Graphql response', 'error', graphqlErrors);

        if (genericError)
          showSnackbar('Error in request to server', 'error', genericError);
      },
      shouldRetryOnError: false,
    }
  );

  /* FETCH COUNT */
  const { mutate: mutateCount } = useSWR(
    selectedAssoc.type !== 'to_one'
      ? [recordsFilter, selectedAssoc.target, tableSearch]
      : null,
    async (): Promise<Record<'count', number> | undefined> => {
      const countQuery =
        associationView === 'details' || recordsFilter === 'associated'
          ? zendro.queries[modelName].withFilter[selectedAssoc.target]
              .countFiltered
          : zendro.queries[selectedAssoc.target].countAll;

      if (!countQuery) return;

      let data: Record<'count', number>;

      const variables: QueryModelTableRecordsVariables = {
        search: tableSearch,
        [primaryKey]: recordId,
      };

      if (countQuery.transform) {
        data = await zendro.metaRequest(countQuery.query, {
          jq: countQuery.transform,
          variables,
        });
      } else {
        data = await zendro.request(countQuery.query, variables);
      }
      return data;
    },
    {
      onSuccess: (data) => {
        if (data) {
          setRecordsTotal(data.count);
        }
      },
      onError: (error) => {
        const clientError = error as ExtendedClientError<
          Record<'count', number>
        >;

        if (!clientError.response) {
          showSnackbar((error as Error).message, 'error');
          return;
        }

        const genericError = clientError.response.error;
        const graphqlErrors = clientError.response.errors;

        if (graphqlErrors)
          showSnackbar('Error in Graphql response', 'error', graphqlErrors);

        if (genericError)
          showSnackbar('Error in request to server', 'error', genericError);
      },
    }
  );

  const handleOnAsociationSelect = (target: string, name: string): void => {
    const assoc = associations.find(
      (association) => association.target === target
    ) as ParsedAssociation;
    if (target !== selectedAssoc.target) {
      setOrder(undefined);
      setSelectedRecords({
        toAdd: [],
        toRemove: [],
      });

      const model = getModel(target);
      setSelectedAssoc({
        target,
        name,
        type: assoc.type,
        attributes: model.schema.attributes,
        primaryKey: model.schema.primaryKey,
      });
    }
  };

  const handleOnMarkForAssociationClick: TableRowAssociationHandler = (
    recordToMark,
    list,
    action
  ) => {
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
            setSelectedRecords(({ toRemove }) => ({
              toAdd: [recordToMark],
              toRemove: currAssocRecordId
                ? [...toRemove, currAssocRecordId]
                : toRemove,
            }));
          } else {
            setSelectedRecords(({ toAdd, toRemove }) => ({
              toAdd: [...toAdd, recordToMark],
              toRemove,
            }));
          }
        } else
          setSelectedRecords(({ toAdd, toRemove }) => ({
            toAdd,
            toRemove: [...toRemove, recordToMark],
          }));
        break;
      case 'remove':
        if (list === 'toAdd') {
          setSelectedRecords(({ toAdd, toRemove }) => ({
            toAdd: toAdd.filter((item) => item !== recordToMark),
            toRemove,
          }));
          if (selectedAssoc.type === 'to_one') {
            setSelectedRecords(({ toAdd, toRemove }) => ({
              toAdd,
              toRemove: toRemove.filter((item) => item !== currAssocRecordId),
            }));
          }
        } else
          setSelectedRecords(({ toAdd, toRemove }) => ({
            toAdd,
            toRemove: toRemove.filter((item) => item !== recordToMark),
          }));
        break;
    }
  };

  const handleSubmit = async (): Promise<void> => {
    const { namePlCp, nameCp } = getInflections(selectedAssoc.name);
    const mutationName = selectedAssoc.type === 'to_one' ? nameCp : namePlCp;
    const variables = {
      [primaryKey]: recordId,
      [`add${mutationName}`]:
        selectedRecords.toAdd.length > 0
          ? selectedAssoc.type === 'to_one'
            ? selectedRecords.toAdd.toString()
            : selectedRecords.toAdd
          : undefined,
      [`remove${mutationName}`]:
        selectedRecords.toRemove.length > 0
          ? selectedAssoc.type === 'to_one'
            ? selectedRecords.toRemove.toString()
            : selectedRecords.toRemove
          : undefined,
    };
    try {
      await zendro.request<Record<string, DataRecord>>(
        zendro.queries[modelName].updateOne.query,
        variables
      );
      showSnackbar('Associations updated successfully', 'success');
    } catch (error) {
      showSnackbar('There was an error', 'error', error);
    }
    setSelectedRecords({
      toAdd: [],
      toRemove: [],
    });
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
                selectedRecords.toAdd.length === 0 &&
                selectedRecords.toRemove.length === 0
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
          caption={`${selectedAssoc.name} associations table for ${modelName}`}
          isEmpty={assocTable.data.length === 0}
        >
          <TableHeader
            actionsColSpan={associationView !== 'details' ? 1 : 0}
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
            {assocTable.data.map((record) => {
              const recordPK = assocTable.schema.primaryKey;
              const recordId = record.data[recordPK] as string | number;
              const isSelected =
                selectedRecords.toAdd.includes(recordId) ||
                selectedRecords.toRemove.includes(recordId);
              return (
                <TableRow
                  key={recordId}
                  hover
                  attributes={assocTable.schema.attributes}
                  record={record.data}
                >
                  {associationView !== 'details' && (
                    <MuiTableCell align="center">
                      <IconButton
                        tooltip={
                          record.isAssociated
                            ? isSelected
                              ? 'marked to be disassociated, click to reset'
                              : 'click to disassociate'
                            : isSelected
                            ? 'marked to be associated, click to reset'
                            : 'click to associate'
                        }
                        onClick={() =>
                          handleOnMarkForAssociationClick(
                            recordId,
                            record.isAssociated ? 'toRemove' : 'toAdd',
                            isSelected ? 'remove' : 'add'
                          )
                        }
                      >
                        {record.isAssociated ? (
                          isSelected ? (
                            <LinkOffIcon
                              fontSize="small"
                              className={classes.iconLinkOffMarked}
                            />
                          ) : (
                            <LinkIcon fontSize="small" />
                          )
                        ) : isSelected ? (
                          <LinkIcon
                            fontSize="small"
                            className={classes.iconLinkMarked}
                          />
                        ) : (
                          <LinkOffIcon fontSize="small" />
                        )}
                      </IconButton>
                    </MuiTableCell>
                  )}
                </TableRow>
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
    iconDetail: {
      '&:hover': {
        color: theme.palette.primary.main,
      },
    },
    iconEdit: {
      '&:hover': {
        color: theme.palette.primary.main,
      },
    },
    iconDelete: {
      '&:hover': {
        color: theme.palette.secondary.main,
      },
    },
    iconLinkMarked: {
      color: 'green',
    },
    iconLinkOffMarked: {
      color: 'red',
    },
  })
);