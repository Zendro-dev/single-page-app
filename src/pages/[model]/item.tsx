import React, { useMemo, useReducer } from 'react';
import { capitalize } from 'inflection';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import { createStyles, makeStyles, Theme } from '@material-ui/core';

import AttributesForm, {
  FormAction,
  FormActions,
  FormAttribute,
  FormView,
} from '@/components/attributes-form';

import useAuth from '@/hooks/useAuth';
import ModelsLayout from '@/layouts/models-layout';

import {
  AttributeValue,
  ParsedAttribute,
  RecordPathParams,
} from '@/types/models';
import { RawQuery, ComposedQuery } from '@/types/queries';
import { AppRoutes } from '@/types/routes';

import { getAttributeList } from '@/utils/models';
import { queryRecord } from '@/utils/queries';
import { requestOne } from '@/utils/requests';
import {
  getStaticModelPaths,
  getStaticRoutes,
  getStaticModel,
} from '@/utils/static';
import { isNullorUndefined } from '@/utils/validation';

interface RecordProps {
  attributes: ParsedAttribute[];
  modelName: string;
  routes: AppRoutes;
  requests: {
    create: RawQuery;
    read: RawQuery;
    update: RawQuery;
    delete: RawQuery;
  };
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
  const requests = queryRecord(modelName, attributes);

  return {
    props: {
      key: modelName,
      modelName,
      attributes,
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
  return attributes.map(({ name, type, primaryKey }) => ({
    name,
    type,
    primaryKey,
    readOnly: formView === 'update' && primaryKey,
    value: data ? data[name] : null,
    error: errors ? errors[name] : null,
  }));
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

const Record: NextPage<RecordProps> = ({
  attributes,
  modelName,
  routes,
  requests,
}) => {
  const { auth } = useAuth({ redirectTo: '/' });
  const router = useRouter();
  const classes = useStyles();
  const { queryId, formView } = parseUrlQuery(router.query as RecordPathParams);
  const formId = `AttributesForm-${queryId ?? 'create'}`;

  const [formAttributes, dispatch] = useReducer(
    formAttributesReducer,
    { formView, attributes },
    initAttributes
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
        console.log({ data });
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
        router.push(`/${modelName}`);
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
        const { query, resolver } = requests.delete;
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

    const { query, resolver } =
      formView === 'create' ? requests.create : requests.update;

    const data = formAttributes.reduce<Record<string, AttributeValue>>(
      (acc, { name, value }) => ({ ...acc, [name]: value }),
      {}
    );

    const idKey = attributes.find(({ primaryKey }) => primaryKey)?.name;
    const idValue = formAttributes.find(({ name }) => idKey && name === idKey)
      ?.value;

    const request: ComposedQuery = {
      resolver,
      query,
      variables: data,
    };

    try {
      if (auth.user?.token) await requestOne(auth.user?.token, request);
      if (formView === 'update') mutate(data);
      else if (formView === 'create' && idValue)
        router.push(`/${modelName}/item?update=${idValue}`);
    } catch (errors) {
      console.error(errors);
    }
  };

  return (
    <ModelsLayout brand="Zendro" routes={routes}>
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
