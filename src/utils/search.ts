import { ParsedAttribute } from '@/types/models';
import { QueryVariableSearch } from '@/types/queries';
import { isIntValue, isNumber } from './validation';

export function createSearch(
  value: string,
  attributes: ParsedAttribute[]
): QueryVariableSearch {
  const operator = 'or';

  const search = attributes.reduce((acc, { name, type }) => {
    if (type === 'Int' && isNumber(value) && isIntValue(value)) {
      acc.push({
        field: name,
        value,
        operator: 'eq',
      });
    } else if (
      type === 'Float' &&
      isNumber(value) &&
      !isNaN(parseFloat(value))
    ) {
      acc.push({
        field: name,
        value,
        operator: 'eq',
      });
    } else if (type === 'Boolean' && (value === 'true' || value === 'false')) {
      acc.push({
        field: name,
        value,
        operator: 'eq',
      });
    } else if (type === 'String') {
      acc.push({
        field: name,
        value: `%${value}%`,
        operator: 'iLike',
      });
    } else if (type === '[Int]') {
      const validIntArray = value.split(',').every(isIntValue);
      if (validIntArray)
        acc.push({
          field: name,
          value: value,
          operator: 'in',
        });
    }
    return acc;
  }, [] as QueryVariableSearch[]);

  return {
    operator,
    search,
  };
}
