import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
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

import { getStaticAssociationPaths } from '@/build/routes';

import IconButton from '@/components/icon-button';
import NavTabs from '@/components/nav-tabs';
import SelectInput from '@/components/select-input';
import { useModel, useToastNotification, useZendroClient } from '@/hooks';
import { ModelLayout, PageWithLayout } from '@/layouts';

import { ExtendedClientError } from '@/types/errors';
import { DataRecord, ParsedAssociation } from '@/types/models';
import { AssocQuery, QueryModelTableRecordsVariables } from '@/types/queries';
import { PageInfo } from '@/types/requests';
import { AssociationUrlQuery } from '@/types/routes';

import { parseErrorResponse } from '@/utils/errors';
import { getInflections } from '@/utils/inflection';

import ModelBouncer from '@/zendro/model-bouncer';
import {
  AssociationFilter,
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
  UseOrderProps,
} from '@/zendro/model-table';

interface AssocTable {
  data: TableRecord[];
  pageInfo?: PageInfo;
}

export const getStaticPaths: GetStaticPaths<AssociationUrlQuery> = async () => {
  const paths = await getStaticAssociationPaths();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<AssociationUrlQuery> = async (
  context
) => {
  const params = context.params as AssociationUrlQuery;

  return {
    props: {
      key: `${params.group}/${params.model}/${params.request}/${params.association}`,
      ...params,
    },
  };
};

const Association: PageWithLayout<AssociationUrlQuery> = (props) => {
  const { showSnackbar } = useToastNotification();
  const getModel = useModel();
  const router = useRouter();
  const classes = useStyles();
  const zendro = useZendroClient();
  const { t } = useTranslation();

  const urlQuery = router.query as AssociationUrlQuery;

  const sourceModel = getModel(props.model);
  const association = sourceModel.schema.associations?.find(
    (assoc) => assoc.name === props.association
  ) as ParsedAssociation;
  const targetModel = getModel(association.target);

  const [assocTable, setAssocTable] = useState<AssocTable>(() => {
    return {
      data: [],
      pageInfo: {
        startCursor: null,
        endCursor: null,
        hasPreviousPage: false,
        hasNextPage: false,
      },
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
    attributes: targetModel.schema.attributes,
    primaryKey: targetModel.schema.primaryKey,
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
    urlQuery.id
      ? [
          recordsFilter,
          tableSearch,
          tableOrder,
          tablePagination,
          urlQuery.id,
          zendro,
        ]
      : null,
    async () => {
      const recordsQuery: AssocQuery =
        props.request === 'details' || recordsFilter === 'associated'
          ? zendro.queries[props.model].withFilter[association.name]
              .readFiltered
          : zendro.queries[props.model].withFilter[association.name].readAll;

      const variables: QueryModelTableRecordsVariables = {
        search: tableSearch,
        order: tableOrder,
        pagination: tablePagination,
        assocPagination: { first: 1 },
        [sourceModel.schema.primaryKey]: urlQuery.id,
        assocSearch: {
          field: sourceModel.schema.primaryKey,
          value: urlQuery.id,
          operator: 'eq',
        },
      };

      const data = await zendro.request<{
        pageInfo: PageInfo;
        records: DataRecord[];
      }>(recordsQuery.query, {
        jq: recordsQuery.transform,
        variables,
      });

      if (data) {
        const assocName =
          recordsFilter === 'associated'
            ? undefined
            : recordsQuery.assocResolver;
        const assocPrimaryKey = sourceModel.schema.primaryKey;
        const assocPrimaryKeyValue = urlQuery.id as string;

        const parsedRecords = data.records.reduce<TableRecord[]>(
          (acc, record) => {
            let isAssociated = true;

            if (assocName && assocPrimaryKey && assocPrimaryKeyValue) {
              const assoc = record[assocName] as DataRecord;
              isAssociated =
                assoc && assoc[assocPrimaryKey] === assocPrimaryKeyValue;
            }

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
        setAssocTable({
          data: data?.records ?? [],
          pageInfo: data?.pageInfo,
        });

        // If association type is "to_one", the count must be directly derived
        // from the data (no count resolver exists). The count should be 0 or 1.
        if (
          association.type.includes('to_one') &&
          (props.request === 'details' || recordsFilter === 'associated')
        ) {
          setRecordsTotal(data?.records.length ?? 0);
        }
      },
      onError: parseAndDisplayErrorResponse,
      shouldRetryOnError: false,
    }
  );

  /* FETCH COUNT */
  const { mutate: mutateCount } = useSWR<Record<'count', number> | undefined>(
    urlQuery.id &&
      !(
        association.type.includes('to_one') &&
        (props.request === 'details' || recordsFilter === 'associated')
      )
      ? [recordsFilter, tableSearch, urlQuery.id, zendro]
      : null,
    async () => {
      const countQuery =
        props.request === 'details' || recordsFilter === 'associated'
          ? zendro.queries[props.model].withFilter[association.name]
              .countFiltered
          : zendro.queries[association.target].countAll;

      if (!countQuery) return;

      const variables: QueryModelTableRecordsVariables = {
        search: tableSearch,
        [sourceModel.schema.primaryKey]: urlQuery.id,
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
      shouldRetryOnError: false,
    }
  );

  /* HANDLERS */

  const handleOnMarkForAssociationClick: TableRowAssociationHandler = (
    recordToMark,
    list,
    action
  ) => {
    const currAssocRecord = assocTable.data.find(
      (record) => record.isAssociated
    );

    const currAssocRecordId = currAssocRecord
      ? (currAssocRecord.data[targetModel.schema.primaryKey] as string | number)
      : undefined;

    switch (action) {
      case 'add':
        if (list === 'toAdd') {
          if (association.type.includes('to_one')) {
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
          if (association.type.includes('to_one')) {
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
    const { namePlCp, nameCp } = getInflections(association.name);
    const mutationName = association.type.includes('to_one')
      ? nameCp
      : namePlCp;
    const variables = {
      [sourceModel.schema.primaryKey]: urlQuery.id,
      [`add${mutationName}`]:
        selectedRecords.toAdd.length > 0
          ? association.type.includes('to_one')
            ? selectedRecords.toAdd.toString()
            : selectedRecords.toAdd
          : undefined,
      [`remove${mutationName}`]:
        selectedRecords.toRemove.length > 0
          ? association.type.includes('to_one')
            ? selectedRecords.toRemove.toString()
            : selectedRecords.toRemove
          : undefined,
    };
    try {
      await zendro.request<Record<string, DataRecord>>(
        zendro.queries[props.model].updateOne.query,
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
    <ModelBouncer
      object={props.model}
      action={
        props.request === 'details'
          ? 'read'
          : props.request === 'edit'
          ? 'update'
          : 'create'
      }
    >
      <NavTabs
        id={urlQuery.id as string}
        active={router.asPath}
        tabs={[
          {
            type: 'link',
            label: 'attributes',
            href: `/${props.group}/${props.model}/${props.request}?id=${urlQuery.id}`,
          },
          {
            type: 'group',
            label: props.association,
            links: sourceModel.schema.associations?.map((assoc) => ({
              type: 'link',
              label: assoc.name,
              href: `/${props.group}/${props.model}/${props.request}/${assoc.name}?id=${urlQuery.id}`,
              icon: assoc.type.includes('to_many') ? ToManyIcon : ToOneIcon,
            })),
          },
        ]}
        data-cy={`${props.model}-associations-tab`}
      />

      <div className={classes.root}>
        <div className={classes.toolbar}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {targetModel.apiPrivileges.textSearch && (
              <TableSearch
                placeholder={t('model-table.search-label', {
                  modelName: association.name,
                })}
                value={searchText}
                onSearch={(value) => setSearchText(value)}
                onReset={() => setSearchText('')}
              />
            )}
            {props.request !== 'details' && (
              <SelectInput
                className={classes.toolbarFilters}
                id={`${props.model}-association-filters`}
                label={t('associations.filter-select', {
                  assocName: association.name,
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
                modelName: association.target,
              })}
              onClick={() => {
                mutateRecords();
                mutateCount();
              }}
              data-cy="associations-table-reload"
            >
              <ReloadIcon />
            </IconButton>
            {props.request !== 'details' && (
              <IconButton
                // tooltip={`Save ${selectedAssoc.target} data`}
                tooltip={t('associations.save', {
                  assocName: association.target,
                })}
                onClick={handleSubmit}
                disabled={
                  selectedRecords.toAdd.length === 0 &&
                  selectedRecords.toRemove.length === 0
                }
                data-cy={`associations-table-submit`}
              >
                <SaveIcon />
              </IconButton>
            )}
          </div>
        </div>

        <TableContainer className={classes.table}>
          <Table
            caption={`${association.name} associations table for ${props.model}`}
            isEmpty={assocTable.data.length === 0}
          >
            <TableHeader
              actionsColSpan={props.request !== 'details' ? 1 : 0}
              attributes={targetModel.schema.attributes}
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
              activeOrder={order?.sortField ?? targetModel.schema.primaryKey}
              orderDirection={order?.sortDirection ?? 'ASC'}
              disableSort={!targetModel.apiPrivileges.sort}
            />

            <TableBody>
              {assocTable.data.map((record) => {
                const recordPK = targetModel.schema.primaryKey;
                const recordId = record.data[recordPK] as string | number;
                const isSelected =
                  selectedRecords.toAdd.includes(recordId) ||
                  selectedRecords.toRemove.includes(recordId);
                return (
                  <TableRow
                    key={recordId}
                    hover
                    attributes={targetModel.schema.attributes}
                    record={record.data}
                  >
                    {props.request !== 'details' && (
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
                          data-cy={`associations-table-mark-${recordId}`}
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
            hasFirstPage={
              // storageTypes that don't support backward pagination default to hasPreviousPage = false.
              targetModel.apiPrivileges.backwardPagination
                ? assocTable.pageInfo?.hasPreviousPage
                : true
            }
            hasLastPage={
              targetModel.apiPrivileges.backwardPagination
                ? assocTable.pageInfo?.hasNextPage
                : undefined
            }
            hasPreviousPage={
              targetModel.apiPrivileges.backwardPagination
                ? assocTable.pageInfo?.hasPreviousPage
                : undefined
            }
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
    </ModelBouncer>
  );
};

Association.layout = ModelLayout;
export default Association;

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      padding: theme.spacing(3),
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
