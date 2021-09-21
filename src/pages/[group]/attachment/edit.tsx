import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';
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
import AttributesForm, {
  ActionHandler,
  computeDiffs,
} from '@/zendro/record-form';

import readOneAttachment from '@/overrides/readOneAttachment';
import { Dialog, Box } from '@mui/material';

import mime from 'mime-types';
import { FileIcon, defaultStyles, DefaultExtensionType } from 'react-file-icon';

const Record: PageWithLayout<RecordUrlQuery> = () => {
  const classes = useStyles();
  const dialog = useDialog();
  const model = useModel('attachment');
  const router = useRouter();
  const urlQuery = router.query as RecordUrlQuery;
  const { showSnackbar } = useToastNotification();
  const zendro = useZendroClient();
  const { t } = useTranslation();

  /* STATE */

  const [recordData, setRecordData] = useState<DataRecord>({
    [model.primaryKey]: urlQuery.id ?? null,
  });
  const [ajvErrors, setAjvErrors] = useState<Record<string, string[]>>();

  const [open, setOpen] = useState(false);
  const handleOpen = (): void => setOpen(true);
  const handleClose = (): void => setOpen(false);

  const fileExtension = (recordData.id
    ? mime.extension(recordData['mimeType'] as string)
    : 'txt') as DefaultExtensionType;
  const isImage = recordData['mimeType']
    ? (recordData['mimeType'] as string).includes('image')
    : undefined;

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
  const handleOnCancel: ActionHandler = (formData) => {
    const confirmAbandonChanges = (): void => {
      dialog.openConfirm({
        title: t('dialogs.modified-info'),
        message: t('dialogs.leave-confirm'),
        okText: t('dialogs.ok-text'),
        cancelText: t('dialogs.cancel-text'),
        onOk: () => router.push(`/models/attachment`),
      });
    };

    if (recordData && computeDiffs(formData, recordData) > 0)
      confirmAbandonChanges();
    else {
      router.push(`/models/attachment`);
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
        modelName: 'attachment',
      }),
      okText: t('dialogs.ok-text'),
      cancelText: t('dialogs.cancel-text'),
      onOk: async () => {
        if (!recordData) return;

        try {
          const query = zendro.queries['attachment'].deleteOne.query;
          const variables = {
            [model.primaryKey]: recordData[model.primaryKey],
          };
          await zendro.request(query, { variables });
          router.push(`/models/attachment`);
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
    router.push(`/models/attachment/details?id=${urlQuery.id}`);
  };

  /**
   * Reload page data.
   */
  const handleOnReload: ActionHandler = (formData) => {
    const revalidateData = async (): Promise<void> => {
      mutateRecord(undefined, true);
    };

    if (recordData) {
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
        const request = zendro.queries['attachment'].updateOne;

        const response = await zendro.request<Record<string, DataRecord>>(
          request.query,
          { variables: dataRecord }
        );

        mutateRecord(response[request.resolver]);

        router.push(`/models/attachment`);
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

  /* REQUEST */

  /**
   * Query data from the GraphQL endpoint.
   */
  const { mutate: mutateRecord } = useSWR<
    DataRecord | undefined,
    ExtendedClientError<Record<string, DataRecord>>
  >(
    [zendro, urlQuery.id],
    async () => {
      const request = readOneAttachment;
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
    <ModelBouncer object="attachment" action="update">
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
            links: model.associations?.map((assoc) => ({
              type: 'link',
              label: assoc.name,
              href: `/models/attachment/details/${assoc.name}?id=${urlQuery.id}`,
            })),
          },
        ]}
      />

      <AttributesForm
        attributes={model.attributes}
        className={classes.root}
        data={recordData}
        errors={ajvErrors}
        formId={router.asPath}
        formView="update"
        modelName="attachment"
        actions={{
          cancel: handleOnCancel,
          delete:
            model.permissions.delete && model.apiPrivileges.delete
              ? handleOnDelete
              : undefined,
          read: model.permissions.read ? handleOnDetails : undefined,
          reload: handleOnReload,
          submit:
            model.permissions.update && model.apiPrivileges.update
              ? handleOnSubmit
              : undefined,
        }}
        info={
          recordData.fileURL &&
          recordData.urlThumbnail &&
          (isImage ? (
            <>
              <div
                role="button"
                tabIndex={0}
                onClick={handleOpen}
                onKeyDown={handleOpen}
                className={classes.image}
              >
                <img
                  alt="Not Found"
                  src={recordData.urlThumbnail as string}
                ></img>
              </div>
              <Dialog open={open} onClose={handleClose} maxWidth="xl">
                <img alt="Not Found" src={recordData.fileURL as string}></img>
              </Dialog>
            </>
          ) : (
            <Box maxWidth="3rem">
              <FileIcon
                extension={fileExtension}
                {...defaultStyles[fileExtension]}
              />
            </Box>
          ))
        }
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
    image: {
      cursor: 'pointer',
    },
  })
);

Record.layout = ModelLayout;
export default Record;
