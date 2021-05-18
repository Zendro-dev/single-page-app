import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { SelectInput } from '@/components/inputs';
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
import { AssocQuery, QueryModelTableRecordsVariables } from '@/types/queries';
import { ExtendedClientError } from '@/types/errors';
import { parseErrorResponse } from '@/utils/errors';
import { UseOrderProps } from '@/zendro/model-table';

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
  const { t } = useTranslation();

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
      schema: model.schema,
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
    limit: 25,
    position: 'first',
    cursor: null,
  });
  const tablePagination = useTablePagination(pagination);

  /* AUXILIARY */

  /**
   * Auxiliary function to parse a Zendro client error response and display the
   * relevant notifications, if necessary.
   * @param error a base or extended client error type
   */
  const parseAndDisplayErrorResponse = (
    error: Error | ExtendedClientError
  ): void => {
    const parsedError = parseErrorResponse(error);
    console.log({ parsedError });

    if (parsedError.networkError) {
      showSnackbar(parsedError.networkError, 'error');
    }

    if (parsedError.genericError) {
      showSnackbar(
        t('errors.server-error', { status: parsedError.status }),
        'error',
        parsedError.genericError
      );
    }

    if (parsedError.graphqlErrors?.nonValidationErrors?.length) {
      showSnackbar(
        t('errors.server-error', { status: parsedError.status }),
        'error',
        parsedError.graphqlErrors.nonValidationErrors
      );
    }
  };

  /* FETCH RECORDS */
  const { mutate: mutateRecords } = useSWR<
    { records: TableRecord[]; pageInfo?: PageInfo } | undefined
  >(
    [
      recordsFilter,
      selectedAssoc.name,
      tableSearch,
      tableOrder,
      tablePagination,
      zendro,
    ],
    async () => {
      const recordsQuery: AssocQuery =
        associationView === 'details' || recordsFilter === 'associated'
          ? zendro.queries[modelName].withFilter[selectedAssoc.target]
              .readFiltered
          : zendro.queries[modelName].withFilter[selectedAssoc.target].readAll;

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

      const data = await zendro.request<AssocResponse>(recordsQuery.query, {
        jq: recordsQuery.transform,
        variables,
      });

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
          schema: model.schema,
        });

        // If association type is "to_one", the count must be directly derived
        // from the data (no count resolver exists). The count should be 0 or 1.
        if (selectedAssoc.type === 'to_one') {
          setRecordsTotal(data?.records.length ?? 0);
        }
      },
      onError: parseAndDisplayErrorResponse,
      shouldRetryOnError: false,
    }
  );

  /* FETCH COUNT */
  const { mutate: mutateCount } = useSWR<Record<'count', number> | undefined>(
    selectedAssoc.type !== 'to_one'
      ? [recordsFilter, selectedAssoc.target, tableSearch, zendro]
      : null,
    async () => {
      const countQuery =
        associationView === 'details' || recordsFilter === 'associated'
          ? zendro.queries[modelName].withFilter[selectedAssoc.target]
              .countFiltered
          : zendro.queries[selectedAssoc.target].countAll;

      if (!countQuery) return;

      const variables: QueryModelTableRecordsVariables = {
        search: tableSearch,
        [primaryKey]: recordId,
      };

      return await zendro.request(countQuery.query, {
        jq: countQuery.transform,
        variables,
      });
    },
    {
      onSuccess: (data) => {
        if (data) {
          setRecordsTotal(data.count);
        }
      },
      onError: parseAndDisplayErrorResponse,
    }
  );

  /* HANDLERS */

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
        { variables }
      );
      showSnackbar(t('success.assoc-update'), 'success');
      setSelectedRecords({
        toAdd: [],
        toRemove: [],
      });
      mutateRecords();
      mutateCount();
    } catch (error) {
      parseAndDisplayErrorResponse(error);
    }
  };

  const handleOnAssociationFilterSelect = (filter: string): void => {
    setRecordsFilter(filter as AssociationFilter);
  };

  return (
    <div className={classes.root}>
      <div className={classes.toolbar}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TableSearch
            placeholder={t('model-table.search-label', {
              modelName: selectedAssoc.name,
            })}
            value={searchText}
            onSearch={(value) => setSearchText(value)}
            onReset={() => setSearchText('')}
          />
          {associationView !== 'details' && (
            <SelectInput
              className={classes.toolbarFilters}
              id={`${modelName}-association-filters`}
              label={t('associations.filter-select', {
                assocName: selectedAssoc.name,
              })}
              onChange={handleOnAssociationFilterSelect}
              selected={recordsFilter}
              items={[
                {
                  id: 'no-filter',
                  text: t('associations.filter-no-filter'),
                  icon: FilterIcon,
                },
                {
                  id: 'associated',
                  text: t('associations.filter-associated'),
                  icon: LinkIcon,
                },
                {
                  id: 'not-associated',
                  text: t('associations.filter-not-associated'),
                  icon: LinkOffIcon,
                },
                {
                  id: 'records-to-add',
                  text: t('associations.filter-to-add'),
                  icon: LinkIcon,
                },
                {
                  id: 'records-to-remove',
                  text: t('associations.filter-to-remove'),
                  icon: LinkOffIcon,
                },
              ]}
            />
          )}
        </div>

        <div className={classes.toolbarActions}>
          <IconButton
            tooltip={t('model-table.reload', {
              modelName: selectedAssoc.target,
            })}
            onClick={() => {
              mutateRecords();
              mutateCount();
            }}
          >
            <ReloadIcon />
          </IconButton>
          {associationView !== 'details' && (
            <IconButton
              // tooltip={`Save ${selectedAssoc.target} data`}
              tooltip={t('associations.save', {
                assocName: selectedAssoc.target,
              })}
              onClick={handleSubmit}
              disabled={
                selectedRecords.toAdd.length === 0 &&
                selectedRecords.toRemove.length === 0
              }
            >
              <SaveIcon />
            </IconButton>
          )}

          <SelectInput
            className={classes.toolbarAssocSelect}
            id={`${modelName}-association-select`}
            // label={`Select ${modelName} association`}
            label={t('associations.assoc-select', { modelName })}
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
                              ? t('associations.mark-to-disassociate')
                              : t('associations.click-to-disassociate')
                            : isSelected
                            ? t('associations.mark-to-associate')
                            : t('associations.click-to-associate')
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
          options={[5, 10, 15, 20, 25, 50]}
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
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
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
    iconLinkMarked: {
      color: 'green',
    },
    iconLinkOffMarked: {
      color: 'red',
    },
  })
);
