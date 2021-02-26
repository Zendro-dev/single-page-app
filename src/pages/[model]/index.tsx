import React from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import {
  getStaticModel,
  getStaticRoutes,
  getStaticModelPaths,
} from '@/utils/static';
import { DataModel, PathParams } from '@/types/models';
import { AppRoutes } from '@/types/routes';
import useAuth from '@/hooks/useAuth';
import ModelsLayout from '@/layouts/models-layout';
import TableToolBar from '@/components/tableToolBar/tableToolBar'

interface ModelProps {
  dataModel: DataModel;
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

  return {
    props: {
      dataModel,
      routes,
    },
  };
};

const Model: NextPage<ModelProps> = ({ routes }) => {
  useAuth({ redirectTo: '/' });
  const router = useRouter();

  return (
    <ModelsLayout brand="Zendro" routes={routes}>
      <div>{JSON.stringify(router.asPath)}</div>
      <div>{JSON.stringify(router.query)}</div>
      <TableToolBar></TableToolBar>
    </ModelsLayout>
  );
};
export default Model;
