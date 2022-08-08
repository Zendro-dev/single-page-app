import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';
import { createStyles, makeStyles } from '@mui/styles';
import {
  Repeat as ToManyIcon,
  RepeatOne as ToOneIcon,
} from '@mui/icons-material';

import { getStaticRecordPaths } from '@/build/routes';
import { useDialog } from '@/components/dialog-popup';
import NavTabs from '@/components/nav-tabs';
import { useModel, useToastNotification, useZendroClient } from '@/hooks';
import { ModelLayout, PageWithLayout } from '@/layouts';

import { ExtendedClientError } from '@/types/errors';
import { DataRecord } from '@/types/models';
import { RecordUrlQuery } from '@/types/routes';
import { parseErrorResponse } from '@/utils/errors';

import ModelBouncer from '@/zendro/model-bouncer';
import AttributesForm, {
  ActionHandler,
  computeDiffs,
} from '@/zendro/record-form';

import { useSession } from 'next-auth/react';

export const getStaticPaths: GetStaticPaths<RecordUrlQuery> = async () => {
  const paths = await getStaticRecordPaths();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<RecordUrlQuery> = async (
  context
) => {
  const params = context.params as RecordUrlQuery;

  return {
    props: {
      key: `${params.group}/${params.model}/${params.request}`,
      ...params,
    },
  };
};

const Record: PageWithLayout<RecordUrlQuery> = (props) => {
  const classes = useStyles();
  const dialog = useDialog();
  const model = useModel(props.model);
  const router = useRouter();
  const urlQuery = router.query as RecordUrlQuery;
  const { showSnackbar } = useToastNotification();
  const zendro = useZendroClient();
  const { t } = useTranslation();
  useSession();

  /* STATE */

  const [recordData, setRecordData] = useState<DataRecord>({
    [model.primaryKey]: urlQuery.id ?? null,
  });
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
    if (
      (props.request === 'edit' || props.request === 'new') &&
      parsedError.graphqlErrors?.validationErrors
    )
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
        onOk: () => router.push(`/${props.group}/${props.model}`),
      });
    };

    if (
      props.request === 'edit' &&
      recordData &&
      computeDiffs(formData, recordData) > 0
    ) {
      confirmAbandonChanges();
    } else if (props.request === 'new' && formStats.unset < formData.length) {
      confirmAbandonChanges();
    } else {
      router.push(`/${props.group}/${props.model}`);
    }
  };

  /**
   * Delete the current record and return to the model table.
   */
  const handleOnDelete: ActionHandler = () => {
    dialog.openConfirm({
      title: t('dialogs.delete-confirm'),
      message: t('dialogs.delete-info', {
        recordId: urlQuery.id,
        modelName: props.model,
      }),
      okText: t('dialogs.ok-text'),
      cancelText: t('dialogs.cancel-text'),
      onOk: async () => {
        if (!recordData) return;

        try {
          const query = zendro.queries[props.model].deleteOne.query;
          const variables = {
            [model.primaryKey]: recordData[model.primaryKey],
          };
          await zendro.request(query, { variables });
          router.push(`/${props.group}/${props.model}`);
        } catch (error) {
          parseAndDisplayErrorResponse(error);
        }
      },
    });
  };

  /**
   * Navigate to the record details page.
   */
  const handleOnDetails: ActionHandler = () => {
    router.push(`/${props.group}/${props.model}/details?id=${urlQuery.id}`);
  };

  /**
   * Reload page data.
   */
  const handleOnReload: ActionHandler = (formData) => {
    const revalidateData = async (): Promise<void> => {
      mutateRecord(undefined, true);
    };

    if (props.request === 'edit' && recordData) {
      const diffs = computeDiffs(formData, recordData);

      if (diffs > 0)
        dialog.openConfirm({
          title: t('dialogs.modified-info'),
          message: t('dialogs.reload-confirm'),
          okText: t('dialogs.ok-text'),
          cancelText: t('dialogs.cancel-text'),
          onOk: revalidateData,
        });
      else {
        revalidateData();
      }
    } else {
      revalidateData();
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
        const request =
          props.request === 'edit'
            ? zendro.queries[props.model].updateOne
            : zendro.queries[props.model].createOne;

        const response = await zendro.request<Record<string, DataRecord>>(
          request.query,
          { variables: dataRecord }
        );

        mutateRecord(response[request.resolver]);

        if (props.request === 'new') {
          const newId = response[request.resolver][model.primaryKey];
          router.push(`/${props.group}/${props.model}/edit?id=${newId}`);
        } else {
          router.push(`/${props.group}/${props.model}`);
        }
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

  /**
   * Navigate to the record details page.
   */
  const handleOnUpdate: ActionHandler = () => {
    router.push(`/${props.group}/${props.model}/edit?id=${urlQuery.id}`);
  };

  /* REQUEST */

  /**
   * Query data from the GraphQL endpoint.
   */
  const { mutate: mutateRecord } = useSWR<
    DataRecord | undefined,
    ExtendedClientError<Record<string, DataRecord>>
  >(
    props.request === 'new' ? null : [zendro, urlQuery.id],
    async () => {
      const request = zendro.queries[props.model].readOne;
      const variables = {
        [model.primaryKey]: urlQuery.id,
      };
      const response = await zendro.request<Record<string, DataRecord>>(
        request.query,
        { variables }
      );
      if (response) return response[request.resolver];
    },
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onSuccess: (data) => {
        setRecordData(
          data ?? {
            [model.primaryKey]: urlQuery.id ?? null,
          }
        );
        setAjvErrors(undefined);
      },
      onError: parseAndDisplayErrorResponse,
    }
  );

  return (
    <ModelBouncer
      object={props.model}
      action={
        props.request === 'details'
          ? 'read'
          : props.request === 'edit'
          ? 'update'
          : 'create'
      }
    >
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
            links:
              props.request === 'new'
                ? []
                : model.associations?.map((assoc) => ({
                    type: 'link',
                    label: assoc.name,
                    href: `/${props.group}/${props.model}/${props.request}/${assoc.name}?id=${urlQuery.id}`,
                    icon: assoc.type.includes('to_many')
                      ? ToManyIcon
                      : ToOneIcon,
                  })),
          },
        ]}
      />

      <AttributesForm
        attributes={model.attributes}
        className={classes.root}
        data={recordData}
        disabled={props.request === 'details'}
        errors={ajvErrors}
        formId={router.asPath}
        formView={
          props.request === 'details'
            ? 'read'
            : props.request === 'edit'
            ? 'update'
            : 'create'
        }
        modelName={props.model}
        actions={{
          cancel: handleOnCancel,
          delete:
            props.request === 'edit' &&
            model.permissions.delete &&
            model.apiPrivileges.delete
              ? handleOnDelete
              : undefined,
          read:
            props.request === 'edit' && model.permissions.read
              ? handleOnDetails
              : undefined,
          reload:
            props.request === 'details' || props.request === 'edit'
              ? handleOnReload
              : undefined,
          update:
            props.request === 'details' &&
            model.permissions.update &&
            model.apiPrivileges.update
              ? handleOnUpdate
              : undefined,
          submit:
            (props.request === 'new' &&
              model.permissions.create &&
              model.apiPrivileges.create) ||
            (props.request === 'edit' &&
              model.permissions.update &&
              model.apiPrivileges.update)
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
