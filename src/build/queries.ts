import { ParsedAttribute, ParsedDataModel } from '@/types/models';
import { StaticAssocQueries, StaticQueries } from '@/types/static';
import {
  queryBulkCreate,
  queryCsvTemplate,
  queryRecords,
  queryRecordsCount,
  queryRecord,
  queryRecordsWithToOne,
  queryRecordsWithToMany,
  readOneRecordWithAssoc,
} from '@/utils/queries';
import { parseStaticModels } from './models';

/**
 * Create the static queries used in the default model, record,
 * and association pages.
 * @returns all generated static queries
 */
export async function getStaticQueries(): Promise<
  Record<string, StaticQueries>
> {
  const staticModels: Record<string, StaticQueries> = {};

  const allModels = await parseStaticModels();

  Object.entries(allModels).map(([name, schema]) => {
    const nonFkAttributes = schema.attributes.filter(
      (attribute) => !attribute.foreignKey
    );

    const recordQueries = queryRecord(
      name,
      nonFkAttributes,
      schema.associations
    );

    const withFilter = getStaticAssociationQueries(schema, allModels);

    staticModels[name] = {
      readAll: queryRecords(name, nonFkAttributes),
      countAll: queryRecordsCount(name),
      createOne: recordQueries.create,
      deleteOne: recordQueries.delete,
      readOne: recordQueries.read,
      updateOne: recordQueries.update,
      csvTableTemplate: queryCsvTemplate(name),
      bulkAddCsv: queryBulkCreate(name),
      withFilter,
    };
  });

  return staticModels;
}

/**
 * Generate static queries used in the default association pages.
 * @param sourceModel model that contains an association reference
 * @param targetModels record of associated models
 * @returns static queries used in default association pages
 */
export function getStaticAssociationQueries(
  sourceModel: ParsedDataModel,
  targetModels: Record<string, ParsedDataModel>
): Record<string, StaticAssocQueries> {
  const withFilter: Record<string, StaticAssocQueries> = {};

  if (!sourceModel.associations) return withFilter;

  const filterForeignKeys = (attribute: ParsedAttribute): boolean =>
    !attribute.foreignKey;

  for (const sourceAssoc of sourceModel.associations) {
    const targetModel = targetModels[sourceAssoc.target];
    const targetAttributes = targetModel.attributes.filter(filterForeignKeys);

    const foundReverseAssociation = targetModel.associations?.find(
      (targetAssoc) => targetAssoc.name === sourceAssoc.reverseAssociation
    );

    if (!foundReverseAssociation) {
      throw new Error(
        `Association "${sourceAssoc.name}" in model "${sourceModel.model}"` +
          ` does not have a valid reverseAssociation "${sourceAssoc.reverseAssociation}"` +
          ` defined in "${targetModel.model}".`
      );
    }

    const {
      readOneRecordWithToOne,
      readOneRecordWithAssocCount,
      readOneRecordWithToMany,
    } = readOneRecordWithAssoc(
      sourceModel.model,
      sourceModel.attributes.filter(filterForeignKeys),
      sourceAssoc.name,
      sourceAssoc.target,
      targetAttributes
    );

    const readAllWithToOne = queryRecordsWithToOne(
      sourceAssoc.target,
      targetModel.attributes.filter(filterForeignKeys),
      sourceAssoc.reverseAssociation,
      sourceModel.model,
      sourceModel.primaryKey
    );

    const readAllWithToMany = queryRecordsWithToMany(
      sourceAssoc.target,
      targetModel.attributes.filter(filterForeignKeys),
      sourceAssoc.reverseAssociation,
      sourceModel.model,
      sourceModel.primaryKey
    );

    switch (sourceAssoc.type) {
      case 'one_to_one':
        withFilter[sourceAssoc.name] = {
          readAll: readAllWithToOne,
          readFiltered: readOneRecordWithToOne,
        };
        break;
      case 'many_to_one':
        withFilter[sourceAssoc.name] = {
          readAll: readAllWithToMany,
          readFiltered: readOneRecordWithToOne,
        };
        break;
      case 'one_to_many':
        withFilter[sourceAssoc.name] = {
          readAll: readAllWithToOne,
          readFiltered: readOneRecordWithToMany,
          countFiltered: readOneRecordWithAssocCount,
        };
        break;
      case 'many_to_many':
        withFilter[sourceAssoc.name] = {
          readAll: readAllWithToMany,
          readFiltered: readOneRecordWithToMany,
          countFiltered: readOneRecordWithAssocCount,
        };
        break;
      default:
        break;
    }
  }
  return withFilter;
}
