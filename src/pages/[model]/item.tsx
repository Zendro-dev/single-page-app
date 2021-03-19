import React, { useMemo, useReducer, useState } from 'react';
import { capitalize } from 'inflection';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import { Box, createStyles, makeStyles, Tab, Theme } from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';

import AttributesForm, {
  FormAction,
  FormActions,
  FormAttribute,
  FormView,
} from '@/components/attributes-form';

import AssociationList from '@/components/association-list';

import useAuth from '@/hooks/useAuth';
import { useDialog } from '@/hooks/useDialog';
import useToastNotification from '@/hooks/useToastNotification';
import ModelsLayout from '@/layouts/models';

import {
  AttributeValue,
  DataRecord,
  ParsedAssociation,
  ParsedAttribute,
  PathParams,
} from '@/types/models';
import { QueryVariables } from '@/types/queries';
import { AppRoutes } from '@/types/routes';

import { getAttributeList, parseAssociations } from '@/utils/models';
import { queryRecord } from '@/utils/queries';
import { requestOne, GraphqlResponse } from '@/utils/requests';
import {
  getStaticModelPaths,
  getStaticRoutes,
  getStaticModel,
} from '@/utils/static';
import { isNullorUndefined } from '@/utils/validation';
import { parseErrors } from '@/utils/error';
import { ErrorsAttribute } from '@/components/alert/attributes-error';
import { isNullorEmpty } from '@/utils/validation';

interface RecordProps {
  associations: ParsedAssociation[];
  attributes: ParsedAttribute[];
  modelName: string;
  routes: AppRoutes;
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
  const routes = await getStaticRoutes();
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
      routes,
      requests,
    },
  };
};

interface ParsedQuery {
  formView: FormView;
  queryId?: string;
}
/**
 * Compute the type of operation requested from the URL query.
 * @param query url query
 */
function parseUrlQuery(query: PathParams): ParsedQuery {
  const { read, update } = query;

  let formView: FormView;
  let queryId;

  if (read) {
    formView = 'read';
    queryId = read;
  } else if (update) {
    formView = 'update';
    queryId = update;
  } else {
    formView = 'create';
  }

  return {
    formView,
    queryId,
  };
}

interface InitAttributesArgs {
  formView: FormView;
  attributes: ParsedAttribute[];
  data?: DataRecord | null;
  errors?: Record<string, ErrorsAttribute>;
}
/**
 * Compose an array of form attributes from a combination of static types
 * and data returned from the server.
 * @param mode crud operation
 * @param attributes parsed data-model attributes
 * @param data attribute values
 * @param errors attribute error messages
 */
function initAttributes({
  formView,
  attributes,
  data,
  errors,
}: InitAttributesArgs): FormAttribute[] {
  return attributes.reduce(
    (attrArr, { name, type, primaryKey, automaticId }) => {
      if (formView === 'create' && automaticId) return attrArr;
      attrArr.push({
        name,
        type,
        primaryKey,
        readOnly: formView === 'update' && primaryKey,
        value: data ? data[name] : null,
        error: errors && errors[name] ? errors[name] : null,
      });
      return attrArr;
    },
    [] as FormAttribute[]
  );
}

type FormAttributesAction =
  | {
      type: 'update';
      payload: { key: string; value?: AttributeValue; error?: ErrorsAttribute };
    }
  | { type: 'reset'; payload: InitAttributesArgs };
function formAttributesReducer(
  state: FormAttribute[],
  action: FormAttributesAction
): FormAttribute[] {
  switch (action.type) {
    case 'reset': {
      return initAttributes(action.payload);
    }
    case 'update': {
      const { key, value, error } = action.payload;
      const attr = state.find(({ name }) => key === name);
      if (attr && value !== undefined) attr.value = value;
      if (attr && error) {
        attr.error = attr.error ? { ...attr.error, ...error } : error;
      }
      return [...state];
    }
  }
}

