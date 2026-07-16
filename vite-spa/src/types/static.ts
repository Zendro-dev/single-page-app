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
  withFilter: Record<string, StaticAssocQueries>;
}

export interface StaticAssocQueries {
  // requests all records of a associated data-model.
  // additionaly applies the field-resolver for the root-model
  // to filter if a record is actually associated at the time of request
  // used for editing associations
  readAll: AssocQuery;
  // request all associated records to a root record ID.
  readFiltered: AssocQuery;
  // request the count of all associated records
  countFiltered?: AssocQuery;
}
