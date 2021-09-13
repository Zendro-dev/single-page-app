import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';

import { TableCell as MuiTableCell, TableContainer } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import {
  AddCircleOutline as AddIcon,
  Replay as ReloadIcon,
  Download as ExportIcon,
  SaveAlt as ImportTemplateIcon,
  Upload as ImportIcon,
  DeleteOutline as DeleteIcon,
  Edit as EditIcon,
  VisibilityTwoTone as DetailsIcon,
} from '@mui/icons-material';

import { getStaticModelPaths } from '@/build/routes';
import { useDialog } from '@/components/dialog-popup';
import IconButton from '@/components/icon-button';
import { EXPORT_URL } from '@/config/globals';
import {
  useAuth,
  useModel,
  useToastNotification,
  useZendroClient,
} from '@/hooks';
import { ModelLayout, PageWithLayout } from '@/layouts';

import { ExtendedClientError } from '@/types/errors';
import {
  QueryVariableOrder,
  QueryVariablePagination,
  QueryVariables,
  QueryVariableSearch,
} from '@/types/queries';
import { ModelUrlQuery } from '@/types/routes';
import { DataRecord } from '@/types/models';
import { PageInfo } from '@/types/requests';

import { isSafari } from '@/utils/browser';
import { hasTokenExpiredErrors, parseErrorResponse } from '@/utils/errors';
import { isNullorEmpty } from '@/utils/validation';

import ModelBouncer from '@/zendro/model-bouncer';
import {
  Table,
  TableBody,
  TableHeader,
  TablePagination,
  TableRecord,
  TableRow,
  TableSearch,
  UseOrderProps,
  useTableOrder,
  useTablePagination,
  UseTablePaginationProps,
  useTableSearch,
} from '@/zendro/model-table';

export interface ModelProps {
  group: string;
  model: string;
}

