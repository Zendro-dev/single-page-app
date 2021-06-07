import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { createStyles, makeStyles, Tab } from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';

import { getStaticModelPaths } from '@/build/routes';
import { useModel, useToastNotification, useZendroClient } from '@/hooks';
import { ModelLayout, PageWithLayout } from '@/layouts';

import { ExtendedClientError } from '@/types/errors';
import { DataRecord } from '@/types/models';
import { ModelUrlQuery, RecordUrlQuery } from '@/types/routes';
import { parseErrorResponse } from '@/utils/errors';

import AssociationsTable from '@/zendro/associations-table';
import AttributesForm, { ActionHandler } from '@/zendro/record-form';
import ModelBouncer from '@/zendro/model-bouncer';

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
      key: params.model + '/details',
      group: params.group,
      model: params.model,
    },
  };
};

const Record: PageWithLayout<RecordProps> = (props) => {
  const model = useModel(props.model);
  const router = useRouter();
  const urlQuery = router.query as RecordUrlQuery;
  const classes = useStyles();
  const { showSnackbar } = useToastNotification();
  const zendro = useZendroClient();
  const { t } = useTranslation();

  /* STATE */

  const [recordData, setRecordData] = useState<DataRecord>({
    [model.schema.primaryKey]: urlQuery.id ?? null,
  });
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
      const request = zendro.queries[props.model].readOne;
      const response = await zendro.request<Record<string, DataRecord>>(
        request.query,
        {
          variables: { [model.schema.primaryKey]: urlQuery.id },
        }
      );
      if (response) return response[request.resolver];
    },
    {
      shouldRetryOnError: false,
      onSuccess: (data) =>
        setRecordData(
          data ?? {
            [model.schema.primaryKey]: urlQuery.id ?? null,
          }
        ),
      onError: (error) => {
        const parsedError = parseErrorResponse(error);

        if (
          parsedError.networkError ||
          parsedError.genericError ||
          parsedError.graphqlErrors?.nonValidationErrors.length
        ) {
          showSnackbar(t('errors.server-error'), 'error', parsedError);
        }
      },
    }
  );

  /* ACTION HANDLERS */

  /**
   * Exit the form and go back to the model table page.
   */
  const handleOnCancel: ActionHandler = () => {
    router.push(`/${props.group}/${props.model}`);
  };

  /**
   * Navigate to the record details page.
   */
  const handleOnUpdate: ActionHandler = () => {
    router.push(`/${props.group}/${props.model}/edit?id=${urlQuery.id}`);
  };

  /**
   * Reload page data.
   */
  const handleOnReload: ActionHandler = async () => {
    mutateRecord(undefined, true);
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
    <ModelBouncer object={props.model} action="read">
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
            disabled
            formId={router.asPath}
            formView="read"
            modelName={props.model}
            actions={{
              cancel: handleOnCancel,
              update: model.permissions.update ? handleOnUpdate : undefined,
              reload: handleOnReload,
            }}
          />
        </TabPanel>
        <TabPanel
          className={classes.tabPanel}
          value="associations"
          data-cy="details-associations-tab"
        >
          <AssociationsTable
            associationView="details"
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
