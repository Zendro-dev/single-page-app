import React, { useMemo, useReducer } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import { createStyles, makeStyles, Theme } from '@material-ui/core';
import {
  Add as CreateIcon,
  Cached as Reload,
  ChevronLeft as CancelIcon,
  Create as EditIcon,
  Delete as DeleteIcon,
  Visibility as ReadIcon,
  Save as SaveIcon,
} from '@material-ui/icons';

import ActionButton from '@/components/buttons/fab';
import AttributesForm, {
  FormAttribute,
} from '@/components/forms/attributes-form';
import ActionLink from '@/components/links/fab-link';

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
  queryMode: QueryMode;
  queryId?: string;
}
type QueryMode = 'create' | 'read' | 'update';

/**
 * Compute the type of operation requested from the URL query.
 * @param query url query
 */
function parseUrlQuery(query: RecordPathParams): ParsedQuery {
  const { read, update } = query;

  let queryMode: QueryMode;
  let queryId;

  if (read) {
    queryMode = 'read';
    queryId = read;
  } else if (update) {
    queryMode = 'update';
    queryId = update;
  } else {
    queryMode = 'create';
  }

  return {
    queryMode,
    queryId,
  };
}

interface InitAttributesArgs {
  mode: QueryMode;
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
  mode,
  attributes,
  data,
  errors,
}: InitAttributesArgs): FormAttribute[] {
  return attributes.map(({ name, type, primaryKey }) => ({
    name,
    type,
    readOnly:
      mode === 'read' || (mode === 'update' && primaryKey) ? true : false,
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
  const { queryId, queryMode } = parseUrlQuery(
    router.query as RecordPathParams
  );
  const formId = `AttributesForm-${queryId ?? 'create'}`;

  const [formAttributes, dispatch] = useReducer(
    formAttributesReducer,
    { mode: queryMode, attributes },
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
      revalidateOnMount: true,
      onSuccess: (data) => {
        console.log({ data });
        if (data)
          dispatch({
            type: 'reset',
            payload: { mode: queryMode, attributes, data },
          });
      },
      onError: (responseErrors) => {
        // TODO: parse the err array and set the internal errors state accordingly
        console.log({ responseErrors });
      },
      initialData: formAttributes.reduce<Record<string, AttributeValue>>(
        (acc, { name, value }) => ({ ...acc, [name]: value }),
        {}
      ),
    }
  );

  /**
   * Updates the attribute value in the internal SWR cache. Does not trigger a revalidation.
   * @param key name of the attribute to change in the form state
   */
  const handleOnChange = (key: string) => (value: AttributeValue) => {
    dispatch({ type: 'update', payload: { key, value } });
  };

  const handleOnDelete = async (): Promise<void> => {
    const { query, resolver } = requests.delete;
    const idKey = attributes.find(({ primaryKey }) => primaryKey)?.name;
    const idValue = formAttributes.find(({ name }) => idKey && name === idKey)
      ?.value;

    try {
      if (isNullorUndefined(idKey) || isNullorUndefined(idValue))
        throw new Error('The record id was not set for a delete record action');

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
  };

  /**
   * Revalidate the data in the current request.
   */
  const handleOnReload = (): void => {
    mutate();
  };

  const handleOnSwitchMode = (mode: QueryMode) => (): void => {
    const query = mode === 'create' ? '' : `?${mode}=${queryId}`;
    router.push(`/${modelName}/item${query}`);
    dispatch({
      type: 'reset',
      payload: { mode, attributes, data: mode === 'create' ? undefined : data },
    });
  };

  /**
   * Submit the form values to the Zendro GraphQL endpoint. Triggers a revalidation.
   */
  const handleOnSubmit = (mode: QueryMode) => async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (mode === 'read') return;

    const { query, resolver } =
      mode === 'create' ? requests.create : requests.update;

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
      if (mode === 'update') mutate(data);
      else if (mode === 'create' && idValue)
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
        formId={formId}
        onChange={handleOnChange}
        onSubmit={handleOnSubmit(queryMode)}
        title={modelName}
        actions={
          <>
            <div className={classes.actions}>
              <ActionLink
                color="secondary"
                form={formId}
                href={`/${modelName}`}
                icon={CancelIcon}
                size="large"
                tooltip="Exit form"
              />

              {queryMode === 'update' && (
                <ActionButton
                  color="primary"
                  form={formId}
                  icon={ReadIcon}
                  onClick={handleOnSwitchMode('read')}
                  size="medium"
                  tooltip="View record details"
                />
              )}

              {queryMode === 'read' && (
                <ActionButton
                  color="primary"
                  form={formId}
                  icon={EditIcon}
                  onClick={handleOnSwitchMode('update')}
                  size="medium"
                  tooltip="Edit record"
                />
              )}

              {(queryMode === 'read' || queryMode === 'update') && (
                <ActionButton
                  color="primary"
                  form={formId}
                  icon={CreateIcon}
                  onClick={handleOnSwitchMode('create')}
                  size="medium"
                  tooltip="Create new record"
                />
              )}
            </div>

            <div className={classes.actions}>
              {queryMode === 'update' && (
                <ActionButton
                  color="secondary"
                  form={formId}
                  icon={DeleteIcon}
                  onClick={handleOnDelete}
                  tooltip="Delete record"
                  size="medium"
                />
              )}

              {(queryMode === 'read' || queryMode === 'update') && (
                <ActionButton
                  color="primary"
                  form={formId}
                  icon={Reload}
                  tooltip="Reload data"
                  size={queryMode === 'read' ? 'large' : 'medium'}
                  onClick={handleOnReload}
                />
              )}

              {(queryMode === 'create' || queryMode === 'update') && (
                <ActionButton
                  color="primary"
                  form={formId}
                  icon={SaveIcon}
                  size="large"
                  tooltip="Submit changes"
                  type="submit"
                />
              )}
            </div>
          </>
        }
      />
    </ModelsLayout>
  );
};
export default Record;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    actions: {
      '& > button:not(:first-child), a:not(:first-child)': {
        marginLeft: theme.spacing(6),
      },
    },
    form: {
      border: '2px solid',
      borderRadius: 10,
      borderColor: theme.palette.grey[300],
      margin: theme.spacing(10, 4),
      padding: theme.spacing(12, 10),
    },
  })
);
