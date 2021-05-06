import React, { useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import { createStyles, makeStyles } from '@material-ui/core';

import { getStaticModel } from '@/build/models';
import { getStaticModelPaths } from '@/build/routes';

import { useDialog, useToastNotification, useZendroClient } from '@/hooks';
import { ModelsLayout, PageWithLayout } from '@/layouts';

import { ExtendedClientError } from '@/types/errors';
import { DataRecord, ParsedAttribute } from '@/types/models';
import { ModelUrlQuery } from '@/types/routes';

import { parseGraphqlErrors } from '@/utils/errors';
import { getAttributeList, parseAssociations } from '@/utils/models';
import { queryRecord } from '@/utils/queries';
import { isEmptyObject } from '@/utils/validation';

import AttributesForm, { ActionHandler } from '@/zendro/record-form';

import '@/i18n';
import { useTranslation } from 'react-i18next';

interface RecordProps {
  attributes: ParsedAttribute[];
  modelName: string;
  requests: ReturnType<typeof queryRecord>;
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

  const modelName = params.model;
  const dataModel = await getStaticModel(modelName);

  const attributes = getAttributeList(dataModel, { excludeForeignKeys: true });
  const associations = parseAssociations(dataModel);
  const requests = queryRecord(modelName, attributes, associations);

  return {
    props: {
      key: modelName,
      modelName,
      attributes,
      associations,
      requests,
    },
  };
};

const Record: PageWithLayout<RecordProps> = ({
  attributes,
  modelName,
  requests,
}) => {
  const dialog = useDialog();
  const router = useRouter();
  const classes = useStyles();
  const { showSnackbar } = useToastNotification();
  const zendro = useZendroClient();
  const urlQuery = router.query as ModelUrlQuery;
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
        onOk: () => router.push(`/${urlQuery.group}/${modelName}`),
      });
    }

    router.push(`/${urlQuery.group}/${modelName}`);
  };

  /**
   * Submit the form values to the Zendro GraphQL endpoint. Triggers a revalidation.
   */
  const handleOnSubmit: ActionHandler = (formData, formStats) => {
    const dataRecord = formData.reduce<DataRecord>(
      (acc, { name, value }) => ({ ...acc, [name]: value }),
      {}
    );
    const primaryKey = attributes[0].name;
    const submit = async (): Promise<void> => {
      try {
        const { create } = requests;
        const response = await zendro.request<Record<string, DataRecord>>(
          create.query,
          dataRecord
        );

        router.push(
          `/${urlQuery.group}/${modelName}/edit?id=${
            response[create.resolver][primaryKey]
          }`
        );
      } catch (error) {
        setAjvErrors(undefined);
        const clientError = error as ExtendedClientError<
          Record<string, DataRecord>
        >;
        const genericError = clientError.response.error;
        const graphqlErrors = clientError.response.errors;

        if (genericError) {
          showSnackbar(
            t('errors.server-error', { status: clientError.response.status }),
            'error',
            clientError
          );
        }

        if (!graphqlErrors) return;
        const { nonValidationErrors, validationErrors } = parseGraphqlErrors(
          graphqlErrors
        );

        // Send generic GraphQL errors to the notification queue
        if (nonValidationErrors.length > 0) {
          showSnackbar(
            t('errors.server-error', { status: clientError.response.status }),
            'error',
            nonValidationErrors
          );
        }

        // Send validation errors to the form serverErrors
        if (!isEmptyObject(validationErrors)) setAjvErrors(validationErrors);
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
    <AttributesForm
      attributes={attributes}
      className={classes.form}
      errors={ajvErrors}
      formId={router.asPath}
      formView="create"
      modelName={modelName}
      actions={{
        cancel: handleOnCancel,
        submit: handleOnSubmit,
      }}
    />
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

Record.layout = ModelsLayout;
export default Record;
