import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
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

import { getStaticModel } from '@/build/models';
import { getStaticModelPaths } from '@/build/routes';

import { IconButton } from '@/components/buttons';
import { EXPORT_URL } from '@/config/globals';

import {
  useDialog,
  useModel,
  useToastNotification,
  useZendroClient,
} from '@/hooks';
import { ModelsLayout, PageWithLayout } from '@/layouts';

import { ExtendedClientError } from '@/types/errors';
import {
  QueryVariableOrder,
  QueryVariablePagination,
  QueryVariables,
  QueryVariableSearch,
} from '@/types/queries';
import { ModelUrlQuery } from '@/types/routes';
import { DataRecord, ParsedAttribute } from '@/types/models';
import { PageInfo, ReadManyResponse } from '@/types/requests';

import { getAttributeList } from '@/utils/models';
import { isNullorEmpty } from '@/utils/validation';

import '@/i18n';
import { useTranslation } from 'react-i18next';

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

  const modelName = params.model;
  const dataModel = await getStaticModel(modelName);

  const attributes = getAttributeList(dataModel, { excludeForeignKeys: true });
  const primaryKey = attributes[0].name;

  return {
    props: {
      modelName,
      attributes,
      primaryKey,
      key: modelName,
    },
  };
};

export interface ModelProps {
  modelName: string;
  attributes: ParsedAttribute[];
  primaryKey: string;
}

const Model: PageWithLayout<ModelProps> = ({
  modelName,
  attributes,
  primaryKey,
}) => {
  /* STATE */

  const model = useModel(modelName);
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
    attributes: attributes,
    primaryKey: primaryKey,
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

  const urlQuery = router.query as ModelUrlQuery;

  /* TOOLBAR ACTIONS */

  const handleImportCsv = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const csvFile = event.target.files?.item(0);

    if (!csvFile) return;

    // Support selecting the same file
    event.target.value = '';
    // Send request
    const query = zendro.queries[modelName].bulkAddCsv.query;
    try {
      await zendro.legacyRequest(query, { csv_file: csvFile });
      showSnackbar(t('success.csv-import'), 'success');
    } catch (error) {
      showSnackbar(t('errors.csv-import'), 'error', error);
    }
  };

  const handleExportTableTemplate = async (): Promise<void> => {
    const { query, resolver } = zendro.queries[modelName].csvTableTemplate;
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
      showSnackbar(t('errors.server-error'), 'error', error);
    }
  };

  /* HANDLERS */

  const handleOnCreate = (): void => {
    router.push(`/${urlQuery.group}/${modelName}/new`);
  };

  const handleOnRead = (primaryKey: string | number): void => {
    router.push(`/${urlQuery.group}/${modelName}/details?id=${primaryKey}`);
  };

  const handleOnUpdate = (primaryKey: string | number): void => {
    router.push(`/${urlQuery.group}/${modelName}/edit?id=${primaryKey}`);
  };

  const handleOnDelete = (primaryKey: string | number): void => {
    dialog.openConfirm({
      title: t('dialogs.delete-confirm'),
      message: t('dialogs.delete-info', { recordId: primaryKey, modelName }),
      okText: t('dialogs.ok-text'),
      cancelText: t('dialogs.cancel-text'),
      onOk: async () => {
        const idField = attributes[0].name;
        try {
          await zendro.request(zendro.queries[modelName].deleteOne.query, {
            [idField]: primaryKey,
          });
          mutateRecords();
          mutateCount();
        } catch (error) {
          showSnackbar(t('errors.server-error'), 'error', error);
        }
      },
    });
  };

  /* DATA FETCHING */

  // Records
  const { mutate: mutateRecords } = useSWR(
    [tableSearch, tableOrder, tablePagination],
    (
      tableSearch: QueryVariableSearch,
      tableOrder: QueryVariableOrder,
      tablePagination: QueryVariablePagination
    ) => {
      const { query, transform } = zendro.queries[modelName].readAll;
      const variables: QueryVariables = {
        search: tableSearch,
        order: tableOrder,
        pagination: tablePagination,
      };
      if (transform) {
        return zendro.metaRequest<{
          pageInfo: PageInfo;
          records: DataRecord[];
        }>(query, {
          jq: transform,
          variables,
        });
      } else {
        return zendro.request<{
          pageInfo: PageInfo;
          records: DataRecord[];
        }>(query, variables);
      }
    },
    {
      onSuccess: (data) => {
        if (!isNullorEmpty(data)) {
          // const connection = unwrapConnection(data, requests.read.resolver);
          const recordData = data.records.map((record) => {
            return { data: record };
          }) as TableRecord[];
          setRecords(recordData);
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

        if (graphqlErrors)
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
    [tableSearch],
    (tableSearch: QueryVariableSearch) => {
      const { query, transform } = zendro.queries[modelName].countAll;
      const variables: QueryVariables = { search: tableSearch };
      if (transform) {
        return zendro.metaRequest(query, {
          jq: transform,
          variables,
        });
      } else {
        return zendro.request(query, variables);
      }
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

        if (graphqlErrors)
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
    <TableContainer className={classes.root}>
      <div className={classes.toolbar}>
        <TableSearch
          placeholder={t('model-table.search-label', { modelName })}
          value={searchText}
          onSearch={(value) => setSearchText(value)}
          // onChange={(event) => setSearchText(event.target.value)}
          onReset={() => setSearchText('')}
        />

        <div className={classes.toolbarActions}>
          <IconButton
            tooltip={t('model-table.reload', { modelName })}
            onClick={() => mutateRecords()}
          >
            <ReloadIcon />
          </IconButton>

          {model.permissions.create && (
            <IconButton
              tooltip={t('model-table.add', { modelName })}
              onClick={handleOnCreate}
            >
              <AddIcon />
            </IconButton>
          )}

          {model.permissions.create && (
            <IconButton
              component="label"
              tooltip={t('model-table.import', { modelName })}
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
            <input type="hidden" name="model" value={modelName} />
            <IconButton
              type="submit"
              tooltip={t('model-table.download-data', { modelName })}
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
              tooltip={t('model-table.download-template', { modelName })}
              onClick={handleExportTableTemplate}
            >
              <ImportTemplateIcon />
            </IconButton>
          </a>
        </div>
      </div>
      <Table caption={t('model-table.caption', { modelName })}>
        <TableHeader
          actionsColSpan={
            Object.keys(model.permissions).filter(
              (action) => action !== 'create'
            ).length
          }
          attributes={attributes}
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
          activeOrder={order?.sortField ?? primaryKey}
          orderDirection={order?.sortDirection ?? 'ASC'}
        />

        <TableBody>
          {records.map((record) => {
            const recordId = record.data[primaryKey] as string | number;
            return (
              <TableRow
                attributes={attributes}
                record={record.data}
                key={recordId}
                onDoubleClick={() => handleOnRead(recordId)}
                hover
              >
                <MuiTableCell padding="checkbox">
                  <IconButton
                    tooltip={t('model-table.view', { recordId })}
                    onClick={() => handleOnRead(recordId)}
                    className={classes.rowActionPrimary}
                  >
                    <DetailsIcon fontSize="small" />
                  </IconButton>
                </MuiTableCell>
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

Model.layout = ModelsLayout;
export default Model;
