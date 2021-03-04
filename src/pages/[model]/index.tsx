import React from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
// import { useRouter } from 'next/router';
import {
  getStaticModel,
  getStaticRoutes,
  getStaticModelPaths,
} from '@/utils/static';
import { getAttributeList } from '@/utils/models';
import { crudRecord, queryModelTableRecords } from '@/utils/queries';
import { ParsedAttribute, PathParams } from '@/types/models';
import { AppRoutes } from '@/types/routes';
import useAuth from '@/hooks/useAuth';
import ModelsLayout from '@/layouts/models-layout';
import EnhancedTable from '@/components/table/enhanced-table';
import { RawQuery } from '@/types/queries';

interface ModelProps {
  modelName: string;
  attributes: ParsedAttribute[];
  requests: {
    read: RawQuery;
    delete: RawQuery;
  };
  routes: AppRoutes;
}

export const getStaticPaths: GetStaticPaths<PathParams> = async () => {
  const paths = await getStaticModelPaths();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<ModelProps, PathParams> = async (
  context
) => {
  const params = context.params as PathParams;

  const modelName = params.model;
  const routes = await getStaticRoutes();
  const dataModel = await getStaticModel(modelName);

  const attributes = getAttributeList(dataModel);
  const read = queryModelTableRecords(modelName, attributes);
  // TODO rename delete to something different to destructure
  const _delete = crudRecord(modelName, attributes).delete;

  return {
    props: {
      modelName,
      attributes,
      requests: {
        read,
        delete: _delete,
      },
      routes,
      key: modelName,
    },
  };
};

const Model: NextPage<ModelProps> = ({
  modelName,
  attributes,
  requests,
  routes,
}) => {
  useAuth({ redirectTo: '/' });
  // const router = useRouter();

  return (
    <ModelsLayout brand="Zendro" routes={routes}>
      <EnhancedTable
        modelName={modelName}
        attributes={attributes}
        requests={requests}
      />
    </ModelsLayout>
  );
};
export default Model;
