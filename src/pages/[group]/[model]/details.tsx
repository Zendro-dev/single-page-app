import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import React, { useState } from 'react';

import { createStyles, makeStyles, Tab } from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';

import { getStaticModelPaths } from '@/build/routes';

import { useModel, useToastNotification, useZendroClient } from '@/hooks';
import { ModelsLayout, PageWithLayout } from '@/layouts';

import { ExtendedClientError } from '@/types/errors';
import { DataRecord } from '@/types/models';
import { ModelUrlQuery, RecordUrlQuery } from '@/types/routes';

import AssociationsTable from '@/zendro/associations-table';
import AttributesForm, { ActionHandler } from '@/zendro/record-form';

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
      key: modelName + '/details',
      modelName,
    },
  };
};

const Record: PageWithLayout<RecordProps> = ({ modelName }) => {
  const model = useModel(modelName);
  const router = useRouter();
  const classes = useStyles();
  const { showSnackbar } = useToastNotification();
  const zendro = useZendroClient();

  /* STATE */

  const [recordData, setRecordData] = useState<DataRecord>();
  const [currentTab, setCurrentTab] = useState<'attributes' | 'associations'>(
    'attributes'
  );

  /* REQUEST */

  const urlQuery = router.query as RecordUrlQuery;

  /**
   * Query data from the GraphQL endpoint.
   */
  const { mutate: mutateRecord } = useSWR<
    DataRecord | undefined,
    ExtendedClientError<Record<string, DataRecord>>
  >(
    urlQuery.id ? [zendro.queries[modelName].readOne.query, urlQuery.id] : null,
    async (query: string, id: string) => {
      const request = zendro.queries[modelName].readOne;
      const response = await zendro.request<Record<string, DataRecord>>(query, {
        [model.schema.primaryKey]: id,
      });
      if (response) return response[request.resolver];
    },
    {
      shouldRetryOnError: false,
      onSuccess: (data) => setRecordData(data),
      onError: (error) => {
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
  const handleOnCancel: ActionHandler = () => {
    router.push(`/${urlQuery.group}/${modelName}`);
  };

  /**
   * Navigate to the record details page.
   */
  const handleOnUpdate: ActionHandler = () => {
    router.push(`/${urlQuery.group}/${modelName}/edit?id=${urlQuery.id}`);
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
          disabled
          formId={router.asPath}
          formView="read"
          modelName={modelName}
          actions={{
            cancel: handleOnCancel,
            update: model.permissions.update ? handleOnUpdate : undefined,
            reload: handleOnReload,
          }}
        />
      </TabPanel>
      <TabPanel value="associations" className={classes.panelTable}>
        <AssociationsTable
          associationView="details"
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
      // borderBottom: '1px solid',
      // borderBottomColor: theme.palette.divider,
    },
  })
);

Record.layout = ModelsLayout;
export default Record;
