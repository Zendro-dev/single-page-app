import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';

import { createStyles, makeStyles } from '@mui/styles';
import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { Theme } from '@mui/material/styles';

import { useDialog } from '@/components/dialog-popup';
import NavTabs from '@/components/nav-tabs';
import { PasswordField } from '@/components/login-form';
import {
  useAuth,
  useModel,
  useToastNotification,
  useZendroClient,
} from '@/hooks';
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

const Record: PageWithLayout<RecordUrlQuery> = () => {
  const classes = useStyles();
  const dialog = useDialog();
  const model = useModel('user');
  const router = useRouter();
  const urlQuery = router.query as RecordUrlQuery;
  const { showSnackbar } = useToastNotification();
  const zendro = useZendroClient();
  const { t } = useTranslation();
  const auth = useAuth();

  const filteredAttributes = model.attributes.filter(
    (attribute) => attribute.name !== 'password'
  );

  /* STATE */

  const [recordData, setRecordData] = useState<DataRecord>({
    [model.primaryKey]: urlQuery.id ?? null,
  });
  const [ajvErrors, setAjvErrors] = useState<Record<string, string[]>>();

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');

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

  const handlePasswordDialogOpen = (): void => setPasswordDialogOpen(true);
  const handlePasswordDialogClose = (): void => {
    setPasswordDialogOpen(false);
    setNewPassword('');
  };

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
        onOk: () => router.push(`/admin/user`),
      });
    };

    if (recordData && computeDiffs(formData, recordData) > 0)
      confirmAbandonChanges();
    else {
      router.push(`/admin/user`);
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
        modelName: 'user',
      }),
      okText: t('dialogs.ok-text'),
      cancelText: t('dialogs.cancel-text'),
      onOk: async () => {
        if (!recordData) return;

        try {
          const query = zendro.queries['user'].deleteOne.query;
          const variables = {
            [model.primaryKey]: recordData[model.primaryKey],
          };
          await zendro.request(query, { variables });
          router.push(`/admin/user`);
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
    router.push(`/admin/user/details?id=${urlQuery.id}`);
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
    console.log({ dataRecord });

    const submit = async (): Promise<void> => {
      try {
        const request = zendro.queries['user'].updateOne;

        const response = await zendro.request<Record<string, DataRecord>>(
          request.query,
          { variables: dataRecord }
        );

        mutateRecord(response[request.resolver]);

        router.push(`/admin/user`);
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

  const handlePasswordChangeConfirm = async (): Promise<void> => {
    try {
      const request = zendro.queries['user'].updateOne;

      await zendro.request<Record<string, DataRecord>>(request.query, {
        variables: { id: recordData.id, password: newPassword },
      });
      setPasswordDialogOpen(false);
      showSnackbar('Password successfully updated', 'success');
    } catch (error) {
      parseAndDisplayErrorResponse(error);
    }
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
      const request = zendro.queries['user'].readOne;
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
    <ModelBouncer object="user" action="update">
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
              href: `/admin/user/details/${assoc.name}?id=${urlQuery.id}`,
            })),
          },
        ]}
      />

      <AttributesForm
        attributes={filteredAttributes}
        className={classes.root}
        data={recordData}
        errors={ajvErrors}
        formId={router.asPath}
        formView="update"
        modelName="user"
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
          auth.user?.id == recordData.id &&
          auth.user?.email === recordData.email ? (
            <>
              <Button variant="contained" onClick={handlePasswordDialogOpen}>
                Change password
              </Button>
              <Dialog
                open={passwordDialogOpen}
                onClose={handlePasswordDialogClose}
              >
                <DialogTitle>Change password</DialogTitle>
                <DialogContent className={classes.changePasswordDialog}>
                  <PasswordField
                    label="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <div className={classes.changePasswordDialogButtons}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handlePasswordDialogClose}
                    >
                      cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handlePasswordChangeConfirm}
                    >
                      confirm
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : undefined
        }
      />
    </ModelBouncer>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      overflowY: 'auto',
    },
    changePasswordDialog: {
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem',
    },
    changePasswordDialogButtons: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: '',
      justifyContent: 'flex-end',
      marginTop: '1rem',
      gap: '0.5rem',
    },
    changePasswordCancelButton: {
      backGroundColor: theme.palette.secondary.main,
    },
  })
);

Record.layout = ModelLayout;
export default Record;
