import { FormAttribute, FormView } from './form';
import { DataRecord, ParsedAttribute } from '@/types/models';
import { isNullorEmpty } from '@/utils/validation';

interface InitForm {
  action: 'INIT_FORM';
  payload: Parameters<typeof initForm>[0];
}

/**
 * Compose an array of form attributes using the data-model attribute types,
 * and optionally data and errors returned from the server.
 * @param mode crud operation
 * @param attributes parsed data-model attributes
 * @param data attribute values
 * @param errors attribute error messages
 */
export function initForm({
  formView,
  attributes,
  data,
  errors,
}: {
  formView: FormView;
  attributes: ParsedAttribute[];
  data?: DataRecord | null;
  errors?: Record<string, string[]>;
}): FormAttribute[] {
  return attributes.reduce(
    (attrArr, { name, type, primaryKey, automaticId }) => {
      // Do not include internally assigned primaryKey
      if (formView === 'create' && automaticId) return attrArr;

      // Compute default attribute fields
      attrArr.push({
        name,
        type,
        primaryKey,
        readOnly: formView === 'update' && primaryKey,
        value: data?.[name] ?? null,
        serverErrors: errors?.[name],
      });

      return attrArr;
    },
    [] as FormAttribute[]
  );
}

interface UpdateServerErrors {
  action: 'UDPATE_SERVER_ERRORS';
  payload: { errors?: Record<string, string[]> };
}

function updateServerErrors(
  state: FormAttribute[],
  payload: UpdateServerErrors['payload']
): FormAttribute[] {
  return state.map((attribute) => ({
    ...attribute,
    serverErrors: payload.errors?.[attribute.name],
  }));
}

interface UpdateValues {
  action: 'UPDATE_VALUES';
  payload: { data: DataRecord };
}

function updateValues(
  state: FormAttribute[],
  payload: UpdateValues['payload']
): FormAttribute[] {
  const { data } = payload;
  return state.map((attribute) => {
    attribute.value = data[attribute.name];
    return attribute;
  });
}

interface UpdateOne {
  action: 'UPDATE_ONE';
  payload: {
    attrName: string;
    field: {
      key: keyof FormAttribute;
      value: FormAttribute[keyof FormAttribute];
    };
  };
}

function updateOne(
  state: FormAttribute[],
  payload: UpdateOne['payload']
): FormAttribute[] {
  const { attrName, field } = payload;
  const attr = state.find(({ name }) => attrName === name);

  if (attr) {
    Object.assign(attr, { [field.key]: field.value });
  }

  return [...state];
}

export function formAttributesReducer(
  state: FormAttribute[],
  action: InitForm | UpdateOne | UpdateServerErrors | UpdateValues
): FormAttribute[] {
  switch (action.action) {
    case 'INIT_FORM':
      return initForm(action.payload);

    case 'UPDATE_VALUES':
      return updateValues(state, action.payload);

    case 'UDPATE_SERVER_ERRORS':
      return updateServerErrors(state, action.payload);

    case 'UPDATE_ONE':
      return updateOne(state, action.payload);
  }
}

interface FormStats {
  clientErrors: number;
  unset: number;
}

export function formStats(formAttributes: FormAttribute[]): FormStats {
  return formAttributes.reduce(
    (acc, { value, clientError }) => {
      if (isNullorEmpty(value)) acc.unset += 1;
      if (clientError) acc.clientErrors += 1;
      return acc;
    },
    { clientErrors: 0, unset: 0 } as FormStats
  );
}