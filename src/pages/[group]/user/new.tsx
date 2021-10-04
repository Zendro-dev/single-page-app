import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { createStyles, makeStyles } from '@mui/styles';

import { useDialog } from '@/components/dialog-popup';
import NavTabs from '@/components/nav-tabs';
import { useModel, useToastNotification, useZendroClient } from '@/hooks';
import { ModelLayout, PageWithLayout } from '@/layouts';

import { ExtendedClientError } from '@/types/errors';
import { DataRecord } from '@/types/models';
import { RecordUrlQuery } from '@/types/routes';
import { parseErrorResponse } from '@/utils/errors';

import ModelBouncer from '@/zendro/model-bouncer';
import AttributesForm, { ActionHandler } from '@/zendro/record-form';

const Record: PageWithLayout<RecordUrlQuery> = () => {
  const classes = useStyles();
  const dialog = useDialog();
  const model = useModel('user');
  const router = useRouter();
  const urlQuery = router.query as RecordUrlQuery;
  const { showSnackbar } = useToastNotification();
  const zendro = useZendroClient();
  const { t } = useTranslation();

  /* STATE */

  const [ajvErrors, setAjvErrors] = useState<Record<string, string[]>>();

  /* AUXILIARY */

  const parseAndDisplayErrorResponse = (
    error: Error | ExtendedClientError
  ): void => {
    const parsedError = parseErrorResponse(error);

    if (
      parsedError.genericError ||
      parsedError.networkError ||
      parsedError.graphqlErrors?.nonValidationErrors.length
    ) {
      showSnackbar(
        t('errors.server-error', { status: parsedError.status }),
        'error',
        parsedError
      );
    }

    // When creating or updating a record, display server validation errors
    if (parsedError.graphqlErrors?.validationErrors)
      setAjvErrors(parsedError.graphqlErrors.validationErrors);
  };

  /* ACTION HANDLERS */

  /**
   * Exit the form and go back to the model table page.
   */
  const handleOnCancel: ActionHandler = (formData, formStats) => {
    const confirmAbandonChanges = (): void => {
      dialog.openConfirm({
        title: t('dialogs.modified-info'),
        message: t('dialogs.leave-confirm'),
        okText: t('dialogs.ok-text'),
        cancelText: t('dialogs.cancel-text'),
        onOk: () => router.push(`/admin/user`),
      });
    };
    if (formStats.unset < formData.length) {
      confirmAbandonChanges();
    } else {
      router.push(`/admin/user`);
    }
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
        const request = zendro.queries['user'].createOne;

        const response = await zendro.request<Record<string, DataRecord>>(
          request.query,
          { variables: dataRecord }
        );

        const newId = response[request.resolver][model.primaryKey];
        router.push(`/admin/user/edit?id=${newId}`);
      } catch (error) {
        parseAndDisplayErrorResponse(error);
      }
    };

    if (formStats.clientErrors > 0) {
      return dialog.openMessage({
        title: t('dialogs.validation-title'),
        message: t('dialogs.validation-info'),
      });
    }

    if (formStats.unset > 0) {
      const idMsg = urlQuery.id ? ` (id: ${urlQuery.id})` : '';
      return dialog.openConfirm({
        title: t('dialogs.submit-empty-info', { idMsg }),
        message: t('dialogs.submit-empty-confirm'),
        okText: t('dialogs.ok-text'),
        cancelText: t('dialogs.cancel-text'),
        onOk: submit,
      });
    }

    submit();
  };

  return (
    <ModelBouncer object="user" action="create">
      <NavTabs
        id={urlQuery.id as string}
        active={router.asPath}
        tabs={[
          {
            type: 'link',
            label: 'attributes',
            href: router.asPath,
          },
          {
            type: 'group',
            label: 'associations',
            links: [],
          },
        ]}
      />

      <AttributesForm
        attributes={model.attributes}
        className={classes.root}
        disabled={false}
        errors={ajvErrors}
        formId={router.asPath}
        formView="create"
        modelName="user"
        actions={{
          cancel: handleOnCancel,
          submit:
            model.permissions.create && model.apiPrivileges.create
              ? handleOnSubmit
              : undefined,
        }}
      />
    </ModelBouncer>
  );
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      overflowY: 'auto',
    },
  })
);

Record.layout = ModelLayout;
export default Record;
