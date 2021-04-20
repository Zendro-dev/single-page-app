import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import useSWR from 'swr';

import { TableContainer } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  AddCircleOutline as AddIcon,
  Replay as ReloadIcon,
  Download as ExportIcon,
  SaveAlt as ImportTemplateIcon,
  Upload as ImportIcon,
} from '@material-ui/icons';

import { IconButton } from '@/components/buttons';
import { EXPORT_URL } from '@/config/globals';
import {
  Table,
  TablePagination,
  TableRecord,
  TableSearch,
  useVariables,
} from '@/zendro/model-table';

import {
  useDialog,
  useModel,
  useToastNotification,
  useZendroClient,
} from '@/hooks';
import { ModelsLayout, PageWithLayout } from '@/layouts';

import { ExtendedClientError } from '@/types/errors';
import { QueryVariables, RawQuery } from '@/types/queries';
import { ModelUrlQuery } from '@/types/routes';
import { DataRecord, ParsedAttribute } from '@/types/models';
import { PageInfo, ReadManyResponse } from '@/types/requests';

import { getAttributeList } from '@/utils/models';
import { queryRecord, queryRecords, queryRecordsCount } from '@/utils/queries';
import { getStaticModel, getStaticModelPaths } from '@/utils/static';
import { isNullorEmpty } from '@/utils/validation';

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
  const read = queryRecords(modelName, attributes);
  const recordQueries = queryRecord(modelName, attributes, []);
  const count = queryRecordsCount(modelName);

  return {
    props: {
      modelName,
      attributes,
      requests: {
        read,
        delete: recordQueries.delete,
        count,
      },
      key: modelName,
    },
  };
};

export interface ModelProps {
  modelName: string;
  attributes: ParsedAttribute[];
  requests: {
    read: RawQuery;
    delete: RawQuery;
    count: RawQuery;
  };
}

const Model: PageWithLayout<ModelProps> = ({
  modelName,
  attributes,
  requests,
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
  const router = useRouter();
  const { showSnackbar } = useToastNotification();
  const dialog = useDialog();
  const zendro = useZendroClient();
  const {
    variables,
    handleOrder,
    handleSearch,
    handlePagination,
    handlePaginationLimitChange,
  } = useVariables(attributes, records, pageInfo);

  const query = router.query as ModelUrlQuery;

  const { query: readAll, transform } = zendro.queries[modelName].readAll;
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
      showSnackbar(
        'The data has been sent. A report with the status of the import process will be sent to your email.',
        'success'
      );
    } catch (error) {
      showSnackbar(
        'An error occurred while trying to import the CSV file. Please contact your administrator.',
        'error',
        error
      );
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
      console.log({ error });
      showSnackbar('There was an error with the request', 'error', error);
    }
  };

  /* HANDLERS */

  const handleOnCreate = (): void => {
    router.push(`/models/${modelName}/new`);
  };

  const handleOnRead = (primaryKey: string | number): void => {
    router.push(`/${query.group}/${modelName}/details?id=${primaryKey}`);
  };

  const handleOnUpdate = (primaryKey: string | number): void => {
    router.push(`/${query.group}/${modelName}/edit?id=${primaryKey}`);
  };

  const handleOnDelete = (primaryKey: string | number): void => {
    dialog.openConfirm({
      title: 'Are you sure you want to delete this item?',
      message: `Item with id ${primaryKey} in model ${modelName}.`,
      okText: 'YES',
      cancelText: 'NO',
      onOk: async () => {
        const idField = attributes[0].name;
        try {
          await zendro.request(requests.delete.query, {
            [idField]: primaryKey,
          });
          mutateRecords();
          mutateCount();
        } catch (error) {
          showSnackbar('Error in request to server', 'error', error);
        }
      },
    });
  };

  /* DATA FETCHING */

  // Records
  const { mutate: mutateRecords, isValidating: isValidatingRecords } = useSWR(
    [readAll, variables],
    (query: string, variables: QueryVariables) => {
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
          showSnackbar('Error in Graphql response', 'error', graphqlErrors);

        if (genericError)
          showSnackbar('Error in request to server', 'error', genericError);
      },
      shouldRetryOnError: false,
    }
  );

  // Count
  const { mutate: mutateCount } = useSWR<
    Record<string, number>,
    ExtendedClientError<Record<string, number>> | Error
  >(
    [requests.count.query, variables],
    (query: string, variables: QueryVariables) =>
      zendro.request(query, variables),
    {
      onSuccess: (data) => {
        if (!isNullorEmpty(data)) {
          setCount(data[requests.count.resolver]);
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
          showSnackbar('Error in Graphql response', 'error', graphqlErrors);

        if (genericError)
          showSnackbar('Error in request to server', 'error', genericError);
      },
      shouldRetryOnError: false,
    }
  );

  return (
    <TableContainer className={classes.root}>
      <div className={classes.toolbar}>
        <TableSearch onSearchClick={handleSearch} />

        <div className={classes.toolbarActions}>
          <IconButton
            tooltip={`Reload ${modelName} data`}
            onClick={() => mutateRecords()}
          >
            <ReloadIcon />
          </IconButton>

          {model.permissions.create && (
            <IconButton
              tooltip={`Add new ${modelName}`}
              onClick={handleOnCreate}
            >
              <AddIcon />
            </IconButton>
          )}

          {model.permissions.create && (
            <IconButton
              component="label"
              tooltip={`Import ${modelName} data from csv`}
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
              tooltip={`Download ${modelName} data as CSV`}
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
              tooltip={`Download ${modelName} CSV template`}
              onClick={handleExportTableTemplate}
            >
              <ImportTemplateIcon />
            </IconButton>
          </a>
        </div>
      </div>

      <Table
        attributes={attributes}
        records={records}
        activeOrder={variables.order?.field ?? attributes[0].name}
        orderDirection={variables.order?.order ?? 'ASC'}
        onRead={handleOnRead}
        onUpdate={handleOnUpdate}
        onDelete={handleOnDelete}
        onSetOrder={handleOrder}
        isValidatingRecords={isValidatingRecords}
        primaryKey={attributes[0].name}
      />
      <TablePagination
        onPagination={handlePagination}
        count={count}
        options={[5, 10, 15, 20, 25, 50]}
        paginationLimit={
          variables.pagination.first ?? variables.pagination.last
        }
        onPaginationLimitChange={handlePaginationLimitChange}
        hasFirstPage={pageInfo.hasPreviousPage}
        hasLastPage={pageInfo.hasNextPage}
        hasPreviousPage={pageInfo.hasPreviousPage}
        hasNextPage={pageInfo.hasNextPage}
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
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: theme.spacing(2),
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
