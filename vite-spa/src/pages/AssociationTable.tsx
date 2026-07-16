// Ported from pages/[group]/[model]/[request]/[association]/index.tsx.
// Next-specific plumbing swapped:
//   - getStaticPaths/getStaticProps -> gone; group/model/request/association
//     come from useParams(), id from useRouteQuery().
//   - useRouter() -> useRouteQuery()
//   - useSession() (next-auth, bare call, unused result) -> removed
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';

import {
  TableCell as MuiTableCell,
  TableContainer,
  Dialog,
  DialogTitle,
  DialogContent,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import {
  AddCircleOutline as AddIcon,
  FilterAltOutlined as FilterIcon,
  Link as LinkIcon,
  LinkOff as LinkOffIcon,
  Repeat as ToManyIcon,
  RepeatOne as ToOneIcon,
  Replay as ReloadIcon,
  Save as SaveIcon,
  VisibilityTwoTone as DetailsIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

import IconButton from '@/components/icon-button';
import NavTabs from '@/components/nav-tabs';
import SelectInput from '@/components/select-input';
import { useModel, useRouteQuery, useToastNotification, useZendroClient } from '@/hooks';

import { ExtendedClientError } from '@/types/errors';
import { DataRecord, ParsedAssociation } from '@/types/models';
import { AssocQuery, QueryModelTableRecordsVariables } from '@/types/queries';
import { PageInfo } from '@/types/requests';

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
import AttributesForm, { ActionHandler } from '@/zendro/record-form';

interface AssocTable {
  data: TableRecord[];
  pageInfo?: PageInfo;
}

export default function AssociationTable() {
  const {
    group = 'models',
    model: modelName = '',
    request = '',
    association: associationName = '',
  } = useParams();

  const { showSnackbar } = useToastNotification();
  const getModel = useModel();
  const router = useRouteQuery();
  const classes = useStyles({});
  const zendro = useZendroClient();
  const { t } = useTranslation();

  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.only('xs'));

  const sourceModel = getModel(modelName);
  const association = sourceModel.associations?.find(
    (assoc) => assoc.name === associationName
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

  const [associatedRecord, setAssociatedRecord] = useState<DataRecord>();

  const [recordsTotal, setRecordsTotal] = useState<number>(0);

  const [recordsFilter, setRecordsFilter] = useState<AssociationFilter>('no-filter');
  const [selectedRecords, setSelectedRecords] = useState<{
    toAdd: (string | number)[];
    toRemove: (string | number)[];
  }>({
    toAdd: [],
    toRemove: [],
  });

  const [newAssocRecordOpen, setNewAssocRecordOpen] = useState(false);
  const handleNewAssocRecordOpen = async (): Promise<void> => {
    const currAssocRecordId = associatedRecord
      ? (associatedRecord[targetModel.primaryKey] as string)
      : undefined;

    if (currAssocRecordId && association.type.includes('to_one')) {
      showSnackbar(
        `${t('warnings.already-associated', {
          modelName: targetModel.model,
          recordId: currAssocRecordId,
        })}`,
        'warning'
      );
    }

    setNewAssocRecordOpen(true);
  };
  const handleNewAssocRecordClose = (): void => setNewAssocRecordOpen(false);

  /* VARIABLES */

  const [searchText, setSearchText] = useState('');
  const tableSearch = useTableSearch({
    associationFilter: recordsFilter,
    attributes: targetModel.attributes,
    primaryKey: targetModel.primaryKey,
    selectedRecords,
    searchText,
    spaSearchOperator: targetModel.spaSearchOperator,
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

  const parseAndDisplayErrorResponse = (error: Error | ExtendedClientError): void => {
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
    router.query.id
      ? [recordsFilter, tableSearch, tableOrder, tablePagination, router.query.id, zendro]
      : null,
    async () => {
      const recordsQuery: AssocQuery =
        request === 'details' || recordsFilter === 'associated'
          ? zendro.queries[modelName].withFilter[association.name].readFiltered
          : zendro.queries[modelName].withFilter[association.name].readAll;

      const variables: QueryModelTableRecordsVariables = {
        search: tableSearch,
        order: tableOrder,
        pagination: tablePagination,
        assocPagination: { first: 1 },
        [sourceModel.primaryKey]: router.query.id,
        assocSearch: {
          field: sourceModel.primaryKey,
          value: router.query.id,
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
        const assocName = recordsFilter === 'associated' ? undefined : recordsQuery.assocResolver;
        const assocPrimaryKey = sourceModel.primaryKey;
        const assocPrimaryKeyValue = router.query.id as string;

        const parsedRecords = data.records.reduce<TableRecord[]>((acc, record) => {
          let isAssociated = true;

          if (assocName && assocPrimaryKey && assocPrimaryKeyValue) {
            const assoc = record[assocName] as DataRecord;
            isAssociated = assoc && assoc[assocPrimaryKey] === assocPrimaryKeyValue;
          }

          const parsedRecord: TableRecord = {
            data: record,
            isAssociated,
          };

          return [...acc, parsedRecord];
        }, [] as TableRecord[]);

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
          (request === 'details' || recordsFilter === 'associated')
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
    router.query.id &&
      !(
        association.type.includes('to_one') &&
        (request === 'details' || recordsFilter === 'associated')
      )
      ? [recordsFilter, tableSearch, router.query.id, zendro]
      : null,
    async () => {
      const countQuery =
        request === 'details' || recordsFilter === 'associated'
          ? zendro.queries[modelName].withFilter[association.name].countFiltered
          : zendro.queries[association.target].countAll;

      if (!countQuery) return;

      const variables: QueryModelTableRecordsVariables = {
        search: tableSearch,
        [sourceModel.primaryKey]: router.query.id,
      };

      return await zendro.request<Record<'count', number> | undefined>(countQuery.query, {
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

  /* FETCH Assoc record in case of to_one */
  const { mutate: mutateAssociatedRecord } = useSWR<{
    records: DataRecord[];
  }>(
    router.query.id && association.type.includes('to_one')
      ? [router.query.id, zendro, association]
      : null,
    async () => {
      const assocRecordQuery = zendro.queries[modelName].withFilter[association.name].readFiltered;

      const variables: QueryModelTableRecordsVariables = {
        [sourceModel.primaryKey]: router.query.id,
      };

      return await zendro.request<{
        records: DataRecord[];
      }>(assocRecordQuery.query, {
        jq: assocRecordQuery.transform,
        variables,
      });
    },
    {
      onSuccess: (data) => {
        if (data) {
          setAssociatedRecord(data.records[0]);
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
    const currAssocRecordId = associatedRecord
      ? (associatedRecord[targetModel.primaryKey] as string)
      : undefined;

    if (currAssocRecordId && action === 'add' && list === 'toAdd') {
      showSnackbar(
        `${t('warnings.already-associated', {
          modelName: targetModel.model,
          recordId: currAssocRecordId,
        })}`,
        'warning'
      );
    }

    switch (action) {
      case 'add':
        if (list === 'toAdd') {
          if (association.type.includes('to_one')) {
            setSelectedRecords(({ toRemove }) => ({
              toAdd: [recordToMark],
              toRemove: currAssocRecordId ? [...toRemove, currAssocRecordId] : toRemove,
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
    const mutationName = association.type.includes('to_one') ? nameCp : namePlCp;
    const variables = {
      [sourceModel.primaryKey]: router.query.id,
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
      await zendro.request<Record<string, DataRecord>>(zendro.queries[modelName].updateOne.query, {
        variables,
      });
      showSnackbar(t('success.assoc-update'), 'success');
      setSelectedRecords({
        toAdd: [],
        toRemove: [],
      });
      mutateRecords();
      mutateCount();
      // For to_one associations, handleOnMarkForAssociationClick derives
      // which record to auto-remove (currAssocRecordId) from associatedRecord
      // - without revalidating it here, that stays pointed at whatever was
      // associated before this submit, so a second reassignment in a row
      // fails to remove the record this one just added.
      mutateAssociatedRecord();
    } catch (error) {
      parseAndDisplayErrorResponse(error as Error | ExtendedClientError);
    }
  };

  const handleOnAssociationFilterSelect = (filter: string): void => {
    setRecordsFilter(filter as AssociationFilter);
  };

  const handleOnRead = (primaryKey: string | number): void => {
    router.push(`/${group}/${targetModel.model}/details?id=${primaryKey}`);
  };

  /**
   * Submit the form values to the Zendro GraphQL endpoint. Triggers a revalidation.
   */
  const handleNewAssocRecordSubmit: ActionHandler = async (formData) => {
    const dataRecord = formData.reduce<DataRecord>(
      (acc, { name, value }) => ({ ...acc, [name]: value }),
      {}
    );

    const { namePlCp, nameCp } = getInflections(association.reverseAssociation);
    const mutationName = association.type.includes('to_one') ? `add${nameCp}` : `add${namePlCp}`;

    dataRecord[mutationName] = router.query.id;

    const submit = async (): Promise<void> => {
      try {
        const req = zendro.queries[targetModel.model].createOne;

        const response = await zendro.request<Record<string, DataRecord>>(req.query, {
          variables: dataRecord,
        });
        const cursor = response?.[req.resolver].asCursor as string;
        setPagination((state) => ({
          ...state,
          cursor: cursor,
          position: 'next',
          includeCursor: true,
        }));
        handleNewAssocRecordClose();
      } catch (error) {
        parseAndDisplayErrorResponse(error as Error | ExtendedClientError);
      }
    };

    submit();

    showSnackbar(
      `${t('success.new-associated-record', { modelName: targetModel.model })}`,
      'success'
    );

    await mutateRecords();
    await mutateCount();
    mutateAssociatedRecord();
  };

  return (
    <ModelBouncer
      object={modelName}
      action={request === 'details' ? 'read' : request === 'edit' ? 'update' : 'create'}
    >
      <NavTabs
        id={router.query.id as string}
        active={router.asPath}
        tabs={[
          {
            type: 'link',
            label: `${t('record-form.tab-attributes')}`,
            href: `/${group}/${modelName}/${request}?id=${router.query.id}`,
          },
          {
            type: 'group',
            label: associationName,
            links: sourceModel.associations?.map((assoc) => ({
              type: 'link',
              label: assoc.name,
              href: `/${group}/${modelName}/${request}/${assoc.name}?id=${router.query.id}`,
              icon: assoc.type.includes('to_many') ? ToManyIcon : ToOneIcon,
            })),
          },
        ]}
        data-cy={`${modelName}-associations-tab`}
      />

      <TableContainer className={classes.tableContainer}>
        <div className={classes.toolbar}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {targetModel.apiPrivileges.textSearch && (
              <TableSearch
                placeholder={t('model-table.search-label', { modelName: association.name })}
                value={searchText}
                onSearch={(value) => setSearchText(value)}
                onReset={() => setSearchText('')}
              />
            )}
            {request !== 'details' && (
              <SelectInput
                className={classes.toolbarFilters}
                id={`${modelName}-association-filters`}
                label={t('associations.filter-select', { assocName: association.name })}
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
            {request !== 'details' && targetModel.permissions.create && targetModel.apiPrivileges.create && (
              <IconButton
                tooltip={t('associations.new-associated-record', { modelName: targetModel.model })}
                onClick={handleNewAssocRecordOpen}
                data-cy="model-table-add"
                aria-label="New record"
              >
                <AddIcon />
              </IconButton>
            )}
            <IconButton
              tooltip={t('model-table.reload', { modelName: association.target })}
              onClick={() => {
                mutateRecords();
                mutateCount();
              }}
              data-cy="associations-table-reload"
            >
              <ReloadIcon />
            </IconButton>
            {request !== 'details' && (
              <IconButton
                tooltip={t('associations.save', { assocName: association.target })}
                onClick={handleSubmit}
                disabled={selectedRecords.toAdd.length === 0 && selectedRecords.toRemove.length === 0}
                data-cy={`associations-table-submit`}
              >
                <SaveIcon />
              </IconButton>
            )}
          </div>
        </div>

        <Table
          caption={`${association.name} associations table for ${modelName}`}
          isEmpty={assocTable.data.length === 0}
        >
          <TableHeader
            actionsColSpan={request !== 'details' ? 2 : 1}
            attributes={targetModel.attributes}
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
            activeOrder={order?.sortField ?? targetModel.primaryKey}
            orderDirection={order?.sortDirection ?? 'ASC'}
            disableSort={!targetModel.apiPrivileges.sort}
          />

          <TableBody>
            {assocTable.data.map((record) => {
              const recordPK = targetModel.primaryKey;
              const recordId = record.data[recordPK] as string | number;
              const isSelected =
                selectedRecords.toAdd.includes(recordId) || selectedRecords.toRemove.includes(recordId);
              return (
                <TableRow key={recordId} hover attributes={targetModel.attributes} record={record.data}>
                  <MuiTableCell padding="checkbox">
                    <IconButton
                      tooltip={t('model-table.view', { recordId })}
                      onClick={() => handleOnRead(recordId)}
                      className={classes.rowActionPrimary}
                      data-cy={`model-table-view-${recordId}`}
                    >
                      <DetailsIcon fontSize="small" />
                    </IconButton>
                  </MuiTableCell>
                  {request !== 'details' && (
                    <MuiTableCell align="center" padding="checkbox">
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
                        disabled={
                          association.type.includes('to_one') &&
                          selectedRecords.toAdd.length > 0 &&
                          selectedRecords.toRemove.includes(recordId)
                        }
                      >
                        {record.isAssociated ? (
                          isSelected ? (
                            <LinkOffIcon fontSize="small" className={classes.iconLinkOffMarked} />
                          ) : (
                            <LinkIcon fontSize="small" />
                          )
                        ) : isSelected ? (
                          <LinkIcon fontSize="small" className={classes.iconLinkMarked} />
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
            targetModel.apiPrivileges.backwardPagination ? assocTable.pageInfo?.hasPreviousPage : true
          }
          hasLastPage={
            targetModel.apiPrivileges.backwardPagination ? assocTable.pageInfo?.hasNextPage : undefined
          }
          hasPreviousPage={
            targetModel.apiPrivileges.backwardPagination ? assocTable.pageInfo?.hasPreviousPage : undefined
          }
          hasNextPage={assocTable.pageInfo?.hasNextPage}
          startCursor={assocTable.pageInfo?.startCursor ?? null}
          endCursor={assocTable.pageInfo?.endCursor ?? null}
          onPageChange={(position, cursor) => {
            setPagination((state) => ({
              ...state,
              position,
              cursor,
              includeCursor: false,
            }));
          }}
          onPageSizeChange={(limit) => {
            setPagination((state) => ({
              ...state,
              limit,
              includeCursor: false,
            }));
          }}
        />
      </TableContainer>
      <Dialog open={newAssocRecordOpen} onClose={handleNewAssocRecordClose} fullScreen={mobile}>
        <div className={classes.dialogTitleContainer}>
          <DialogTitle id="alert-dialog-title" className={classes.dialogTitle}>
            {t('associations.new-associated-record', { modelName: targetModel.model })}
          </DialogTitle>
          <IconButton aria-label="close" onClick={handleNewAssocRecordClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <DialogContent style={{ padding: 0 }}>
          <AttributesForm
            attributes={targetModel.attributes}
            className={classes.root}
            disabled={request === 'details'}
            formId={router.asPath}
            formView="create"
            modelName={targetModel.model}
            actions={{
              submit: handleNewAssocRecordSubmit,
            }}
          />
        </DialogContent>
      </Dialog>
    </ModelBouncer>
  );
}

const useStyles = makeStyles((theme: Theme) =>
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
    tableContainer: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      flexGrow: 1,
      padding: theme.spacing(2, 4),
      marginTop: theme.spacing(8),
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
    rowActionPrimary: {
      '&:hover': {
        backgroundColor: 'transparent',
        color: theme.palette.primary.main,
      },
    },
    dialogTitle: {
      fontSize: 24,
      padding: 0,
    },
    dialogTitleContainer: {
      display: 'flex',
      padding: '1rem',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  })
);
