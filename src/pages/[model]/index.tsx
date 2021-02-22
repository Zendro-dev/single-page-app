import React from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import {
  getStaticModel,
  getStaticRoutes,
  getStaticModelPaths,
} from '@/utils/static';
import { getAttributeList } from '@/utils/models';
import { DataModel, PathParams } from '@/types/models';
import { AppRoutes } from '@/types/routes';
import useAuth from '@/hooks/useAuth';
import ModelsLayout from '@/layouts/models-layout';
import EnhancedTable from '@/components/table/EnhancedTable';
interface ModelProps {
  tableColumns: unknown;
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

  return {
    props: {
      tableColumns,
      routes,
    },
  };
};

const Model: NextPage<ModelProps> = ({ tableColumns, routes }) => {
  useAuth({ redirectTo: '/' });
  const router = useRouter();

  return (
    <ModelsLayout brand="Zendro" routes={routes}>
      {/* <div>{JSON.stringify(router.asPath)}</div>
      <div>{JSON.stringify(router.query)}</div>
      <div>{JSON.stringify(dataModel)}</div> */}
      {/* <div>{JSON.stringify(tableColumns)}</div> */}
      <EnhancedTable attributes={tableColumns} />
    </ModelsLayout>
  );
};
export default Model;
