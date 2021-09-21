import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';
import { createStyles, makeStyles } from '@mui/styles';

import NavTabs from '@/components/nav-tabs';
import { useModel, useToastNotification, useZendroClient } from '@/hooks';
import { ModelLayout, PageWithLayout } from '@/layouts';

import { ExtendedClientError } from '@/types/errors';
import { DataRecord } from '@/types/models';
import { RecordUrlQuery } from '@/types/routes';
import { parseErrorResponse } from '@/utils/errors';

import ModelBouncer from '@/zendro/model-bouncer';
import AttributesForm, { ActionHandler } from '@/zendro/record-form';
import { Dialog, Box } from '@mui/material';

import readOneAttachment from '@/overrides/readOneAttachment';

import mime from 'mime-types';
import { FileIcon, defaultStyles, DefaultExtensionType } from 'react-file-icon';

const Record: PageWithLayout<RecordUrlQuery> = () => {
  const classes = useStyles();
  const model = useModel('attachment');
  const router = useRouter();
  const urlQuery = router.query as RecordUrlQuery;
  const { showSnackbar } = useToastNotification();
  const zendro = useZendroClient();
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const handleOpen = (): void => setOpen(true);
  const handleClose = (): void => setOpen(false);

  /* STATE */

  const [recordData, setRecordData] = useState<DataRecord>({
    [model.primaryKey]: urlQuery.id ?? null,
  });
  const [ajvErrors, setAjvErrors] = useState<Record<string, string[]>>();

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
  };

  /* ACTION HANDLERS */

  /**
   * Exit the form and go back to the model table page.
   */
  const handleOnCancel: ActionHandler = () => {
    router.push(`/models/attachment`);
  };

  /**
   * Reload page data.
   */
  const handleOnReload: ActionHandler = () => {
    const revalidateData = async (): Promise<void> => {
      mutateRecord(undefined, true);
    };

    revalidateData();
  };

  /**
   * Navigate to the record details page.
   */
  const handleOnUpdate: ActionHandler = () => {
    router.push(`/models/attachment/edit?id=${urlQuery.id}`);
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
    <ModelBouncer object="attachment" action="read">
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
        disabled
        errors={ajvErrors}
        formId={router.asPath}
        formView="read"
        modelName="attachment"
        actions={{
          cancel: handleOnCancel,
          reload: handleOnReload,
          update:
            model.permissions.update && model.apiPrivileges.update
              ? handleOnUpdate
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
                  // width="180"
                  // height="180"
                ></img>
              </div>
              <Dialog open={open} onClose={handleClose} maxWidth="xl">
                <a
                  href={recordData.fileURL as string}
                  download={recordData.fileName}
                >
                  <img alt="Not Found" src={recordData.fileURL as string}></img>
                </a>
              </Dialog>
            </>
          ) : (
            <a
              href={recordData.fileURL as string}
              download={recordData.fileName}
            >
              <Box maxWidth="3rem">
                <FileIcon
                  extension={fileExtension}
                  {...defaultStyles[fileExtension]}
                />
              </Box>
            </a>
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
