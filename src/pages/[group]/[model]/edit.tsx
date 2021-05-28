import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';

import { createStyles, makeStyles, Tab } from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';

import { getStaticModelPaths } from '@/build/routes';
import { useDialog } from '@/components/dialog-popup';
import { useModel, useToastNotification, useZendroClient } from '@/hooks';
import { ModelLayout, PageWithLayout } from '@/layouts';

import { ExtendedClientError } from '@/types/errors';
import { DataRecord } from '@/types/models';
import { ModelUrlQuery } from '@/types/routes';
import { parseErrorResponse } from '@/utils/errors';

import AssociationsTable from '@/zendro/associations-table';
import ModelBouncer from '@/zendro/model-bouncer';
import AttributesForm, {
  ActionHandler,
  computeDiffs,
} from '@/zendro/record-form';

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
      key: params.model + '/edit',
      group: params.group,
      model: params.model,
    },
  };
};

const Record: PageWithLayout<RecordProps> = (props) => {
  const dialog = useDialog();
  const model = useModel(props.model);
  const router = useRouter();
  const urlQuery = router.query as ModelUrlQuery;
  const classes = useStyles();
  const { showSnackbar } = useToastNotification();
  const zendro = useZendroClient();
  const { t } = useTranslation();

  /* STATE */

  const [recordData, setRecordData] = useState<DataRecord>({
    [model.schema.primaryKey]: urlQuery.id ?? null,
  });
  const [ajvErrors, setAjvErrors] = useState<Record<string, string[]>>();
  const [currentTab, setCurrentTab] = useState<'attributes' | 'associations'>(
    'attributes'
  );

  /* AUXILIARY */

  const parseAndDisplayErrorResponse = (
    error: Error | ExtendedClientError
  ): void => {
    const parsedError = parseErrorResponse(error);

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
  };

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
            [model.schema.primaryKey]: recordData[model.schema.primaryKey],
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
    let diffs = 0;

    if (recordData) {
      diffs = computeDiffs(formData, recordData);
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
        const request = zendro.queries[props.model].updateOne;
        const response = await zendro.request<Record<string, DataRecord>>(
          request.query,
          { variables: dataRecord }
        );

        mutateRecord(response[request.resolver]);

        router.push(`/${props.group}/${props.model}`);
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
      const request = zendro.queries[props.model].readOne;
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
      onError: parseAndDisplayErrorResponse,
    }
  );

  return (
    <ModelBouncer object={props.model} action="update">
      <TabContext value={currentTab}>
        <TabList
          aria-label={`attributes and associations for ${props.model} record ${urlQuery.id}`}
          className={classes.tabList}
          onChange={handleOnTabChange}
          variant="fullWidth"
        >
          <Tab label={t('record-form.tab-attributes')} value="attributes" />
          <Tab
            label={t('record-form.tab-associations')}
            value="associations"
            disabled={model.schema.associations?.length === 0}
          />
        </TabList>
        <TabPanel className={classes.tabPanel} value="attributes">
          <AttributesForm
            attributes={model.schema.attributes}
            data={recordData}
            errors={ajvErrors}
            formId={router.asPath}
            formView="update"
            modelName={props.model}
            actions={{
              cancel: handleOnCancel,
              delete: handleOnDelete,
              read: model.permissions.read ? handleOnDetails : undefined,
              reload: handleOnReload,
              submit: handleOnSubmit,
            }}
          />
        </TabPanel>
        <TabPanel className={classes.tabPanel} value="associations">
          <AssociationsTable
            associationView="update"
            associations={model.schema.associations ?? []}
            attributes={model.schema.attributes}
            modelName={props.model}
            recordId={urlQuery.id as string}
            primaryKey={model.schema.primaryKey}
          />
        </TabPanel>
      </TabContext>
    </ModelBouncer>
  );
};

const useStyles = makeStyles((theme) =>
  createStyles({
    tabList: {
      marginBottom: theme.spacing(6),

      backgroundColor: theme.palette.action.hover,
      borderBottom: '1px solid',
      borderBottomColor: theme.palette.divider,

      '& .MuiTabs-indicator': {
        backgroundColor: 'transparent',
      },

      '& .MuiTab-root:hover:not(.Mui-selected)': {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.getContrastText(theme.palette.background.default),
      },

      '& .Mui-selected': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.getContrastText(theme.palette.primary.main),
        fontWeight: 'bold',
      },
    },
    tabPanel: {
      '&&:not([hidden])': {
        display: 'flex',
        flexGrow: 1,
        overflowY: 'auto',
      },
    },
  })
);

Record.layout = ModelLayout;
export default Record;