const Record: NextPage<RecordProps> = ({
  associations,
  attributes,
  modelName,
  routes,
  requests,
}) => {
  const { auth } = useAuth();
  const router = useRouter();
  const classes = useStyles();
  const dialog = useDialog();
  const { showSnackbar } = useToastNotification();
  const { queryId, formView } = parseUrlQuery(router.query as PathParams);
  const formId = `AttributesForm-${queryId ?? 'create'}`;

  const [formAttributes, dispatch] = useReducer(
    formAttributesReducer,
    { formView, attributes },
    initAttributes
  );

  const [tabIndex, setTabIndex] = useState<'attributes' | 'associations'>(
    'attributes'
  );

  /**
   * Composed read request from the url.
   */
  const variables = useMemo<QueryVariables | undefined>(() => {
    const idField = attributes.find(({ primaryKey }) => primaryKey);
    if (queryId && idField) return { [idField.name]: queryId };
  }, [attributes, queryId]);

  /**
   * Query data from the GraphQL endpoint.
   */
  const { data: graphqlResponse, mutate } = useSWR<GraphqlResponse<DataRecord>>(
    variables && auth?.user?.token
      ? [
          auth.user.token,
          requests.read.query,
          requests.read.resolver,
          variables,
        ]
      : null,
    requestOne,
    {
      revalidateOnFocus: false,
      onSuccess: ({ data, errors }) => {
        dispatch({
          type: 'reset',
          payload: {
            formView,
            attributes,
            data,
          },
        });
        if (!isNullorEmpty(errors)) {
          showSnackbar('Error in Graphql response', 'error', errors);
        }
      },
      onError: (errors) => {
        showSnackbar('Error in request to server', 'error', errors);
      },
    }
  );

  /**
   * Updates the attribute value in the internal SWR cache. Does not trigger a revalidation.
   * @param key name of the attribute to change in the form state
   */
  const handleOnChange = (key: string) => (value: AttributeValue) => {
    dispatch({ type: 'update', payload: { key, value } });
  };

  const handleOnError = (key: string) => (value: string | null) => {
    dispatch({
      type: 'update',
      payload: { key, error: { clientValidation: value } },
    });
  };

  /**
   * Execute a form action effect.
   * @param action form action to execute
   */
  const handleOnFormAction = (action: FormAction) => () => {
    switch (action) {
      /**
       * Navigate to the model table.
       */
      case 'cancel': {
        let diffData = 0;
        if (formView === 'create') {
          diffData = formAttributes.filter(({ value }) => value !== null)
            .length;
        } else if (formView === 'update' && graphqlResponse?.data) {
          const dataRecord = graphqlResponse.data;
          diffData = formAttributes.filter(
            ({ name, value }) => value !== dataRecord[name]
          ).length;
        }

        if (diffData > 0) {
          dialog.openConfirm({
            title: 'Some fields are modified.',
            message: 'Do you want to leave anyway?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: () => router.push(`/${modelName}`),
          });
        } else {
          router.push(`/${modelName}`);
        }

        break;
      }

      /**
       * Re-init form attributes to correctly set their read-only status. This would not
       * be required if the form sets readOnly (e.g. for primaryKey), but then the ability
       * to set other attributes to readOnly based on page logic is lost.
       */
      case 'read':
      case 'update': {
        router.push(`/${modelName}/item?${action}=${queryId}`);
        dispatch({
          type: 'reset',
          payload: {
            formView: action,
            attributes,
            data: graphqlResponse?.data,
          },
        });
        break;
      }

      /**
       * Send a delete request and, if sucessful, navigate to the model table.
       */
      case 'delete': {
        dialog.openConfirm({
          title: 'Are you sure you want to delete this item?',
          message: `Item with id ${queryId} in model ${modelName}.`,
          okText: 'YES',
          cancelText: 'NO',
          onOk: async () => {
            const idKey = attributes.find(({ primaryKey }) => primaryKey)?.name;
            const idValue = formAttributes.find(
              ({ name }) => idKey && name === idKey
            )?.value;

            try {
              if (isNullorUndefined(idKey) || isNullorUndefined(idValue))
                throw new Error(
                  'The record id was not set for a delete record action'
                );

              if (!auth.user?.token) return;

              const variables = { [idKey]: idValue };
              const { query, resolver } = requests.delete;
              await requestOne(auth.user.token, query, resolver, variables);
              router.push(`/${modelName}`);
            } catch (errors) {
              showSnackbar('Error in request to server', 'error', errors);
              console.error(errors);
            }
          },
        });
        break;
      }

      /**
       * Revalidate the data in the current request.
       */
      case 'reload': {
        mutate();
        break;
      }

      default:
        break;
    }
  };

  /**
   * Submit the form values to the Zendro GraphQL endpoint. Triggers a revalidation.
   */
  const handleOnSubmit = (formView: FormView) => async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (formView === 'read') return;

    const nonNullValues = formAttributes.reduce((acc, { value }) => {
      return isNullorEmpty(value) ? acc : (acc += 1);
    }, 0);

    const clientValidationErrors = formAttributes.reduce((acc, { error }) => {
      return error && error.clientValidation ? (acc += 1) : acc;
    }, 0);

    const submit = async (): Promise<void> => {
      const variables = formAttributes.reduce<Record<string, AttributeValue>>(
        (acc, { name, value }) => ({ ...acc, [name]: value }),
        {}
      );

      const { query, resolver } =
        formView === 'create' ? requests.create : requests.update;

      try {
        if (auth.user?.token) {
          const { errors } = await requestOne<DataRecord>(
            auth.user?.token,
            query,
            resolver,
            variables
          );

          if (!isNullorEmpty(errors)) {
            showSnackbar('Error in Graphql response', 'error', errors);
          }

          // TODO: if errors, update errors but not data
          if (formView === 'update' && !errors) mutate(variables);
          router.push(`/${modelName}`);
        }
      } catch (errors) {
        console.error([errors]);
        const { attributeErrors, generalErrors } = parseErrors(errors);
        for (const [key, error] of Object.entries(attributeErrors)) {
          dispatch({
            type: 'update',
            payload: { key, error },
          });
        }
        if (!isNullorEmpty(generalErrors)) {
          showSnackbar('Error in request to server', 'error', generalErrors);
        }
      }
    };

    if (clientValidationErrors > 0) {
      dialog.openConfirm({
        title: 'Validation errors',
        message: 'Please fix client side validation errors',
        hideOk: true,
        cancelText: 'OK',
      });
      return;
    }

    if (nonNullValues < formAttributes.length) {
      dialog.openConfirm({
        title: `Some fields are empty.${queryId ? ` id: ${queryId}` : ''}`,
        message: 'Do you want to continue anyway?',
        okText: 'YES',
        cancelText: 'NO',
        onOk: submit,
      });
      return;
    }

    submit();
  };

  /**
   * Set the tab index to a new value.
   * @param event change tab event
   * @param value new tab value
   */
  const handleOnTabChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: typeof tabIndex
  ): void => {
    setTabIndex(value);
  };

  return (
    <ModelsLayout brand="Zendro" routes={routes}>
      <TabContext value={tabIndex}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            onChange={handleOnTabChange}
            aria-label="lab API tabs example"
          >
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
            attributes={formAttributes}
            className={classes.form}
            disabled={formView === 'read'}
            formId={formId}
            onChange={handleOnChange}
            onError={handleOnError}
            onSubmit={handleOnSubmit(formView)}
            title={{
              prefix: capitalize(formView),
              main: modelName,
            }}
            actions={
              <FormActions
                permissions={auth.user?.permissions[modelName] ?? []}
                view={formView}
                formId={formId}
                onAction={handleOnFormAction}
              />
            }
          />
        </TabPanel>
        <TabPanel value="associations">
          <AssociationList modelName={modelName} associations={associations} />
        </TabPanel>
      </TabContext>
    </ModelsLayout>
  );
};
export default Record;

const useStyles = makeStyles((theme: Theme) =>
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
