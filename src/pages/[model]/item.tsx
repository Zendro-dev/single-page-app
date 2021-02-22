import React from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import {
  getStaticModels,
  getStaticModelPaths,
  getStaticRoutes,
} from '@/utils/static';
import { AppRoutes } from '@/types/routes';
import { DataModels, PathParams } from '@/types/models';
import useAuth from '@/hooks/useAuth';
import ModelsLayout from '@/layouts/models-layout';

interface RecordProps {
  dataModels: DataModels;
  routes: AppRoutes;
}

export const getStaticPaths: GetStaticPaths<PathParams> = async () => {
  const paths = await getStaticModelPaths();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<RecordProps> = async () => {
  const routes = await getStaticRoutes();
  const dataModels = await getStaticModels();

  return {
    props: {
      dataModels,
      routes,
    },
  };
};

const Record: NextPage<RecordProps> = ({ routes }) => {
  useAuth({ redirectTo: '/' });
  const router = useRouter();

  return (
    <ModelsLayout brand="Zendro" routes={routes}>
      <div>
        <div>{JSON.stringify(router.asPath)} </div>
        <div>{JSON.stringify(router.query)} </div>
      </div>
    </ModelsLayout>
  );
};
export default Record;
