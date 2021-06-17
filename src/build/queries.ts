import { ParsedDataModel } from '@/types/models';
import { StaticAssocQueries, StaticQueries } from '@/types/static';
import { getAttributeList, parseAssociations } from '@/utils/models';
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
import { getStaticModels } from './models';

export async function getStaticQueries(): Promise<
  Record<string, StaticQueries>
> {
  const staticModels: Record<string, StaticQueries> = {};

  const dataModels = await getStaticModels();

  Object.entries(dataModels).map(([name, schema]) => {
    const attributes = getAttributeList(schema, { excludeForeignKeys: true });
    const associations = parseAssociations(schema);
    const recordQueries = queryRecord(name, attributes, associations);

    const withFilter = getStaticAssociationQueries(schema, dataModels);

    staticModels[name] = {
      readAll: queryRecords(name, attributes),
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
 * generates the static queries used to request association related data.
 */
export function getStaticAssociationQueries(
  sourceModel: ParsedDataModel,
  targetModels: Record<string, ParsedDataModel>
): Record<string, StaticAssocQueries> {
  const withFilter: Record<string, StaticAssocQueries> = {};

  if (!sourceModel.associations) return withFilter;

  for (const [
    associationName,
    { target, type, reverseAssociation },
  ] of Object.entries(sourceModel.associations)) {
    const targetModel = targetModels[target];
    const targetAttributes = getAttributeList(targetModel, {
      excludeForeignKeys: true,
    });
    if (!targetModel.associations?.[reverseAssociation])
      throw new Error(
        `Association "${associationName}" in model "${sourceModel.model}" does not have a valid reverseAssociation "${reverseAssociation}" defined in "${targetModel.model}".`
      );
    const {
      readOneRecordWithToOne,
      readOneRecordWithAssocCount,
      readOneRecordWithToMany,
    } = readOneRecordWithAssoc(
      sourceModel.model,
      getAttributeList(sourceModel, { excludeForeignKeys: true }),
      associationName,
      target,
      targetAttributes
    );

    const readAllWithToOne = queryRecordsWithToOne(
      target,
      getAttributeList(targetModel, { excludeForeignKeys: true }),
      reverseAssociation,
      sourceModel.model,
      sourceModel.primaryKey
    );

    const readAllWithToMany = queryRecordsWithToMany(
      target,
      getAttributeList(targetModel, { excludeForeignKeys: true }),
      reverseAssociation,
      sourceModel.model,
      sourceModel.primaryKey
    );

    switch (type) {
      case 'one_to_one':
        withFilter[associationName] = {
          readAll: readAllWithToOne,
          readFiltered: readOneRecordWithToOne,
        };
        break;
      case 'many_to_one':
        withFilter[associationName] = {
          readAll: readAllWithToMany,
          readFiltered: readOneRecordWithToOne,
        };
        break;
      case 'one_to_many':
        withFilter[associationName] = {
          readAll: readAllWithToOne,
          readFiltered: readOneRecordWithToMany,
          countFiltered: readOneRecordWithAssocCount,
        };
        break;
      case 'many_to_many':
        withFilter[associationName] = {
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
