import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import useSWR from 'swr';

import { createStyles, makeStyles, Tab } from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';

import { getStaticModel } from '@/build/models';
import { getStaticModelPaths } from '@/build/routes';

import AssociationsTable from '@/zendro/associations-table';
import AttributesForm, {
  ActionHandler,
  computeDiffs,
} from '@/zendro/record-form';

import {
  useDialog,
  usePermissions,
  useToastNotification,
  useZendroClient,
} from '@/hooks';
import { ModelsLayout, PageWithLayout } from '@/layouts';

import { ExtendedClientError } from '@/types/errors';
import { DataRecord, ParsedAssociation, ParsedAttribute } from '@/types/models';
import { ModelUrlQuery } from '@/types/routes';

import { parseGraphqlErrors } from '@/utils/errors';
import { getAttributeList, parseAssociations } from '@/utils/models';
import { queryRecord } from '@/utils/queries';
import { isEmptyObject } from '@/utils/validation';

import '@/i18n';
import { useTranslation } from 'react-i18next';

interface RecordProps {
  associations: ParsedAssociation[];
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
  associations,
  attributes,
  modelName,
  requests,
}) => {
  const dialog = useDialog();
  const { permissions } = usePermissions();
  const router = useRouter();
  const classes = useStyles();
  const { showSnackbar } = useToastNotification();
  const zendro = useZendroClient();
  const { t } = useTranslation();

  /* REQUEST */

  const urlQuery = router.query as ModelUrlQuery;

  /**
   * Query data from the GraphQL endpoint.
   */
  const { mutate: mutateRecord } = useSWR<
    Record<string, DataRecord>,
    ExtendedClientError<Record<string, DataRecord>>
  >(
    urlQuery.id ? [requests.read.query, urlQuery.id] : null,
    (query: string, id: string) =>
      zendro.request(query, { [requests.primaryKey]: id }),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onSuccess: (data) => {
        setRecordData(data);
        setAjvErrors(undefined);
      },
      onError: (error) => {
        showSnackbar(t('errors.server-error'), 'error', error);
      },
    }
  );

  /* STATE */

  const [recordData, setRecordData] = useState<Record<string, DataRecord>>();
  const [ajvErrors, setAjvErrors] = useState<Record<string, string[]>>();
  const [currentTab, setCurrentTab] = useState<'attributes' | 'associations'>(
    'attributes'
  );

  /* ACTION HANDLERS */

  /**
   * Exit the form and go back to the model table page.
   */
  const handleOnCancel: ActionHandler = (formData) => {
    let diffs = 0;

    if (recordData) {
      diffs = computeDiffs(formData, recordData[requests.read.resolver]);
    }

    if (diffs > 0) {
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
   * Delete the current record and return to the model table.
   */
  const handleOnDelete: ActionHandler = () => {
    dialog.openConfirm({
      title: t('dialogs.delete-confirm'),
      message: t('dialogs.delete-info', { recordId: urlQuery.id, modelName }),
      okText: t('dialogs.ok-text'),
      cancelText: t('dialogs.cancel-text'),
      onOk: async () => {
        if (!recordData) return;

        try {
          const { read, delete: _delete, primaryKey } = requests;
          const idValue = recordData[read.resolver][primaryKey];
          await zendro.request(_delete.query, {
            [primaryKey]: idValue,
          });
          router.push(`/${urlQuery.group}/${modelName}`);
        } catch (error) {
          showSnackbar(t('errors.server-error'), 'error', error);
        }
      },
    });
  };

  /**
   * Navigate to the record details page.
   */
  const handleOnDetails: ActionHandler = () => {
    router.push(`/${urlQuery.group}/${modelName}/details?id=${urlQuery.id}`);
  };

  /**
   * Reload page data.
   */
  const handleOnReload: ActionHandler = (formData) => {
    let diffs = 0;

    if (recordData) {
      diffs = computeDiffs(formData, recordData[requests.read.resolver]);
    }

    const revalidateData = async (): Promise<void> => {
      mutateRecord(undefined, true);
    };

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
        const response = await zendro.request<Record<string, DataRecord>>(
          requests.update.query,
          dataRecord
        );

        mutateRecord({
          [requests.read.resolver]: response[requests.update.resolver],
        });

        router.push(`/${urlQuery.group}/${modelName}`);
      } catch (error) {
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

  /* EVENT HANDLERS */

  /**
   * Set the tab index to a new value.
   * @param event change tab event
   * @param value new tab value
   */
  const handleOnTabChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: typeof currentTab
  ): void => {
    setCurrentTab(value);
  };

  return (
    <TabContext value={currentTab}>
      <TabList
        aria-label={`attributes and associations for ${modelName} record ${urlQuery.id}`}
        className={classes.tabList}
        onChange={handleOnTabChange}
        variant="fullWidth"
      >
        <Tab label={t('record-form.tab-attributes')} value="attributes" />
        <Tab
          label={t('record-form.tab-associations')}
          value="associations"
          disabled={associations.length === 0}
        />
      </TabList>
      <TabPanel value="attributes" className={classes.panelForm}>
        <AttributesForm
          attributes={attributes}
          className={classes.form}
          data={recordData?.[requests.read.resolver]}
          errors={ajvErrors}
          formId={router.asPath}
          formView="update"
          modelName={modelName}
          actions={{
            cancel: handleOnCancel,
            delete: handleOnDelete,
            read: permissions.read ? handleOnDetails : undefined,
            reload: handleOnReload,
            submit: handleOnSubmit,
          }}
        />
      </TabPanel>
      <TabPanel className={classes.panelTable} value="associations">
        <AssociationsTable
          associationView="update"
          associations={associations}
          attributes={attributes}
          modelName={modelName}
          recordId={urlQuery.id as string}
          primaryKey={requests.primaryKey}
        />
      </TabPanel>
    </TabContext>
  );
};

const useStyles = makeStyles((theme) =>
  createStyles({
    form: {
      border: '2px solid',
      borderRadius: 10,
      borderColor: theme.palette.grey[300],
      padding: theme.spacing(12, 10),
    },
    panelForm: {
      margin: theme.spacing(10, 0),
    },
    panelTable: {
      display: 'flex',
      flexGrow: 1,
      margin: theme.spacing(5, 2),
    },
    tabList: {
      margin: theme.spacing(0, 4),
    },
  })
);

Record.layout = ModelsLayout;
export default Record;
