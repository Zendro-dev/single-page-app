import React, { useMemo, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { request } from 'graphql-request';
import { GRAPHQL_URL } from '@/config/globals';

import { Box, createStyles, makeStyles, Tab } from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';

import AttributesForm, {
  ActionHandler,
  FormAttribute,
} from '@/components/attributes-form';
import AssociationList from '@/components/association-list';

import { useAuth, useDialog, useToastNotification } from '@/hooks';
import { ModelsLayout, PageWithLayout } from '@/layouts';

import {
  DataRecord,
  ParsedAssociation,
  ParsedAttribute,
  PathParams,
} from '@/types/models';
import { QueryVariables } from '@/types/queries';
import { ExtendedClientError } from '@/types/requests';
import { ModelUrlQuery } from '@/types/routes';

import { getAttributeList, parseAssociations } from '@/utils/models';
import { queryRecord } from '@/utils/queries';
import { parseValidationErrors } from '@/utils/requests';
import { getStaticModelPaths, getStaticModel } from '@/utils/static';
import { isEmptyObject } from '@/utils/validation';

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
  const dialog = useDialog();
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
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onSuccess: (data) => {
        setRecordData(data);
        setAjvErrors(undefined);
      },
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
  const [ajvErrors, setAjvErrors] = useState<Record<string, string[]>>();

  /* STATE */

  const [currentTab, setCurrentTab] = useState<'attributes' | 'associations'>(
    'attributes'
  );

  /* AUXILIARY */

  const countDiffs = (formData: FormAttribute[]): number => {
    let diffCount = 0;

    if (recordData) {
      diffCount = formData.reduce((acc, { name, value }) => {
        const cachedValue = recordData[requests.read.resolver][name];
        // TODO: deep comparison for array types
        if (value !== cachedValue) acc++;
        return acc;
      }, diffCount);
    }

    return diffCount;
  };

  /* ACTION HANDLERS */

  /**
   * Exit the form and go back to the model table page.
   */
  const handleOnCancel: ActionHandler = (formData) => {
    const diffs = countDiffs(formData);

    if (diffs > 0) {
      return dialog.openConfirm({
        title: 'Some fields have been modified.',
        message: 'Do you want to leave anyway?',
        okText: 'Yes',
        cancelText: 'No',
        onOk: () => router.push(`/${modelName}`),
      });
    }

    router.push(`/${modelName}`);
  };

  /**
   * Delete the current record and return to the model table.
   */
  const handleOnDelete: ActionHandler = () => {
    dialog.openConfirm({
      title: 'Are you sure you want to delete this item?',
      message: `Item with id ${query.id} in model ${modelName}.`,
      okText: 'YES',
      cancelText: 'NO',
      onOk: async () => {
        if (!recordData) return;

        try {
          const idKey = attributes.find(({ primaryKey }) => primaryKey)?.name;
          if (!idKey)
            throw new Error('The record is missing a primary key attribute');

          const idValue = recordData[requests.read.resolver][idKey];
          if (!idValue)
            throw new Error('The record primary key has not been set');

          if (!auth.user?.token)
            throw new Error('The current user does not have an access token');

          await request(GRAPHQL_URL, requests.delete.query, {
            [idKey]: idValue,
          });
          router.push(`/${modelName}`);
        } catch (error) {
          showSnackbar('Error in request to server', 'error', error);
        }
      },
    });
  };

  /**
   * Navigate to the record details page.
   */
  const handleOnDetails: ActionHandler = () => {
    router.push(`/${modelName}/details?id=${query.id}`);
  };

  /**
   * Reload page data.
   */
  const handleOnReload: ActionHandler = (formData) => {
    const diffs = countDiffs(formData);

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
        if (!auth.user?.token)
          throw new Error('The current user does not have an access token');

        const response = await request<Record<string, DataRecord>>(
          GRAPHQL_URL,
          requests.update.query,
          dataRecord
        );

        mutateRecord({
          [requests.read.resolver]: response[requests.update.resolver],
        });
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

        if (graphqlErrors) {
          const validationErrors = parseValidationErrors(graphqlErrors);
          if (!isEmptyObject(validationErrors)) {
            showSnackbar(
              `The server returned a ${clientError.response.status} error`,
              `error`,
              clientError
            );
          }
          setAjvErrors(validationErrors);
        }
      }
    };

    if (formStats.clientErrors > 0) {
      return dialog.openAlert({
        title: 'Validation errors',
        message: 'Please fix client side validation errors',
      });
    }

    if (formStats.unset > 0) {
      const idMsg = query.id ? ` (id: ${query.id})` : '';
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
          errors={ajvErrors}
          formId={router.asPath}
          formView="update"
          modelName={modelName}
          actions={{
            cancel: handleOnCancel,
            delete: handleOnDelete,
            read: handleOnDetails,
            reload: handleOnReload,
            submit: handleOnSubmit,
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
