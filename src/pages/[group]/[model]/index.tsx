import React, { useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { getStaticModel, getStaticModelPaths } from '@/utils/static';
import { getAttributeList } from '@/utils/models';
import { queryRecord, queryRecords, queryRecordsCount } from '@/utils/queries';
import { ModelUrlQuery } from '@/types/routes';
import { ModelsLayout, PageWithLayout } from '@/layouts';
import { TableRecord } from '@/components/records-table/table2';
import { createStyles, makeStyles, TableContainer } from '@material-ui/core';
import { DataRecord, ParsedAttribute } from '@/types/models';
import { PageInfo } from '@/types/requests';
import { useDialog, useToastNotification, useZendroClient } from '@/hooks';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { ExtendedClientError } from '@/types/errors';
import { QueryVariables, RawQuery } from '@/types/queries';
import { isNullorEmpty } from '@/utils/validation';
import {
  Table,
  TablePagination,
  TableToolBar,
  useVariables,
} from '@/components/records-table';

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
        const genericError = error.response.error;
        const graphqlErrors = error.response.errors;

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
    ExtendedClientError<Record<string, number>>
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
        const genericError = error.response.error;
        const graphqlErrors = error.response.errors;

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
      <TableToolBar
        modelName={modelName}
        onAdd={handleOnCreate}
        onReload={() => mutateRecords()}
        onSearch={handleSearch}
      />
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
    },
  })
);

Model.layout = ModelsLayout;
export default Model;
