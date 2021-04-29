import { ParsedAttribute } from '@/types/models';
import { QueryVariableSearch } from '@/types/queries';
import { createSearch } from '@/utils/search';
import { useMemo } from 'react';

export type AssociationFilter =
  | 'associated'
  | 'not-associated'
  | 'no-filter'
  | 'records-to-add'
  | 'records-to-remove';

export interface UseSearchProps {
  searchText: string;
  associationFilter: AssociationFilter;
  recordsToAdd: (string | number)[];
  recordsToRemove: (string | number)[];
  attributes: ParsedAttribute[];
  primaryKey: string;
}

export default function useSearch({
  searchText,
  associationFilter,
  recordsToAdd,
  recordsToRemove,
  attributes,
  primaryKey,
}: UseSearchProps): QueryVariableSearch | undefined {
  const search = useMemo(() => {
    const fieldSearch =
      searchText !== '' ? createSearch(searchText, attributes) : undefined;
    const filterSearch: QueryVariableSearch | undefined =
      associationFilter === 'records-to-add'
        ? {
            field: primaryKey,
            value: recordsToAdd.toString(),
            valueType: 'Array',
            operator: 'in',
          }
        : associationFilter === 'records-to-remove'
        ? {
            field: primaryKey,
            value: recordsToRemove.toString(),
            valueType: 'Array',
            operator: 'in',
          }
        : undefined;

    const newSearch =
      fieldSearch && filterSearch
        ? { operator: 'and', search: [fieldSearch, filterSearch] }
        : fieldSearch
        ? fieldSearch
        : filterSearch
        ? filterSearch
        : undefined;
    return newSearch;
  }, [
    searchText,
    associationFilter,
    recordsToAdd,
    recordsToRemove,
    attributes,
    primaryKey,
  ]);

  return search;
}
