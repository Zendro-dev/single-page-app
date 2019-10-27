/**
 * Model: role
 */
export default {
    "model": "role",
    "storageType": "SQL",
    "attributes": {
        "name": "String",
        "description": "String"
    },
    "associations": {
        "users": {
            "type": "to_many",
            "target": "user",
            "targetKey": "userId",
            "sourceKey": "roleId",
            "keysIn": "role_to_user",
            "targetStorageType": "sql",
            "label": "email",
            "sublabel": "id"
        }
    },
    "names": {
        "name": "role",
        "nameCp": "Role",
        "nameLc": "role",
        "namePl": "roles",
        "namePlCp": "Roles",
        "namePlLc": "roles",
    },
    "toManys": [
        { 
          "relationName":"users",
          "relationNameCp":"Users",
          "targetModelLc":"user",
          "targetModelCp":"User",
          "targetModelPlLc":"users",
          "targetModelPlCp":"Users",
          "label":"email",
          "sublabel":"id"
        },
       ],
    "toOnes": [],
}