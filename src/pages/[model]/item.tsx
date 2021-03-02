import React, { useMemo } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import { createStyles, makeStyles, Theme } from '@material-ui/core';
import {
  Create as EditIcon,
  Delete as DeleteIcon,
  Visibility as ReadIcon,
  Save as SaveIcon,
} from '@material-ui/icons';

import { FabLink } from '@/components/links';
import FloatButton from '@/components/buttons/fab';
import AttributesForm, {
  FormAttribute,
} from '@/components/forms/attributes-form';

import useAuth from '@/hooks/useAuth';

import ModelsLayout from '@/layouts/models-layout';

import { getAttributeList } from '@/utils/models';
import { readRecordAttributes, updateRecordAttributes } from '@/utils/queries';
import { readOne } from '@/utils/requests';
import {
  getStaticModelPaths,
  getStaticRoutes,
  getStaticModel,
} from '@/utils/static';

import {
  AttributeValue,
  ParsedAttribute,
  RecordPathParams,
} from '@/types/models';
import {
  RawQuery,
  QueryRecordAttributesVariables,
  ComposedQuery,
} from '@/types/queries';
import { AppRoutes } from '@/types/routes';

interface RecordProps {
  attributes: ParsedAttribute[];
  modelName: string;
  routes: AppRoutes;
  requests: {
    create: RawQuery;
    read: RawQuery;
    update: RawQuery;
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
  const read = readRecordAttributes(modelName, attributes);
  const update = updateRecordAttributes(modelName, attributes);
  const create: RawQuery = {
    resolver: '',
    query: '',
  };

  return {
    props: {
      attributes,
      modelName,
      routes,
      requests: {
        create,
        read,
        update,
      },
    },
  };
};

interface ParsedQuery {
  mode: 'create' | 'read' | 'update';
  id?: string;
}

/**
 * Compute the type of operation requested from the URL query.
 * @param query url query
 */
function parseUrlQuery(query: RecordPathParams): ParsedQuery {
  const { read, update } = query;

  let mode: 'create' | 'read' | 'update';
  let id;

  if (read) {
    mode = 'read';
    id = read;
  } else if (update) {
    mode = 'update';
    id = update;
  } else {
    mode = 'create';
  }

  return {
    mode,
    id,
  };
}

/**
 * Compose an array of form attributes from a combination of static types
 * and data returned from the server.
 * @param mode crud operation
 * @param attributes parsed data-model attributes
 * @param data attribute values
 * @param errors attribute error messages
 */
function composeAttributes(
  mode: 'create' | 'read' | 'update',
  attributes: ParsedAttribute[],
  data?: Record<string, AttributeValue> | null,
  errors?: Record<string, string | undefined>
): FormAttribute[] {
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
 * @param id requested attribute id
 */
function composeReadOneRequest(
  rawQuery: RawQuery,
  id?: string | number
): ComposedQuery<QueryRecordAttributesVariables> | undefined {
  if (id) {
    return {
      resolver: rawQuery.resolver,
      query: rawQuery.query,
      variables: { id },
    };
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
  const { id, mode } = parseUrlQuery(router.query as RecordPathParams);

  /**
   * Composed read request from the url.
   */
  const readRequest = useMemo<
    ComposedQuery<QueryRecordAttributesVariables> | undefined
  >(() => composeReadOneRequest(requests.read, id), [id, requests.read]);

  /**
   * Query data from the GraphQL endpoint.
   */
  const { data, mutate } = useSWR<Record<string, AttributeValue> | null>(
    readRequest && auth?.user?.token ? [auth.user.token, readRequest] : null,
    readOne,
    {
      revalidateOnFocus: false,
      onError: (responseErrors) => {
        // TODO: parse the err array and set the internal errors state accordingly
        console.log({ err: responseErrors });
      },
    }
  );

  /**
   * Combine static and dynamic data to compose the form attributes array.
   */
  const formAttributes = useMemo<FormAttribute[]>(
    () => composeAttributes(mode, attributes, data),
    [attributes, data, mode]
  );

  /**
   * Updates the attribute value in the internal SWR cache. Does not trigger a revalidation.
   * @param key name of the attribute to change in the form state
   */
  const handleOnChange = (key: string) => (value: AttributeValue) => {
    mutate({ ...data, [key]: value }, false);
  };

  /**
   * Submits the cached values to the Zendro GraphQL endpoint. Triggers a revalidation.
   */
  const handleOnSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();
    const { query, resolver } = requests.update;
    const request: ComposedQuery = {
      resolver,
      query,
      variables: data,
    };
    if (auth.user?.token) mutate(await readOne(auth.user?.token, request));
  };

  return (
    <ModelsLayout brand="Zendro" routes={routes}>
      <AttributesForm
        attributes={formAttributes}
        className={classes.form}
        data={data}
        title={modelName}
        onChange={handleOnChange}
        onSubmit={handleOnSubmit}
        recordId={id}
      >
        {mode === 'read' && (
          <FabLink
            form={`AttributesForm-${id ?? 'create'}`}
            href={`/${modelName}/item?update=${id}`}
            color="primary"
            icon={EditIcon}
            tooltip="Edit record"
          />
        )}

        {mode === 'update' && (
          <>
            <FloatButton
              form={`AttributesForm-${id ?? 'create'}`}
              icon={DeleteIcon}
              tooltip="Delete record"
              color="secondary"
            />

            <FabLink
              form={`AttributesForm-${id ?? 'create'}`}
              href={`/${modelName}/item?read=${id}`}
              color="primary"
              icon={ReadIcon}
              tooltip="View record details"
            />
          </>
        )}

        {(mode === 'create' || mode === 'update') && (
          <FloatButton
            form={`AttributesForm-${id ?? 'create'}`}
            color="primary"
            icon={SaveIcon}
            tooltip="Submit changes"
            type="submit"
          />
        )}
      </AttributesForm>
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
