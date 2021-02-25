import React from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';

import useAuth from '@/hooks/useAuth';
import {
  getStaticModelPaths,
  getStaticRoutes,
  getStaticModel,
} from '@/utils/static';
import { getAttributeList, Attribute } from '@/utils/models';
import { PathParams } from '@/types/models';
import { AppRoutes } from '@/types/routes';

import ModelsLayout from '@/layouts/models-layout';
import AttributesForm from '@/components/forms/attributes-form';
import { createStyles, makeStyles, Theme } from '@material-ui/core';

interface RecordProps {
  attributes: Attribute[];
  modelName: string;
  routes: AppRoutes;
}

export const getStaticPaths: GetStaticPaths<PathParams> = async () => {
  const paths = await getStaticModelPaths();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<RecordProps, PathParams> = async (
  context
) => {
  const params = context.params as PathParams;

  const modelName = params.model;
  const routes = await getStaticRoutes();
  const dataModel = await getStaticModel(modelName);

  const attributes = getAttributeList(dataModel, { excludeForeignKeys: true });

  return {
    props: {
      attributes,
      modelName,
      routes,
    },
  };
};

const Record: NextPage<RecordProps> = ({ attributes, modelName, routes }) => {
  useAuth({ redirectTo: '/' });
  const router = useRouter();
  const { query } = router;
  const classes = useStyles();

  return (
    <ModelsLayout brand="Zendro" routes={routes}>
      <AttributesForm
        title={modelName}
        className={classes.form}
        attributes={attributes}
      />
    </ModelsLayout>
  );
};
export default Record;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      border: '2px solid',
      borderRadius: 10,
      borderColor: theme.palette.grey[300],
      margin: theme.spacing(4),
      padding: theme.spacing(10),
    },
  })
);
