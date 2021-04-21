import { AssocQuery, RawQuery } from './queries';

export interface StaticQueries {
  readAll: RawQuery;
  countAll: RawQuery;
  createOne: RawQuery;
  deleteOne: RawQuery;
  readOne: RawQuery;
  updateOne: RawQuery;
  csvTableTemplate: RawQuery;
  bulkAddCsv: RawQuery;
  // assoc: Record<string, AssocQuery>;
  withFilter: Record<string, StaticAssocQueries>;
}

export interface StaticAssocQueries {
  readAll: AssocQuery;
  readFiltered: AssocQuery;
  countFiltered?: AssocQuery;
}
