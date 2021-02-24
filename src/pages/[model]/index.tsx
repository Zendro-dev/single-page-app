import React from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
// import { useRouter } from 'next/router';
import {
  getStaticModel,
  getStaticRoutes,
  getStaticModelPaths,
} from '@/utils/static';
import { getAttributeList } from '@/utils/models';
import { getInflections } from '@/utils/inflection';
import { getTableQuery } from '@/utils/queries';
import { PathParams } from '@/types/models';
import { AppRoutes } from '@/types/routes';
import useAuth from '@/hooks/useAuth';
import ModelsLayout from '@/layouts/models-layout';
import EnhancedTable from '@/components/table/EnhancedTable';

interface ModelProps {
  modelName: string;
  tableColumns: unknown;
  tableQuery: string;
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
  const routes = await getStaticRoutes();
  const dataModel = await getStaticModel(params.model);

  const tableColumns = getAttributeList(dataModel);
  const attributesList = tableColumns.map((attr) => attr.name).toString();

  const inflections = getInflections(dataModel.model);
  const tableQuery = getTableQuery(attributesList, inflections);

  return {
    props: {
      modelName: dataModel.model,
      tableColumns,
      tableQuery,
      routes,
    },
  };
};

const Model: NextPage<ModelProps> = ({
  modelName,
  tableColumns,
  tableQuery,
  routes,
}) => {
  useAuth({ redirectTo: '/' });
  // const router = useRouter();

  return (
    <ModelsLayout brand="Zendro" routes={routes}>
      {/* <div>{JSON.stringify(router.asPath)}</div>
      <div>{JSON.stringify(router.query)}</div>
      <div>{JSON.stringify(dataModel)}</div> */}
      {/* <div>{JSON.stringify(tableColumns)}</div> */}
      <EnhancedTable
        modelName={modelName}
        attributes={tableColumns}
        query={tableQuery}
      />
    </ModelsLayout>
  );
};
export default Model;
