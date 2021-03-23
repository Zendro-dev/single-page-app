import React, { useMemo, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { request } from 'graphql-request';
import { GRAPHQL_URL } from '@/config/globals';

import { Box, createStyles, makeStyles, Tab } from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';

import AttributesForm, { ActionHandler } from '@/components/attributes-form';
import AssociationList from '@/components/association-list';

import { useAuth, useToastNotification } from '@/hooks';
import { ModelsLayout, PageWithLayout } from '@/layouts';

import {
  DataRecord,
  ParsedAssociation,
  ParsedAttribute,
  PathParams,
} from '@/types/models';
import { QueryVariables } from '@/types/queries';

import { getAttributeList, parseAssociations } from '@/utils/models';
import { queryRecord } from '@/utils/queries';
import { getStaticModelPaths, getStaticModel } from '@/utils/static';
import { ExtendedClientError } from '@/types/requests';
import { ModelUrlQuery } from '@/types/routes';

interface RecordProps {
  associations: ParsedAssociation[];
  attributes: ParsedAttribute[];
  modelName: string;
  requests: ReturnType<typeof queryRecord>;
}

export const getStaticPaths: GetStaticPaths<PathParams> = async () => {
  const paths = await getStaticModelPaths();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<RecordProps, PathParams> = async (
  context
) => {
  const params = context.params as PathParams;

  const modelName = params.model;
  const dataModel = await getStaticModel(modelName);

  const attributes = getAttributeList(dataModel, { excludeForeignKeys: true });
  const associations = parseAssociations(dataModel);
  const requests = queryRecord(modelName, attributes);

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
  const { auth } = useAuth();
  const router = useRouter();
  const classes = useStyles();
  const { showSnackbar } = useToastNotification();

  /* REQUEST */

  const query = router.query as ModelUrlQuery;

  /**
   * Composed read request from the url.
   */
  const readQueryVariables = useMemo<QueryVariables | undefined>(() => {
    const idField = attributes.find(({ primaryKey }) => primaryKey);
    if (query.id && idField) return { [idField.name]: query.id };
  }, [attributes, query.id]);

  /**
   * Query data from the GraphQL endpoint.
   */
  const { mutate: mutateRecord } = useSWR<
    Record<string, DataRecord>,
    ExtendedClientError<Record<string, DataRecord>>
  >(
    readQueryVariables && auth?.user?.token
      ? [GRAPHQL_URL, requests.read.query, readQueryVariables]
      : null,
    request,
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

  const [recordData, setRecordData] = useState<Record<string, DataRecord>>();

  /* STATE */

  const [currentTab, setCurrentTab] = useState<'attributes' | 'associations'>(
    'attributes'
  );

  /* ACTION HANDLERS */

  /**
   * Exit the form and go back to the model table page.
   */
  const handleOnCancel: ActionHandler = () => {
    router.push(`/${modelName}`);
  };

  /**
   * Navigate to the record details page.
   */
  const handleOnUpdate: ActionHandler = () => {
    router.push(`/${modelName}/edit?id=${query.id}`);
  };

  /**
   * Reload page data.
   */
  const handleOnReload: ActionHandler = () => {
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
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={handleOnTabChange} aria-label="lab API tabs example">
          <Tab label="Attributes" value="attributes" />
          <Tab
            label="Associations"
            value="associations"
            disabled={associations.length === 0}
          />
        </TabList>
      </Box>
      <TabPanel value="attributes">
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
            update: handleOnUpdate,
            reload: handleOnReload,
          }}
        />
      </TabPanel>
      <TabPanel value="associations">
        <AssociationList modelName={modelName} associations={associations} />
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
      margin: theme.spacing(10, 4),
      padding: theme.spacing(12, 10),
    },
  })
);

Record.layout = ModelsLayout;
export default Record;
