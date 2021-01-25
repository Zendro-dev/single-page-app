/**
 * Models attributes
 * 
 */
const modelsAttributes = {
  'role': {
      "id": "Int",
      "name": "String",
      "description": "String",
  },
  'role_to_user': {
      "id": "Int",
      "userId": "Int",
      "roleId": "Int",
  },
  'user': {
      "id": "Int",
      "email": "String",
      "password": "String",
  },
  'no_assoc': {
      "idField": "String",
      "stringField": "String",
      "intField": "Int",
      "floatField": "Float",
      "datetimeField": "DateTime",
      "booleanField": "Boolean",
      "stringArrayField": "[String]",
      "intArrayField": "[Int]",
      "floatArrayField": "[Float]",
      "datetimeArrayField": "[DateTime]",
      "booleanArrayField": "[Boolean]",
  },
}

export default function getAttributes(filterName) {
  return {...modelsAttributes[filterName]};
}