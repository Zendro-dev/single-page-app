import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { createStyles, makeStyles } from '@material-ui/core';

import { getStaticModelPaths } from '@/build/routes';

import {
  useDialog,
  useModel,
  useToastNotification,
  useZendroClient,
} from '@/hooks';
import { ModelLayout, PageWithLayout } from '@/layouts';

import { DataRecord } from '@/types/models';
import { ModelUrlQuery } from '@/types/routes';

import { parseErrorResponse } from '@/utils/errors';

import ModelBouncer from '@/zendro/model-bouncer';
import AttributesForm, { ActionHandler } from '@/zendro/record-form';

interface RecordProps {
  group: string;
  model: string;
}

export const getStaticPaths: GetStaticPaths<ModelUrlQuery> = async () => {
  const paths = await getStaticModelPaths();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  RecordProps,
  ModelUrlQuery
> = async (context) => {
  const params = context.params as ModelUrlQuery;
  return {
    props: {
      key: params.model + '/new',
      group: params.group,
      model: params.model,
    },
  };
};

const Record: PageWithLayout<RecordProps> = (props) => {
  const dialog = useDialog();
  const model = useModel(props.model);
  const router = useRouter();
  const classes = useStyles();
  const { showSnackbar } = useToastNotification();
  const zendro = useZendroClient();
  const { t } = useTranslation();

  /* STATE */

  const [ajvErrors, setAjvErrors] = useState<Record<string, string[]>>();

  /* ACTION HANDLERS */

  /**
   * Exit the form and go back to the model table page.
   */
  const handleOnCancel: ActionHandler = (formData, formStats) => {
    if (formStats.unset < formData.length) {
      return dialog.openConfirm({
        title: t('dialogs.modified-info'),
        message: t('dialogs.leave-confirm'),
        okText: t('dialogs.ok-text'),
        cancelText: t('dialogs.cancel-text'),
        onOk: () => router.push(`/${props.group}/${props.model}`),
      });
    }

    router.push(`/${props.group}/${props.model}`);
  };

  /**
   * Submit the form values to the Zendro GraphQL endpoint. Triggers a revalidation.
   */
  const handleOnSubmit: ActionHandler = (formData, formStats) => {
    const dataRecord = formData.reduce<DataRecord>(
      (acc, { name, value }) => ({ ...acc, [name]: value }),
      {}
    );

    const submit = async (): Promise<void> => {
      try {
        const createOne = zendro.queries[props.model].createOne;
        const response = await zendro.request<Record<string, DataRecord>>(
          createOne.query,
          { variables: dataRecord }
        );

        router.push(
          `/${props.group}/${props.model}/edit?id=${
            response[createOne.resolver][model.schema.primaryKey]
          }`
        );
      } catch (error) {
        const parsedError = parseErrorResponse<DataRecord>(error);

        if (parsedError.genericError) {
          showSnackbar(
            t('errors.server-error', { status: parsedError.status }),
            'error',
            parsedError.genericError
          );
        }

        if (parsedError.graphqlErrors) {
          // Send generic GraphQL errors to the notification queue
          if (parsedError.graphqlErrors.nonValidationErrors?.length) {
            showSnackbar(
              t('errors.server-error', { status: parsedError.status }),
              'error',
              parsedError.graphqlErrors.nonValidationErrors
            );
          }

          // Send validation errors to the form serverErrors
          if (parsedError.graphqlErrors.validationErrors)
            setAjvErrors(parsedError.graphqlErrors.validationErrors);
        }
      }
    };

    if (formStats.clientErrors > 0) {
      return dialog.openMessage({
        title: t('dialogs.validation-title'),
        message: t('dialogs.validation-info'),
      });
    }

    if (formStats.unset > 0) {
      return dialog.openConfirm({
        title: t('dialogs.submit-empty-info'),
        message: t('dialogs.submit-empty-confirm'),
        okText: t('dialogs.ok-text'),
        cancelText: t('dialogs.cancel-text'),
        onOk: submit,
      });
    }

    submit();
  };

  /* EVENT HANDLERS */

  return (
    <ModelBouncer object={props.model} action="create">
      <AttributesForm
        attributes={model.schema.attributes}
        className={classes.form}
        errors={ajvErrors}
        formId={router.asPath}
        formView="create"
        modelName={props.model}
        actions={{
          cancel: handleOnCancel,
          submit: handleOnSubmit,
        }}
      />
    </ModelBouncer>
  );
};

const useStyles = makeStyles((theme) =>
  createStyles({
    form: {
      border: '2px solid',
      borderRadius: 10,
      borderColor: theme.palette.grey[300],
      margin: theme.spacing(10, 4),
      padding: theme.spacing(12, 10),
    },
  })
);

Record.layout = ModelLayout;
export default Record;
