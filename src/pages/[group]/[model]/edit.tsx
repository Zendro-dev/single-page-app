import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import useSWR from 'swr';

import { createStyles, makeStyles, Tab } from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';

import { getStaticModelPaths } from '@/build/routes';

import {
  useDialog,
  useModel,
  useToastNotification,
  useZendroClient,
} from '@/hooks';
import { ModelsLayout, PageWithLayout } from '@/layouts';

import { ExtendedClientError } from '@/types/errors';
import { DataRecord } from '@/types/models';
import { ModelUrlQuery } from '@/types/routes';

import { isTokenExpiredError, parseGraphqlErrors } from '@/utils/errors';
import { isEmptyObject } from '@/utils/validation';

import AssociationsTable from '@/zendro/associations-table';
import AttributesForm, {
  ActionHandler,
  computeDiffs,
} from '@/zendro/record-form';

interface RecordProps {
  modelName: string;
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
  return {
    props: {
      key: modelName + '/edit',
      modelName,
    },
  };
};

const Record: PageWithLayout<RecordProps> = ({ modelName }) => {
  const dialog = useDialog();
  const model = useModel(modelName);
  const router = useRouter();
  const urlQuery = router.query as ModelUrlQuery;
  const classes = useStyles();
  const { showSnackbar } = useToastNotification();
  const zendro = useZendroClient();

  /* STATE */

  const [recordData, setRecordData] = useState<DataRecord>({
    [model.schema.primaryKey]: urlQuery.id ?? null,
  });
  const [ajvErrors, setAjvErrors] = useState<Record<string, string[]>>();
  const [currentTab, setCurrentTab] = useState<'attributes' | 'associations'>(
    'attributes'
  );

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
      const request = zendro.queries[modelName].readOne;
      const variables = {
        [model.schema.primaryKey]: urlQuery.id,
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
            [model.schema.primaryKey]: urlQuery.id ?? null,
          }
        );
        setAjvErrors(undefined);
      },
      onError: (error) => {
        if (
          error.response?.errors &&
          !isTokenExpiredError(error.response.errors)
        )
          showSnackbar(
            'There was an error in the server request',
            'error',
            error
          );
      },
    }
  );

  /* ACTION HANDLERS */

  /**
   * Exit the form and go back to the model table page.
   */
  const handleOnCancel: ActionHandler = (formData) => {
    let diffs = 0;

    if (recordData) {
      diffs = computeDiffs(formData, recordData);
    }

    if (diffs > 0) {
      return dialog.openConfirm({
        title: 'Some fields have been modified.',
        message: 'Do you want to leave anyway?',
        okText: 'Yes',
        cancelText: 'No',
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
      title: 'Are you sure you want to delete this item?',
      message: `Item with id ${urlQuery.id} in model ${modelName}.`,
      okText: 'YES',
      cancelText: 'NO',
      onOk: async () => {
        if (!recordData) return;

        try {
          const query = zendro.queries[modelName].deleteOne.query;
          const variables = {
            [model.schema.primaryKey]: recordData[model.schema.primaryKey],
          };
          await zendro.request(query, { variables });
          router.push(`/${urlQuery.group}/${modelName}`);
        } catch (error) {
          if (
            error.response?.errors &&
            !isTokenExpiredError(error.response.errors)
          )
            showSnackbar('Error in request to server', 'error', error);
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
      diffs = computeDiffs(formData, recordData);
    }

    const revalidateData = async (): Promise<void> => {
      mutateRecord(undefined, true);
    };

    if (diffs > 0)
      dialog.openConfirm({
        title: 'Some fields have been modified.',
        message: 'Do you want to reload anyway?',
        okText: 'Yes',
        cancelText: 'No',
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
        const request = zendro.queries[modelName].updateOne;
        const response = await zendro.request<Record<string, DataRecord>>(
          request.query,
          { variables: dataRecord }
        );

        mutateRecord(response[request.resolver]);

        router.push(`/${urlQuery.group}/${modelName}`);
      } catch (error) {
        const clientError = error as ExtendedClientError<
          Record<string, DataRecord>
        >;
        const genericError = clientError.response.error;
        const graphqlErrors = clientError.response.errors;

        if (genericError) {
          showSnackbar(
            `The server returned a ${clientError.response.status} error`,
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
            `The server returned a ${clientError.response.status} error`,
            `error`,
            nonValidationErrors
          );
        }

        // Send validation errors to the form serverErrors
        if (!isEmptyObject(validationErrors)) setAjvErrors(validationErrors);
      }
    };

    if (formStats.clientErrors > 0) {
      return dialog.openMessage({
        title: 'Validation errors',
        message: 'Please fix client side validation errors',
      });
    }

    if (formStats.unset > 0) {
      const idMsg = urlQuery.id ? ` (id: ${urlQuery.id})` : '';
      return dialog.openConfirm({
        title: `Some fields are empty.${idMsg}`,
        message: 'Do you want to continue anyway?',
        okText: 'YES',
        cancelText: 'NO',
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
        <Tab label="Attributes" value="attributes" />
        <Tab
          label="Associations"
          value="associations"
          disabled={model.schema.associations?.length === 0}
        />
      </TabList>
      <TabPanel value="attributes" className={classes.panelForm}>
        <AttributesForm
          attributes={model.schema.attributes}
          className={classes.form}
          data={recordData}
          errors={ajvErrors}
          formId={router.asPath}
          formView="update"
          modelName={modelName}
          actions={{
            cancel: handleOnCancel,
            delete: handleOnDelete,
            read: model.permissions.read ? handleOnDetails : undefined,
            reload: handleOnReload,
            submit: handleOnSubmit,
          }}
        />
      </TabPanel>
      <TabPanel className={classes.panelTable} value="associations">
        <AssociationsTable
          associationView="update"
          associations={model.schema.associations ?? []}
          attributes={model.schema.attributes}
          modelName={modelName}
          recordId={urlQuery.id as string}
          primaryKey={model.schema.primaryKey}
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
