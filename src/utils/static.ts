import { AssocQuery } from '@/types/queries';
import { StaticAssocQueries, StaticQueries } from '@/types/static';
import { readdir, readFile, stat } from 'fs/promises';
import { parse } from 'path';
import { DataModel, ParsedDataModel } from '../types/models';
import { AppRoutes, ModelRoute, ModelUrlQuery } from '../types/routes';
import { getAttributeList, parseAssociations } from './models';
import {
  queryBulkCreate,
  queryCsvTemplate,
  queryRecords,
  queryRecordsCount,
  queryRecord,
  queryRecordsWithToOne,
  queryRecordsWithToMany,
  readOneRecordWithAssoc,
} from './queries';

/* MODELS */

/**
 * Parse a data model into its javascript object representation.
 * @param name name of the model to parse
 */
export async function getStaticModel(name: string): Promise<ParsedDataModel> {
  const modelPath = await whichModel(name);
  const json = await readFile(modelPath, { encoding: 'utf8' });
  const dataModel = JSON.parse(json) as DataModel;
  return {
    primaryKey: dataModel.internalId ?? 'id',
    ...dataModel,
  };
}

/**
 * Parse each data model into its javascript object representation.
 * @param modelPaths array of paths to each data model file
 */
export async function getStaticModels(): Promise<
  Record<string, ParsedDataModel>
> {
  const models: Record<string, ParsedDataModel> = {};

  const dataModels = await readdir('./models');
  const adminModels = await readdir('./admin');

  for (const file of [...adminModels, ...dataModels]) {
    const { name } = parse(file);
    const dataModel = await getStaticModel(name);
    models[name] = dataModel;
  }

  return models;
}

/**
 * Compose static paths for the dynamic [model] pages.
 */
export async function getStaticModelPaths(): Promise<
  { params: ModelUrlQuery }[]
> {
  const routes = await getStaticRoutes();
  const getModelNames = (group: string) => ({
    name,
  }: ModelRoute): { params: ModelUrlQuery } => ({
    params: { group, model: name },
  });
  const adminRoutes = routes.admin.map(getModelNames('admin'));
  const modelRoutes = routes.models.map(getModelNames('models'));

  return [...adminRoutes, ...modelRoutes];
}

/**
 * Parse each data model path into a valid application route.
 * @param modelPaths array of paths to each data model file
 */
export async function getStaticRoutes(): Promise<AppRoutes> {
  const parseRoutes = (file: string): ModelRoute => {
    const { name } = parse(file);
    return {
      name,
      href: `/${name}`,
    };
  };

  const dataModels = await readdir('./models');
  const models = dataModels.map(parseRoutes);

  const adminModels = await readdir('./admin');
  const admin = adminModels.map(parseRoutes);

  return {
    admin,
    models,
  };
}

/**
 * Finds the path of a static model.
 * @param name model name
 */
export async function whichModel(name: string): Promise<string> {
  let modelPath: string;

  try {
    await stat(`./models/${name}.json`);
    modelPath = `./models/${name}.json`;
  } catch {
    await stat(`./admin/${name}.json`);
    modelPath = `./admin/${name}.json`;
  }

  return modelPath;
}

/* QUERIES */

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
    sourceName,
    { target: targetModelName, type: sourceModelAssociationType },
  ] of Object.entries(sourceModel.associations)) {
    const targetModel = targetModels[targetModelName];

    if (!targetModel.associations)
      throw new Error(
        `Model "${targetModel.model}" does not have associations defined, ` +
          `but "${sourceModel.model}" has it listed as a target in "${sourceName}".`
      );

    const reverseAssociation = Object.entries(targetModel.associations).find(
      ([_, association]) => association.target === sourceModel.model
    );

    if (!reverseAssociation)
      throw new Error(
        `The target model "${targetModel.model}" does not have an association ` +
          `with "${sourceModel.model}" defined as target.`
      );
    const [targetAssocName, targetAssociation] = reverseAssociation;
    const {
      readOneRecordWithToOne,
      readOneRecordWithAssocCount,
      readOneRecordWithToMany,
    } = readOneRecordWithAssoc(
      sourceModel.model,
      getAttributeList(sourceModel, { excludeForeignKeys: true }),
      sourceName,
      targetModelName,
      getAttributeList(targetModel, { excludeForeignKeys: true })
    );
    // For editing associations we directly request records of the associated
    // data-model. The distinction has to be made for the association type of
    // the target to the source (reverse).
    switch (targetAssociation.type) {
      case 'to_one':
        withFilter[targetModelName] = {
          readAll: queryRecordsWithToOne(
            targetModelName,
            getAttributeList(targetModel, { excludeForeignKeys: true }),
            targetAssocName,
            sourceModel.model,
            sourceModel.primaryKey
          ),
          readFiltered: {} as AssocQuery,
        };
        break;
      case 'to_many_through_sql_cross_table':
      case 'to_many':
        withFilter[targetModelName] = {
          readAll: queryRecordsWithToMany(
            targetModelName,
            getAttributeList(targetModel, { excludeForeignKeys: true }),
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
        Object.assign(withFilter[targetModelName], {
          readFiltered: readOneRecordWithToOne,
        });
        break;
      case 'to_many_through_sql_cross_table':
      case 'to_many':
        Object.assign(withFilter[targetModelName], {
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
