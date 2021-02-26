import React, { useMemo } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';

import useAuth from '@/hooks/useAuth';
import {
  getStaticModelPaths,
  getStaticRoutes,
  getStaticModel,
} from '@/utils/static';
import { getAttributeList, Attribute } from '@/utils/models';
import { RecordPathParams } from '@/types/models';
import { AppRoutes } from '@/types/routes';

import ModelsLayout from '@/layouts/models-layout';
import AttributesForm from '@/components/forms/attributes-form';
import { createStyles, makeStyles, Theme } from '@material-ui/core';

interface RecordProps {
  attributes: Attribute[];
  modelName: string;
  routes: AppRoutes;
}

export const getStaticPaths: GetStaticPaths<RecordPathParams> = async () => {
  const paths = await getStaticModelPaths();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  RecordProps,
  RecordPathParams
> = async (context) => {
  const params = context.params as RecordPathParams;

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
  const classes = useStyles();
  const { read, update } = router.query as RecordPathParams;

  const operation = useMemo(() => {
    let mode: 'create' | 'read' | 'update';
    let id;

    if (read) {
      mode = 'read';
      id = read;
    } else if (update) {
      mode = 'update';
      id = update;
    } else {
      mode = 'create';
    }

    return {
      mode,
      id,
    };
  }, [read, update]);

  return (
    <ModelsLayout brand="Zendro" routes={routes}>
      <AttributesForm
        model={modelName}
        className={classes.form}
        attributes={attributes}
        operation={operation}
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
