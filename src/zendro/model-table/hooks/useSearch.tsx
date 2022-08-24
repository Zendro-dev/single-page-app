import { ParsedAttribute, spaSearchOperator } from '@/types/models';
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
  associationFilter?: AssociationFilter;
  selectedRecords?: {
    toAdd: (string | number)[];
    toRemove: (string | number)[];
  };
  attributes: ParsedAttribute[];
  primaryKey: string;
  spaSearchOperator?: spaSearchOperator;
}

export default function useSearch({
  associationFilter,
  attributes,
  searchText,
  primaryKey,
  selectedRecords,
  spaSearchOperator,
}: UseSearchProps): QueryVariableSearch | undefined {
  const search = useMemo(() => {
    const fieldSearch =
      searchText !== ''
        ? createSearch(searchText, attributes, spaSearchOperator)
        : undefined;
    const filterSearch: QueryVariableSearch | undefined =
      associationFilter === 'records-to-add' && selectedRecords
        ? {
            field: primaryKey,
            value: selectedRecords.toAdd.toString(),
            valueType: 'Array',
            operator: 'in',
          }
        : associationFilter === 'records-to-remove' && selectedRecords
        ? {
            field: primaryKey,
            value: selectedRecords.toRemove.toString(),
            valueType: 'Array',
            operator: 'in',
          }
        : undefined;

    const newSearch: QueryVariableSearch | undefined =
      fieldSearch && filterSearch
        ? { operator: 'and', search: [fieldSearch, filterSearch] }
        : fieldSearch
        ? fieldSearch
        : filterSearch
        ? filterSearch
        : undefined;
    return newSearch;
  }, [
    associationFilter,
    attributes,
    primaryKey,
    searchText,
    selectedRecords,
    spaSearchOperator,
  ]);

  return search;
}
