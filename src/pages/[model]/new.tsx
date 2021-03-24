import React, { useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import { Box, createStyles, makeStyles, Tab } from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';

import AttributesForm, { ActionHandler } from '@/components/attributes-form';
import AssociationList from '@/components/association-list';

import { useDialog, useToastNotification, useZendroClient } from '@/hooks';
import { ModelsLayout, PageWithLayout } from '@/layouts';

import {
  DataRecord,
  ParsedAssociation,
  ParsedAttribute,
  PathParams,
} from '@/types/models';
import { ExtendedClientError } from '@/types/requests';

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
  const dialog = useDialog();
  const router = useRouter();
  const classes = useStyles();
  const { showSnackbar } = useToastNotification();
  const zendro = useZendroClient();

  /* REQUEST */

  const [recordData, setRecordData] = useState<Record<string, DataRecord>>();
  const [ajvErrors, setAjvErrors] = useState<Record<string, string[]>>();

  /* STATE */

  const [currentTab, setCurrentTab] = useState<'attributes' | 'associations'>(
    'attributes'
  );

  /* ACTION HANDLERS */

  /**
   * Exit the form and go back to the model table page.
   */
  const handleOnCancel: ActionHandler = (formData, formStats) => {
    if (formStats.unset > 0) {
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
   * Submit the form values to the Zendro GraphQL endpoint. Triggers a revalidation.
   */
  const handleOnSubmit: ActionHandler = (formData, formStats) => {
    const dataRecord = formData.reduce<DataRecord>(
      (acc, { name, value }) => ({ ...acc, [name]: value }),
      {}
    );

    const submit = async (): Promise<void> => {
      try {
        const { create } = requests;
        const response = await zendro.request<Record<string, DataRecord>>(
          create.query,
          dataRecord
        );

        setRecordData(response);
        router.push(`/${modelName}`);
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
          if (isEmptyObject(validationErrors)) {
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
      return dialog.openConfirm({
        title: `Some fields are empty.`,
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
          data={recordData?.[requests.create.resolver]}
          errors={ajvErrors}
          formId={router.asPath}
          formView="create"
          modelName={modelName}
          actions={{
            cancel: handleOnCancel,
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
