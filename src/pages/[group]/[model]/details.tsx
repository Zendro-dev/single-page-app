import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import React, { useState } from 'react';

import { createStyles, makeStyles, Tab } from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';

import { getStaticModel } from '@/build/models';
import { getStaticModelPaths } from '@/build/routes';

import AttributesForm, { ActionHandler } from '@/components/attributes-form';
import AssociationsTable from '@/zendro/associations-table';

import { usePermissions, useToastNotification, useZendroClient } from '@/hooks';
import { ModelsLayout, PageWithLayout } from '@/layouts';

import { ExtendedClientError } from '@/types/errors';
import { DataRecord, ParsedAssociation, ParsedAttribute } from '@/types/models';
import { ModelUrlQuery } from '@/types/routes';

import { getAttributeList, parseAssociations } from '@/utils/models';
import { queryRecord } from '@/utils/queries';

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
  const model = usePermissions();
  const router = useRouter();
  const classes = useStyles();
  const { showSnackbar } = useToastNotification();
  const zendro = useZendroClient();

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

  /* STATE */

  const [recordData, setRecordData] = useState<Record<string, DataRecord>>();
  const [currentTab, setCurrentTab] = useState<'attributes' | 'associations'>(
    'attributes'
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
          disabled={associations.length === 0}
        />
      </TabList>
      <TabPanel value="attributes" className={classes.panelForm}>
        <AttributesForm
          attributes={attributes}
          className={classes.form}
          data={recordData?.[requests.read.resolver]}
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
          associations={associations}
          attributes={attributes}
          modelName={modelName}
          recordId={model.id as string}
          primaryKey={attributes[0].name}
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
