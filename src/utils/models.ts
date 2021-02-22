import {
  DataModel,
  AttributeScalarType,
  AttributeArrayType,
} from '../types/models';

interface TableColumn {
  name: string;
  type: AttributeScalarType | AttributeArrayType;
  readOnly: boolean;
}

export function getAttributeList(model: DataModel): Array<TableColumn> {
  const tableColumns: Array<TableColumn> = Object.keys(model.attributes).map(
    (attribute) => {
      return {
        name: attribute,
        type: model.attributes[attribute],
        readOnly: model.internalId === attribute ? true : false,
      };
    }
  );

  model.internalId
    ? tableColumns.splice(
        0,
        0,
        tableColumns.splice(
          tableColumns.findIndex((attr) => {
            return attr.name === model.internalId;
          }),
          1
        )[0]
      )
    : tableColumns.unshift({ name: 'id', type: 'Int', readOnly: true });

  return tableColumns;
}
