// Ported from pages/[group]/[model]/[request]/index.tsx. Next-specific
// plumbing swapped:
//   - getStaticPaths/getStaticProps -> gone; group/model/request come from
//     useParams(), id from useRouteQuery() (merges path + query params the
//     way next/router's router.query used to).
//   - useRouter() -> useRouteQuery()
//   - useSession() (next-auth, bare call, unused result) -> removed
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';
import { createStyles, makeStyles } from '@mui/styles';
import { Repeat as ToManyIcon, RepeatOne as ToOneIcon } from '@mui/icons-material';

import { useDialog } from '@/components/dialog-popup';
import NavTabs from '@/components/nav-tabs';
import { useModel, useRouteQuery, useToastNotification, useZendroClient } from '@/hooks';

import { ExtendedClientError } from '@/types/errors';
import { DataRecord } from '@/types/models';
import { parseErrorResponse } from '@/utils/errors';

import ModelBouncer from '@/zendro/model-bouncer';
import AttributesForm, { ActionHandler, computeDiffs } from '@/zendro/record-form';

export default function RecordForm() {
  const { group = 'models', model: modelName = '', request = '' } = useParams();
  const classes = useStyles({});
  const dialog = useDialog();
  const model = useModel(modelName);
  const router = useRouteQuery();
  const { showSnackbar } = useToastNotification();
  const zendro = useZendroClient();
  const { t } = useTranslation();

  /* STATE */

  const [recordData, setRecordData] = useState<DataRecord>({
    [model.primaryKey]: router.query.id ?? null,
  });
  const [ajvErrors, setAjvErrors] = useState<Record<string, string[]>>();

  /* AUXILIARY */

  const parseAndDisplayErrorResponse = (error: Error | ExtendedClientError): void => {
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
    if ((request === 'edit' || request === 'new') && parsedError.graphqlErrors?.validationErrors)
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
        onOk: () => router.push(`/${group}/${modelName}`),
      });
    };

    if (request === 'edit' && recordData && computeDiffs(formData, recordData) > 0) {
      confirmAbandonChanges();
    } else if (request === 'new' && formStats.unset < formData.length) {
      confirmAbandonChanges();
    } else {
      router.push(`/${group}/${modelName}`);
    }
  };

  /**
   * Delete the current record and return to the model table.
   */
  const handleOnDelete: ActionHandler = () => {
    dialog.openConfirm({
      title: t('dialogs.delete-confirm'),
      message: t('dialogs.delete-info', {
        recordId: router.query.id,
        modelName: modelName,
      }),
      okText: t('dialogs.ok-text'),
      cancelText: t('dialogs.cancel-text'),
      onOk: async () => {
        if (!recordData) return;

        try {
          const query = zendro.queries[modelName].deleteOne.query;
          const variables = {
            [model.primaryKey]: recordData[model.primaryKey],
          };
          await zendro.request(query, { variables });
          router.push(`/${group}/${modelName}`);
        } catch (error) {
          parseAndDisplayErrorResponse(error as Error | ExtendedClientError);
        }
      },
    });
  };

  /**
   * Navigate to the record details page.
   */
  const handleOnDetails: ActionHandler = () => {
    router.push(`/${group}/${modelName}/details?id=${router.query.id}`);
  };

  /**
   * Reload page data.
   */
  const handleOnReload: ActionHandler = (formData) => {
    const revalidateData = async (): Promise<void> => {
      mutateRecord(undefined, true);
    };

    if (request === 'edit' && recordData) {
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
        const req =
          request === 'edit'
            ? zendro.queries[modelName].updateOne
            : zendro.queries[modelName].createOne;

        const response = await zendro.request<Record<string, DataRecord>>(req.query, {
          variables: dataRecord,
        });

        mutateRecord(response[req.resolver]);

        if (request === 'new') {
          const newId = response[req.resolver][model.primaryKey];
          router.push(`/${group}/${modelName}/edit?id=${newId}`);
        } else {
          router.push(`/${group}/${modelName}`);
        }
      } catch (error) {
        parseAndDisplayErrorResponse(error as Error | ExtendedClientError);
      }
    };

    if (formStats.clientErrors > 0) {
      return dialog.openMessage({
        title: t('dialogs.validation-title'),
        message: t('dialogs.validation-info'),
      });
    }

    if (formStats.unset > 0) {
      const idMsg = router.query.id ? ` (id: ${router.query.id})` : '';
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
    router.push(`/${group}/${modelName}/edit?id=${router.query.id}`);
  };

  /* REQUEST */

  /**
   * Query data from the GraphQL endpoint.
   */
  const { mutate: mutateRecord } = useSWR<
    DataRecord | undefined,
    ExtendedClientError<Record<string, DataRecord>>
  >(
    request === 'new' ? null : [zendro, router.query.id],
    async () => {
      const req = zendro.queries[modelName].readOne;
      const variables = {
        [model.primaryKey]: router.query.id,
      };
      const response = await zendro.request<Record<string, DataRecord>>(req.query, {
        variables,
      });
      if (response) return response[req.resolver];
    },
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onSuccess: (data) => {
        setRecordData(
          data ?? {
            [model.primaryKey]: router.query.id ?? null,
          }
        );
        setAjvErrors(undefined);
      },
      onError: parseAndDisplayErrorResponse,
    }
  );

  return (
    <ModelBouncer
      object={modelName}
      action={request === 'details' ? 'read' : request === 'edit' ? 'update' : 'create'}
    >
      <NavTabs
        id={router.query.id as string}
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
              request === 'new'
                ? []
                : model.associations?.map((assoc) => ({
                    type: 'link',
                    label: assoc.name,
                    href: `/${group}/${modelName}/${request}/${assoc.name}?id=${router.query.id}`,
                    icon: assoc.type.includes('to_many') ? ToManyIcon : ToOneIcon,
                  })),
          },
        ]}
      />

      <AttributesForm
        attributes={model.attributes}
        className={classes.root}
        data={recordData}
        disabled={request === 'details'}
        errors={ajvErrors}
        formId={router.asPath}
        formView={request === 'details' ? 'read' : request === 'edit' ? 'update' : 'create'}
        modelName={modelName}
        actions={{
          cancel: handleOnCancel,
          delete:
            request === 'edit' && model.permissions.delete && model.apiPrivileges.delete
              ? handleOnDelete
              : undefined,
          read: request === 'edit' && model.permissions.read ? handleOnDetails : undefined,
          reload: request === 'details' || request === 'edit' ? handleOnReload : undefined,
          update:
            request === 'details' && model.permissions.update && model.apiPrivileges.update
              ? handleOnUpdate
              : undefined,
          submit:
            (request === 'new' && model.permissions.create && model.apiPrivileges.create) ||
            (request === 'edit' && model.permissions.update && model.apiPrivileges.update)
              ? handleOnSubmit
              : undefined,
        }}
      />
    </ModelBouncer>
  );
}

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
