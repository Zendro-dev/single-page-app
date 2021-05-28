import { AttributeValue, DataRecord, ParsedAttribute } from '@/types/models';
import { isNullorEmpty } from '@/utils/validation';
import { FormAttribute, FormView } from './form';

/* STATE MANAGEMENT */

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
        value: (data?.[name] as AttributeValue) ?? null,
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
    attribute.value = data[attribute.name] as AttributeValue;
    return attribute;
  });
}

interface UpdateOne {
  action: 'UPDATE_ONE';
  payload: {
    attrName: string;
    attrField: Partial<
      Record<keyof FormAttribute, FormAttribute[keyof FormAttribute]>
    >;
  };
}

function updateOne(
  state: FormAttribute[],
  payload: UpdateOne['payload']
): FormAttribute[] {
  const { attrName, attrField } = payload;
  const attr = state.find(({ name }) => attrName === name);
  if (attr) Object.assign(attr, attrField);
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

/* UTILITY FUNCTIONS */

export interface FormStats {
  clientErrors: number;
  unset: number;
}

/**
 * Compute various useful form statistics from current attribute values.
 * @param formAttributes array of form attributes
 * @returns form statistics related to current attributes
 */
export function computeStats(formAttributes: FormAttribute[]): FormStats {
  return formAttributes.reduce(
    (acc, { value, clientError }) => {
      if (isNullorEmpty(value)) acc.unset += 1;
      if (clientError) acc.clientErrors += 1;
      return acc;
    },
    { clientErrors: 0, unset: 0 } as FormStats
  );
}

/**
 * Count differences between form attributes and a map of attribute values.
 * @param formData array of form attributes
 * @param recordData map of attribute name to value pairs
 * @returns number of attributes with differing values
 */
export function computeDiffs(
  formData: FormAttribute[],
  recordData: DataRecord
): number {
  return formData.reduce((acc, { name, value }) => {
    const cachedValue = recordData[name];
    // TODO: deep comparison for array types
    if (value !== cachedValue) acc++;
    return acc;
  }, 0);
}
