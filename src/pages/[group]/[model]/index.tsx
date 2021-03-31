import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { getStaticModel, getStaticModelPaths } from '@/utils/static';
import { getAttributeList } from '@/utils/models';
import {
  queryRecord,
  queryModelTableRecords,
  queryModelTableRecordsCount,
} from '@/utils/queries';
import { ModelUrlQuery } from '@/types/routes';
import { ModelsLayout, PageWithLayout } from '@/layouts';
import EnhancedTable, { EnhancedTableProps } from '@/components/records-table';

export const getStaticPaths: GetStaticPaths<ModelUrlQuery> = async () => {
  const paths = await getStaticModelPaths();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  EnhancedTableProps,
  ModelUrlQuery
> = async (context) => {
  const params = context.params as ModelUrlQuery;

  const modelName = params.model;
  const dataModel = await getStaticModel(modelName);

  const attributes = getAttributeList(dataModel, { excludeForeignKeys: true });
  const read = queryModelTableRecords(modelName, attributes);
  // TODO rename delete to something different to destructure
  const _delete = queryRecord(modelName, attributes).delete;
  const count = queryModelTableRecordsCount(modelName);

  return {
    props: {
      modelName,
      attributes,
      requests: {
        read,
        delete: _delete,
        count,
      },
      key: modelName,
    },
  };
};

const Model: PageWithLayout<EnhancedTableProps> = ({
  modelName,
  attributes,
  requests,
}) => {
  return (
    <EnhancedTable
      modelName={modelName}
      attributes={attributes}
      requests={requests}
      associationView="details"
    />
  );
};
Model.layout = ModelsLayout;
export default Model;
