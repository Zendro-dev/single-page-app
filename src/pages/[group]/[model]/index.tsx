import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';

import { TableCell as MuiTableCell, TableContainer } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  AddCircleOutline as AddIcon,
  Replay as ReloadIcon,
  Download as ExportIcon,
  SaveAlt as ImportTemplateIcon,
  Upload as ImportIcon,
  DeleteOutline as DeleteIcon,
  Edit as EditIcon,
  VisibilityTwoTone as DetailsIcon,
} from '@material-ui/icons';

import { getStaticModelPaths } from '@/build/routes';

import { IconButton } from '@/components/buttons';
import { EXPORT_URL } from '@/config/globals';

import {
  useDialog,
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
import { PageInfo, ReadManyResponse } from '@/types/requests';

import { hasTokenExpiredErrors } from '@/utils/errors';
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

  const model = useModel(props.model);
  const csvTemplateDownloadAnchor = useRef<HTMLAnchorElement | null>(null);
  const [count, setCount] = useState<number>(0);
  const [records, setRecords] = useState<TableRecord[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    startCursor: null,
    endCursor: null,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  /* HOOKS */

  const classes = useStyles();
  const { t } = useTranslation();
  const router = useRouter();
  const { showSnackbar } = useToastNotification();
  const dialog = useDialog();
  const zendro = useZendroClient();

  const [searchText, setSearchText] = useState('');
  const tableSearch = useTableSearch({
    attributes: model.schema.attributes,
    primaryKey: model.schema.primaryKey,
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

  const handleExportTableTemplate = async (): Promise<void> => {
    const { query, resolver } = zendro.queries[props.model].csvTableTemplate;
    try {
      const csvTemplate = await zendro.request<Record<string, string[]>>(query);
      const csvString = csvTemplate[resolver].join('\n');

      if (csvTemplateDownloadAnchor.current) {
        const downloadUrl = URL.createObjectURL(new Blob([csvString]));
        csvTemplateDownloadAnchor.current.href = downloadUrl;
        csvTemplateDownloadAnchor.current.click();
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
          [model.schema.primaryKey]: primaryKey,
        };
        try {
          await zendro.request(query, { variables });
          mutateRecords();
          mutateCount();
        } catch (error) {
          const clientError = error as ExtendedClientError;

          if (
            clientError.response?.errors &&
            !hasTokenExpiredErrors(clientError.response.errors)
          )
            showSnackbar(t('errors.server-error'), 'error', error);
        }
      },
    });
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
      onError: (error) => {
        const clientError = error as ExtendedClientError<ReadManyResponse>;

        if (!clientError.response) {
          showSnackbar((error as Error).message, 'error');
          return;
        }

        const genericError = clientError.response.error;
        const graphqlErrors = clientError.response.errors;

        if (graphqlErrors && !hasTokenExpiredErrors(graphqlErrors))
          showSnackbar(
            t('errors.server-error', { status: clientError.response.status }),
            'error',
            graphqlErrors
          );

        if (genericError)
          showSnackbar(
            t('errors.server-error', { status: clientError.response.status }),
            'error',
            genericError
          );
      },
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
      onError: (error) => {
        const clientError = error as ExtendedClientError<
          Record<string, number>
        >;

        if (!clientError.response) {
          showSnackbar((error as Error).message, 'error');
          return;
        }

        const genericError = clientError.response.error;
        const graphqlErrors = clientError.response.errors;

        if (graphqlErrors && !hasTokenExpiredErrors(graphqlErrors))
          showSnackbar(
            t('errors.server-error', { status: clientError.response.status }),
            'error',
            graphqlErrors
          );

        if (genericError)
          showSnackbar(
            t('errors.server-error', { status: clientError.response.status }),
            'error',
            genericError
          );
      },
      shouldRetryOnError: false,
    }
  );

  return (
    <ModelBouncer object={props.model} action="read">
      <TableContainer className={classes.root}>
        <div className={classes.toolbar}>
          <TableSearch
            placeholder={t('model-table.search-label', {
              modelName: props.model,
            })}
            value={searchText}
            onSearch={(value) => setSearchText(value)}
            // onChange={(event) => setSearchText(event.target.value)}
            onReset={() => setSearchText('')}
          />

          <div className={classes.toolbarActions}>
            <IconButton
              tooltip={t('model-table.reload', { modelName: props.model })}
              onClick={() => mutateRecords()}
            >
              <ReloadIcon />
            </IconButton>

            {model.permissions.create && (
              <IconButton
                tooltip={t('model-table.add', { modelName: props.model })}
                onClick={handleOnCreate}
              >
                <AddIcon />
              </IconButton>
            )}

            {model.permissions.create && (
              <IconButton
                component="label"
                tooltip={t('model-table.import', { modelName: props.model })}
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

            <form action={EXPORT_URL}>
              <input type="hidden" name="model" value={props.model} />
              <IconButton
                type="submit"
                tooltip={t('model-table.download-data', {
                  modelName: props.model,
                })}
              >
                <ExportIcon />
              </IconButton>
            </form>

            <a
              ref={(ref) => (csvTemplateDownloadAnchor.current = ref)}
              download="country.csv"
            >
              <IconButton
                component="label"
                tooltip={t('model-table.download-template', {
                  modelName: props.model,
                })}
                onClick={handleExportTableTemplate}
              >
                <ImportTemplateIcon />
              </IconButton>
            </a>
          </div>
        </div>
        <Table caption={t('model-table.caption', { modelName: props.model })}>
          <TableHeader
            actionsColSpan={
              Object.entries(model.permissions).filter(
                ([action, allowed]) => allowed && action !== 'create'
              ).length
            }
            attributes={model.schema.attributes}
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
            activeOrder={order?.sortField ?? model.schema.primaryKey}
            orderDirection={order?.sortDirection ?? 'ASC'}
          />

          <TableBody>
            {records.map((record) => {
              const recordId = record.data[model.schema.primaryKey] as
                | string
                | number;
              return (
                <TableRow
                  attributes={model.schema.attributes}
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
                      >
                        <DetailsIcon fontSize="small" />
                      </IconButton>
                    </MuiTableCell>
                  )}
                  {model.permissions.update && (
                    <MuiTableCell padding="checkbox">
                      <IconButton
                        tooltip={t('model-table.edit', { recordId })}
                        onClick={() => handleOnUpdate(recordId)}
                        className={classes.rowActionPrimary}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </MuiTableCell>
                  )}
                  {model.permissions.delete && (
                    <MuiTableCell padding="checkbox">
                      <IconButton
                        tooltip={t('model-table.delete', { recordId })}
                        onClick={() => handleOnDelete(recordId)}
                        className={classes.rowActionSecondary}
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
          hasFirstPage={pageInfo.hasPreviousPage}
          hasLastPage={pageInfo.hasNextPage}
          hasPreviousPage={pageInfo.hasPreviousPage}
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

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      flexGrow: 1,
      overflow: 'auto',
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
