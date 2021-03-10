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
import ModelsLayout from '@/layouts/models-layout';

import {
  AttributeValue,
  ParsedAssociation,
  ParsedAttribute,
  RecordPathParams,
} from '@/types/models';
import { RawQuery, ComposedQuery } from '@/types/queries';
import { AppRoutes } from '@/types/routes';

import { getAttributeList, parseAssociations } from '@/utils/models';
import { queryRecord } from '@/utils/queries';
import { requestOne } from '@/utils/requests';
import {
  getStaticModelPaths,
  getStaticRoutes,
  getStaticModel,
} from '@/utils/static';
import { isNullorUndefined } from '@/utils/validation';
import ConfirmationDialog from '@/components/dialog/confirmation-dialog';
import { isNullorEmpty } from '@/utils/validation';

interface RecordProps {
  associations: ParsedAssociation[];
  attributes: ParsedAttribute[];
  modelName: string;
  routes: AppRoutes;
  requests: ReturnType<typeof queryRecord>;
}

export const getStaticPaths: GetStaticPaths<RecordPathParams> = async () => {
  const paths = await getStaticModelPaths();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  RecordProps,
  RecordPathParams
> = async (context) => {
  const params = context.params as RecordPathParams;

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
function parseUrlQuery(query: RecordPathParams): ParsedQuery {
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
  data?: Record<string, AttributeValue> | null;
  errors?: Record<string, string | undefined>;
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
        error: errors ? errors[name] : null,
      });
      return attrArr;
    },
    [] as FormAttribute[]
  );
}

type FormAttributesAction =
  | { type: 'update'; payload: { key: string; value: AttributeValue } }
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
      const { key, value } = action.payload;
      const attr = state.find(({ name }) => key === name);
      if (attr) attr.value = value;
      return [...state];
    }
  }
}

/**
 * Compose the run-time read-one query using static and dynamic data.
 * @param rawQuery static raw query object
 * @param idValue requested attribute id
 */
function composeReadOneRequest(
  attributes: ParsedAttribute[],
  rawQuery: RawQuery,
  idValue?: string | number
): ComposedQuery | undefined {
  const idField = attributes.find(({ primaryKey }) => primaryKey);
  if (idValue && idField) {
    return {
      resolver: rawQuery.resolver,
      query: rawQuery.query,
      variables: { [idField.name]: idValue },
    };
  }
}
interface Content {
  title: string | null;
  text: string | null;
  acceptText: string | null;
  rejectText: string | null;
}
const Record: NextPage<RecordProps> = ({
  associations,
  attributes,
  modelName,
  routes,
  requests,
}) => {
  const { auth } = useAuth({ redirectTo: '/' });
  const router = useRouter();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<Content>({
    title: null,
    text: null,
    acceptText: null,
    rejectText: null,
  });
  const [condition, setCondition] = useState<null | string>(null);
  const { queryId, formView } = parseUrlQuery(router.query as RecordPathParams);
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
  const readRequest = useMemo<ComposedQuery | undefined>(
    () => composeReadOneRequest(attributes, requests.read, queryId),
    [attributes, queryId, requests.read]
  );

  /**
   * Query data from the GraphQL endpoint.
   */
  const { data, mutate } = useSWR<Record<string, AttributeValue> | null>(
    readRequest && auth?.user?.token ? [auth.user.token, readRequest] : null,
    requestOne,
    {
      revalidateOnFocus: false,
      onSuccess: (data) => {
        if (data)
          dispatch({
            type: 'reset',
            payload: { formView, attributes, data },
          });
      },
      onError: (responseErrors) => {
        // TODO: parse the err array and set the internal errors state accordingly
        console.log({ responseErrors });
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

  const handleOnFormAction = (action: FormAction) => async () => {
    switch (action) {
      /**
       * Navigate to the model table.
       */
      case 'cancel': {
        const modifiedContent = {
          title: 'Some fields are modified.',
          text: 'Do you want to leave anyway?',
          acceptText: 'YES',
          rejectText: 'NO',
        };
        if (data) {
          const diffData = formAttributes.filter(
            ({ name, value }) => value !== data[name]
          );
          if (diffData.length > 0) {
            setContent(modifiedContent);
            setCondition('cancel');
            setOpen(true);
          } else {
            router.push(`/${modelName}`);
          }
        } else {
          const nonNullValues = formAttributes.reduce((acc, { value }) => {
            return isNullorEmpty(value) ? acc : (acc += 1);
          }, 0);
          if (nonNullValues > 0) {
            setContent(modifiedContent);
            setCondition('cancel');
            setOpen(true);
          } else {
            router.push(`/${modelName}`);
          }
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
          payload: { formView: action, attributes, data },
        });
        break;
      }

      /**
       * Send a delete request and, if sucessful, navigate to the model table.
       */
      case 'delete': {
        setContent({
          title: 'Are you sure you want to delete this item?',
          text: `Item with id ${queryId} in model ${modelName}.`,
          acceptText: 'YES',
          rejectText: 'NO',
        });
        setCondition('delete');
        setOpen(true);
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
    if (nonNullValues !== formAttributes.length) {
      setContent({
        title: `Some fields are empty.  (id: ${queryId})`,
        text: 'Do you want to continue anyway?',
        acceptText: 'YES',
        rejectText: 'NO',
      });
    } else {
      setContent({
        title: `Save the item.  (id: ${queryId})`,
        text: null,
        acceptText: 'YES',
        rejectText: 'NO',
      });
    }
    setCondition('submit');
    setOpen(true);
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

  const handleOnClose = (): void => {
    setOpen(false);
  };

  const handleOnAccept = async (): Promise<void> => {
    setOpen(false);
    if (condition === 'cancel') {
      router.push(`/${modelName}`);
    } else if (condition === 'delete') {
      const { query, resolver } = requests.delete;
      const idKey = attributes.find(({ primaryKey }) => primaryKey)?.name;
      const idValue = formAttributes.find(({ name }) => idKey && name === idKey)
        ?.value;

      try {
        if (isNullorUndefined(idKey) || isNullorUndefined(idValue))
          throw new Error(
            'The record id was not set for a delete record action'
          );

        if (!auth.user?.token) return;

        const variables = { [idKey]: idValue };
        const request: ComposedQuery = {
          resolver,
          query,
          variables,
        };

        await requestOne(auth.user.token, request);
        router.push(`/${modelName}`);
      } catch (errors) {
        console.error(errors);
      }
    } else if (condition === 'submit') {
      const { query, resolver } =
        formView === 'create' ? requests.create : requests.update;

      const data = formAttributes.reduce<Record<string, AttributeValue>>(
        (acc, { name, value }) => ({ ...acc, [name]: value }),
        {}
      );

      const request: ComposedQuery = {
        resolver,
        query,
        variables: data,
      };

      try {
        if (auth.user?.token) await requestOne(auth.user?.token, request);
        if (formView === 'update') mutate(data);
        router.push(`/${modelName}`);
      } catch (errors) {
        console.error(errors);
      }
    }
  };

  const handleOnReject = (): void => {
    setOpen(false);
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
            onSubmit={handleOnSubmit(formView)}
            title={{
              prefix: capitalize(formView),
              main: modelName,
            }}
            actions={
              <FormActions
                view={formView}
                formId={formId}
                onAction={handleOnFormAction}
              />
            }
          />
          <ConfirmationDialog
            open={open}
            content={content}
            onClose={handleOnClose}
            onAccept={handleOnAccept}
            onReject={handleOnReject}
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
