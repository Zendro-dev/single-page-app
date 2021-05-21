import { ParsedDataModel } from '@/types/models';
import { AssocQuery } from '@/types/queries';
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
    sourceAssociationName,
    {
      target: targetModelName,
      type: sourceModelAssociationType,
      targetKey: sourceModelTargetKey,
    },
  ] of Object.entries(sourceModel.associations)) {
    const targetModel = targetModels[targetModelName];

    if (!targetModel.associations)
      throw new Error(
        `Model "${targetModel.model}" does not have associations defined, ` +
          `but "${sourceModel.model}" has it listed as a target in "${sourceAssociationName}".`
      );

    const reverseAssociation = Object.entries(targetModel.associations).find(
      ([_, association]) => {
        if (
          (sourceModelAssociationType === 'to_many' &&
            association.type === 'to_many') ||
          (sourceModelAssociationType === 'to_many_through_sql_cross_table' &&
            association.type === 'to_many_through_sql_cross_table')
        ) {
          return association.sourceKey === sourceModelTargetKey;
        } else {
          return association.targetKey === sourceModelTargetKey;
        }
      }
    );

    if (!reverseAssociation)
      throw new Error(
        `The source association "${sourceAssociationName}" does not have a peer association ` +
          `in the target model "${targetModel.model}".`
      );
    const [targetAssociationName, targetAssociation] = reverseAssociation;
    const {
      readOneRecordWithToOne,
      readOneRecordWithAssocCount,
      readOneRecordWithToMany,
    } = readOneRecordWithAssoc(
      sourceModel.model,
      getAttributeList(sourceModel, { excludeForeignKeys: true }),
      sourceAssociationName,
      targetModelName,
      getAttributeList(targetModel, { excludeForeignKeys: true })
    );
    // For editing associations we directly request records of the associated
    // data-model. The distinction has to be made for the association type of
    // the target to the source (reverse).

    switch (targetAssociation.type) {
      case 'to_one':
        withFilter[sourceAssociationName] = {
          readAll: queryRecordsWithToOne(
            targetModelName,
            getAttributeList(targetModel, { excludeForeignKeys: true }),
            targetAssociationName,
            sourceModel.model,
            sourceModel.primaryKey
          ),
          readFiltered: {} as AssocQuery,
        };
        break;
      case 'to_many_through_sql_cross_table':
      case 'to_many':
        withFilter[sourceAssociationName] = {
          readAll: queryRecordsWithToMany(
            targetModelName,
            getAttributeList(targetModel, { excludeForeignKeys: true }),
            targetAssociationName,
            sourceModel.model,
            sourceModel.primaryKey
          ),
          readFiltered: {} as AssocQuery,
        };

        break;

      default:
        break;
    }
    // For viewing/filtering associations we request only actually associated records.
    // The distinction has to be made for the association type of the source to the target.
    switch (sourceModelAssociationType) {
      case 'to_one':
        Object.assign(withFilter[sourceAssociationName], {
          readFiltered: readOneRecordWithToOne,
        });
        break;
      case 'to_many_through_sql_cross_table':
      case 'to_many':
        Object.assign(withFilter[sourceAssociationName], {
          readFiltered: readOneRecordWithToMany,
          countFiltered: readOneRecordWithAssocCount,
        });
        break;
      default:
        break;
    }
  }

  return withFilter;
}
