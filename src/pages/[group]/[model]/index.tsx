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
import globals from '@/config/globals';
import { useModel, useToastNotification, useZendroClient } from '@/hooks';
import { useSession } from 'next-auth/react';
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
import {
  csvProcessing,
  jsonProcessing,
  bulkDownload,
} from 'zendro-bulk-create';
import * as XLSX from 'xlsx';
import inflection from 'inflection';
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

  const dialog = useDialog();
  const model = useModel(props.model);
  const router = useRouter();
  const classes = useStyles();
  const { showSnackbar } = useToastNotification();
  const { t } = useTranslation();
  const zendro = useZendroClient();
  useSession();

  const [searchText, setSearchText] = useState('');
  const tableSearch = useTableSearch({
    attributes: model.attributes,
    primaryKey: model.primaryKey,
    searchText,
    spaSearchOperator: model.spaSearchOperator,
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
      const name = props.model.slice(0, 1).toLowerCase() + props.model.slice(1);
      const plural_name = inflection.pluralize(name);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await zendro.request(`{${plural_name}ZendroDefinition}`);
      const definition = res[`${plural_name}ZendroDefinition`];

      const attributes = Object.keys(definition.attributes);
      const addAssociations: Record<string, string> = {};
      let header = '';
      const associations = definition.associations;
      if (associations) {
        for (const [assocName, assocObj] of Object.entries<
          Record<string, string>
        >(associations)) {
          const addAssocName =
            'add' + assocName.slice(0, 1).toUpperCase() + assocName.slice(1);
          if (assocObj.sourceKey) {
            addAssociations[assocObj.sourceKey] = addAssocName;
          } else if (assocObj.keysIn == props.model) {
            addAssociations[assocObj.targetKey] = addAssocName;
          }
        }
      }
      const foreignKeys = Object.keys(addAssociations);
      for (const attr of attributes) {
        if (foreignKeys.includes(attr)) {
          header += addAssociations[attr] + globals.FIELD_DELIMITER;
        } else {
          header += attr + globals.FIELD_DELIMITER;
        }
      }
      header = header.slice(0, -1);
      const data = await bulkDownload(
        props.model,
        header,
        attributes,
        globals,
        zendro.request,
        true
      );
      if (csvExportAnchor.current) {
        const type = isSafari() ? 'application/csv' : 'text/csv';
        const blob = new Blob(data, { type });
        const csvData = await blob.text();
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

  const handleImportFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = event.target.files?.item(0);

    if (!file) return;

    // Support selecting the same file
    event.target.value = '';
    let data_model_definition;
    try {
      const file_extension = file.name.split('.').pop()?.toLowerCase();
      const name = props.model.slice(0, 1).toLowerCase() + props.model.slice(1);
      const plural_name = inflection.pluralize(name);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await zendro.request(`{${plural_name}ZendroDefinition}`);
      data_model_definition = res[`${plural_name}ZendroDefinition`];
      if (file_extension === 'csv') {
        console.log('file type: csv');
        await csvProcessing(
          file,
          data_model_definition,
          true,
          globals,
          zendro.request
        );
        console.log('finish validation!');
        await csvProcessing(
          file,
          data_model_definition,
          false,
          globals,
          zendro.request
        );
        console.log('finish uploading!');
        showSnackbar(t('success.csv-import'), 'success');
      } else if (file_extension === 'xlsx') {
        console.log('file type: xlsx');
        const work_book = XLSX.read(await file.arrayBuffer());
        let sheet_name = globals.SHEET_NAME
          ? globals.SHEET_NAME
          : work_book.SheetNames[0];
        sheet_name =
          globals.SHEET_NAME == ''
            ? work_book.SheetNames[0]
            : globals.SHEET_NAME;

        const work_sheet = work_book.Sheets[sheet_name];
        const records = XLSX.utils.sheet_to_json(work_sheet, { raw: false });

        await jsonProcessing(
          records,
          data_model_definition,
          true,
          globals,
          zendro.request
        );
        console.log('finish validation!');
        await jsonProcessing(
          records,
          data_model_definition,
          false,
          globals,
          zendro.request
        );
        console.log('finish uploading!');
        showSnackbar(t('success.csv-import'), 'success');
      } else if (file_extension === 'json') {
        console.log('file type: json');
        const records = JSON.parse(await file.text());
        await jsonProcessing(
          records,
          data_model_definition,
          true,
          globals,
          zendro.request
        );
        console.log('finish validation!');
        await jsonProcessing(
          records,
          data_model_definition,
          false,
          globals,
          zendro.request
        );
        console.log('finish uploading!');
        showSnackbar(t('success.csv-import'), 'success');
      } else {
        throw new Error('the file extension is not supported!');
      }
    } catch (error) {
      const clientError = error as ExtendedClientError;
      if (
        clientError.response?.errors &&
        !hasTokenExpiredErrors(clientError.response.errors)
      ) {
        showSnackbar(t('errors.csv-import'), 'error', error);
      } else if (
        Object.keys(error).length > 0 &&
        Object.keys(error)[0].includes('record')
      ) {
        showErrorTable(data_model_definition, error);
      }
    }
  };

  const showErrorTable = (
    data_model_definition: Record<string, any>,
    error: Record<string, Record<string, any>>
  ): void => {
    const internalID = data_model_definition['internalId'];
    const header = [
      'record_number',
      ...(internalID ? [internalID] : []),
      'fields',
      'error_message',
    ];
    const rows = [];
    for (const [num, info] of Object.entries(error)) {
      const fields = info.errors.extensions
        ? info.errors.extensions.validationErrors
          ? new Set(
              info.errors.extensions.validationErrors.map(
                (obj: Record<string, any>) => obj.instancePath.slice(1)
              )
            )
          : undefined
        : undefined;
      const row = [
        num,
        ...(internalID
          ? info.errors.extensions
            ? info.errors.extensions.input
              ? [info.errors.extensions.input[internalID]]
              : JSON.parse(
                  info.subquery
                    .split('(')[1]
                    .split(')')[0]
                    .split(',')
                    .filter(
                      (pair: string) => pair.split(':')[0] === internalID
                    )[0]
                    .split(':')[1]
                )
            : JSON.parse(
                info.subquery
                  .split('(')[1]
                  .split(')')[0]
                  .split(',')
                  .filter(
                    (pair: string) => pair.split(':')[0] === internalID
                  )[0]
                  .split(':')[1]
              )
          : []),
        ...(fields ? [[...fields].join(',')] : ['']),
        JSON.stringify(
          info.errors.extensions
            ? info.errors.message === 'validation failed'
              ? info.errors.extensions
              : {
                  message: info.errors.message,
                  extensions: info.errors.extensions,
                }
            : info.errors.errors ?? info
        ),
      ];
      rows.push(row);
    }
    const table = [header, rows];
    showSnackbar(t('errors.csv-import'), 'error', table);
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
                aria-label="Import from file"
              >
                <input
                  style={{ display: 'none' }}
                  type="file"
                  accept=".csv, .xlsx, .json"
                  onChange={handleImportFile}
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
              Object.entries(model.permissions).filter(([action, allowed]) => {
                let apiPrivilege = true;
                if (action === 'update' || action === 'delete')
                  apiPrivilege = model.apiPrivileges[action];
                return allowed && apiPrivilege && action !== 'create';
              }).length
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
