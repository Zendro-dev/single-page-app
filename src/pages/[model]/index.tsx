import React from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
// import { useRouter } from 'next/router';
import {
  getStaticModel,
  getStaticRoutes,
  getStaticModelPaths,
} from '@/utils/static';
import { getAttributeList } from '@/utils/models';
import { queryModelTableRecords } from '@/utils/queries';
import { ParsedAttribute, PathParams } from '@/types/models';
import { AppRoutes } from '@/types/routes';
import useAuth from '@/hooks/useAuth';
import ModelsLayout from '@/layouts/models-layout';
import EnhancedTable from '@/components/table/EnhancedTable';
import { RawQuery } from '@/types/queries';

interface ModelProps {
  modelName: string;
  attributes: ParsedAttribute[];
  rawQuery: RawQuery;
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
  const rawQuery = queryModelTableRecords(modelName, attributes);

  return {
    props: {
      modelName,
      attributes,
      rawQuery,
      routes,
    },
  };
};

const Model: NextPage<ModelProps> = ({
  modelName,
  attributes,
  rawQuery,
  routes,
}) => {
  useAuth({ redirectTo: '/' });
  // const router = useRouter();

  return (
    <ModelsLayout brand="Zendro" routes={routes}>
      <EnhancedTable
        modelName={modelName}
        attributes={attributes}
        rawQuery={rawQuery}
      />
    </ModelsLayout>
  );
};
export default Model;