export const getStaticPaths: GetStaticPaths<ModelUrlQuery> = async () => {
  const paths = await getStaticModelPaths();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<ModelProps, ModelUrlQuery> = async (
  context
) => {
  const params = context.params as ModelUrlQuery;

  return {
    props: {
      key: params.model,
      group: params.group,
      model: params.model,
    },
  };
};

const Model: PageWithLayout<ModelProps> = (props) => {
  /* STATE */

  const csvExportAnchor = useRef<HTMLAnchorElement | null>(null);
  const csvTemplateAnchor = useRef<HTMLAnchorElement | null>(null);
  const [count, setCount] = useState<number>(0);
  const [records, setRecords] = useState<TableRecord[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    startCursor: null,
    endCursor: null,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  /* HOOKS */

  const auth = useAuth();
  const dialog = useDialog();
  const model = useModel(props.model);
  const router = useRouter();
  const classes = useStyles();
  const { showSnackbar } = useToastNotification();
  const { t } = useTranslation();
  const zendro = useZendroClient();

  const [searchText, setSearchText] = useState('');
  const tableSearch = useTableSearch({
    attributes: model.attributes,
    primaryKey: model.primaryKey,
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

  /* TOOLBAR ACTIONS */

  const handleExportCsv = async (): Promise<void> => {
    try {
      const response = await fetch(EXPORT_URL + `?model=${props.model}`, {
        headers: {
          Authorization: 'Bearer ' + auth.user?.token,
        },
      });

      const csvData = await response.text();

      if (csvExportAnchor.current) {
        const type = isSafari() ? 'application/csv' : 'text/csv';

        const blob = new Blob([csvData], { type });
        const dataURI = `data:${type};charset=utf-8,${csvData}`;

        const URL = window.URL || window.webkitURL;

        const downloadUrl =
          typeof URL.createObjectURL === 'undefined'
            ? dataURI
            : URL.createObjectURL(blob);

        csvExportAnchor.current.href = downloadUrl;
        csvExportAnchor.current.click();
        URL.revokeObjectURL(downloadUrl);
      }
    } catch (error) {
      showSnackbar(t('errors.server-error'), 'error', error);
    }
  };

  const handleExportTemplateCsv = async (): Promise<void> => {
    const { query, resolver } = zendro.queries[props.model].csvTableTemplate;
    try {
      const csvTemplate = await zendro.request<Record<string, string[]>>(query);
      const csvData = csvTemplate[resolver].join('\n');

      if (csvTemplateAnchor.current) {
        const type = isSafari() ? 'application/csv' : 'text/csv';

        const blob = new Blob([csvData], { type });
        const dataURI = `data:${type};charset=utf-8,${csvData}`;

        const downloadUrl =
          typeof URL.createObjectURL === 'undefined'
            ? dataURI
            : URL.createObjectURL(blob);

        csvTemplateAnchor.current.href = downloadUrl;
        csvTemplateAnchor.current.click();
        URL.revokeObjectURL(downloadUrl);
      }
    } catch (error) {
      const clientError = error as ExtendedClientError;

      if (
        clientError.response?.errors &&
        !hasTokenExpiredErrors(clientError.response.errors)
      )
        showSnackbar(t('errors.server-error'), 'error', error);
    }
  };

  const handleImportCsv = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const csvFile = event.target.files?.item(0);

    if (!csvFile) return;

    // Support selecting the same file
    event.target.value = '';
    // Send request
    const query = zendro.queries[props.model].bulkAddCsv.query;
    try {
      await zendro.legacyRequest(query, { csv_file: csvFile });
      showSnackbar(t('success.csv-import'), 'success');
    } catch (error) {
      const clientError = error as ExtendedClientError;

      if (
        clientError.response?.errors &&
        !hasTokenExpiredErrors(clientError.response.errors)
      )
        showSnackbar(t('errors.csv-import'), 'error', error);
    }
  };

  /* HANDLERS */

  const handleOnCreate = (): void => {
    router.push(`/${props.group}/${props.model}/new`);
  };

  const handleOnRead = (primaryKey: string | number): void => {
    router.push(`/${props.group}/${props.model}/details?id=${primaryKey}`);
  };

  const handleOnUpdate = (primaryKey: string | number): void => {
    router.push(`/${props.group}/${props.model}/edit?id=${primaryKey}`);
  };

  const handleOnDelete = (primaryKey: string | number): void => {
    dialog.openConfirm({
      title: t('dialogs.delete-confirm'),
      message: t('dialogs.delete-info', {
        recordId: primaryKey,
        modelName: props.model,
      }),
      okText: t('dialogs.ok-text'),
      cancelText: t('dialogs.cancel-text'),
      onOk: async () => {
        const query = zendro.queries[props.model].deleteOne.query;
        const variables = {
          [model.primaryKey]: primaryKey,
        };
        try {
          await zendro.request(query, { variables });
          mutateRecords();
          mutateCount();
        } catch (error) {
          parseAndDisplayErrorResponse(error);
        }
      },
    });
  };

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

  /* DATA FETCHING */

  // Records
  const { mutate: mutateRecords } = useSWR<
    { records: TableRecord[]; pageInfo: PageInfo } | undefined
  >(
    [tableSearch, tableOrder, tablePagination, zendro],
    async (
      tableSearch: QueryVariableSearch,
      tableOrder: QueryVariableOrder,
      tablePagination: QueryVariablePagination
    ) => {
      const { query, transform } = zendro.queries[props.model].readAll;
      const variables: QueryVariables = {
        search: tableSearch,
        order: tableOrder,
        pagination: tablePagination,
      };

      const data = await zendro.request<{
        pageInfo: PageInfo;
        records: DataRecord[];
      }>(query, {
        jq: transform,
        variables,
      });

      const records = data.records.map((record) => {
        return { data: record };
      }) as TableRecord[];

      return {
        records,
        pageInfo: data.pageInfo,
      };
    },
    {
      onSuccess: (data) => {
        if (data) {
          setRecords(data.records);
          setPageInfo(data.pageInfo);
        }
      },
      onError: parseAndDisplayErrorResponse,
      shouldRetryOnError: false,
    }
  );

  // Count
  const { mutate: mutateCount } = useSWR<
    Record<'count', number>,
    ExtendedClientError<Record<'count', number>> | Error
  >(
    [tableSearch, zendro],
    (tableSearch: QueryVariableSearch) => {
      const { query, transform } = zendro.queries[props.model].countAll;
      const variables: QueryVariables = { search: tableSearch };

      return zendro.request(query, {
        jq: transform,
        variables,
      });
    },
    {
      onSuccess: (data) => {
        if (!isNullorEmpty(data)) {
          setCount(data.count);
        }
      },
      onError: parseAndDisplayErrorResponse,
      shouldRetryOnError: false,
    }
  );

  return (
    <ModelBouncer object={props.model} action="read">
      <TableContainer className={classes.tableContainer}>
        <div className={classes.toolbar}>
          {model.apiPrivileges.textSearch && (
            <TableSearch
              placeholder={t('model-table.search-label', {
                modelName: props.model,
              })}
              value={searchText}
              onSearch={(value) => setSearchText(value)}
              // onChange={(event) => setSearchText(event.target.value)}
              onReset={() => setSearchText('')}
            />
          )}

          <section className={classes.toolbarActions} aria-label="Actions menu">
            <IconButton
              tooltip={t('model-table.reload', { modelName: props.model })}
              onClick={() => {
                mutateRecords();
                mutateCount();
              }}
              data-cy="model-table-reload"
              aria-label="Reload table"
            >
              <ReloadIcon />
            </IconButton>

            {model.permissions.create && model.apiPrivileges.create && (
              <IconButton
                tooltip={t('model-table.add', { modelName: props.model })}
                onClick={handleOnCreate}
                data-cy="model-table-add"
                aria-label="New record"
              >
                <AddIcon />
              </IconButton>
            )}

            {model.permissions.create && model.apiPrivileges.bulkAddCsv && (
              <IconButton
                component="label"
                tooltip={t('model-table.import', { modelName: props.model })}
                aria-label="Import from CSV"
              >
                <input
                  style={{ display: 'none' }}
                  type="file"
                  accept=".csv"
                  onChange={handleImportCsv}
                />
                <ImportIcon />
              </IconButton>
            )}

            <a
              ref={(ref) => (csvExportAnchor.current = ref)}
              download={props.model + '.csv'}
            >
              <IconButton
                component="label"
                tooltip={t('model-table.download-data', {
                  modelName: props.model,
                })}
                onClick={handleExportCsv}
                aria-label="Export to CSV"
              >
                <ExportIcon />
              </IconButton>
            </a>

            <a
              ref={(ref) => (csvTemplateAnchor.current = ref)}
              download={props.model + '.csv'}
            >
              <IconButton
                component="label"
                tooltip={t('model-table.download-template', {
                  modelName: props.model,
                })}
                onClick={handleExportTemplateCsv}
                aria-label="Download CSV template"
              >
                <ImportTemplateIcon />
              </IconButton>
            </a>
          </section>
        </div>
        <Table
          caption={t('model-table.caption', { modelName: props.model })}
          data-cy="record-table"
        >
          <TableHeader
            actionsColSpan={
              Object.entries(model.permissions).filter(
                ([action, allowed]) => allowed && action !== 'create'
              ).length
            }
            attributes={model.attributes}
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
            activeOrder={order?.sortField ?? model.primaryKey}
            orderDirection={order?.sortDirection ?? 'ASC'}
            data-cy="record-table-header"
            disableSort={!model.apiPrivileges.sort}
          />

          <TableBody>
            {records.map((record) => {
              const recordId = record.data[model.primaryKey] as string | number;
              return (
                <TableRow
                  attributes={model.attributes}
                  record={record.data}
                  key={recordId}
                  onDoubleClick={() => handleOnRead(recordId)}
                  hover
                >
                  {model.permissions.read && (
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
                  )}
                  {model.permissions.update && model.apiPrivileges.update && (
                    <MuiTableCell padding="checkbox">
                      <IconButton
                        tooltip={t('model-table.edit', { recordId })}
                        onClick={() => handleOnUpdate(recordId)}
                        className={classes.rowActionPrimary}
                        data-cy={`model-table-edit-${recordId}`}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </MuiTableCell>
                  )}
                  {model.permissions.delete && model.apiPrivileges.delete && (
                    <MuiTableCell padding="checkbox">
                      <IconButton
                        tooltip={t('model-table.delete', { recordId })}
                        onClick={() => handleOnDelete(recordId)}
                        className={classes.rowActionSecondary}
                        data-cy={`model-table-delete-${recordId}`}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </MuiTableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <TablePagination
          count={count}
          options={[5, 10, 15, 20, 25, 50]}
          paginationLimit={tablePagination.first ?? tablePagination.last}
          hasFirstPage={
            // storageTypes that don't support backward pagination default to hasPreviousPage = false.
            model.apiPrivileges.backwardPagination
              ? pageInfo.hasPreviousPage
              : true
          }
          hasLastPage={
            model.apiPrivileges.backwardPagination
              ? pageInfo.hasNextPage
              : undefined
          }
          hasPreviousPage={
            model.apiPrivileges.backwardPagination
              ? pageInfo.hasPreviousPage
              : undefined
          }
          hasNextPage={pageInfo.hasNextPage}
          startCursor={pageInfo.startCursor ?? null}
          endCursor={pageInfo.endCursor ?? null}
          onPageChange={(position, cursor) => {
            setPagination((state) => ({ ...state, position, cursor }));
          }}
          onPageSizeChange={(limit) => {
            setPagination((state) => ({ ...state, limit }));
          }}
        />
      </TableContainer>
    </ModelBouncer>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableContainer: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      flexGrow: 1,
      padding: theme.spacing(2, 4),
      marginTop: theme.spacing(8),
    },
    rowActionPrimary: {
      '&:hover': {
        backgroundColor: 'transparent',
        color: theme.palette.primary.main,
      },
    },
    rowActionSecondary: {
      '&:hover': {
        backgroundColor: 'transparent',
        color: theme.palette.secondary.main,
      },
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      '& section:only-child': {
        marginLeft: 'auto',
      },
    },
    toolbarActions: {
      display: 'flex',
      '& button:hover, label:hover': {
        color: theme.palette.primary.main,
      },
    },
  })
);

Model.layout = ModelLayout;
export default Model;
