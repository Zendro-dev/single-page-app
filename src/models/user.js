/**
 * Model: user
 */
export default {
    "model": "user",
    "storageType": "SQL",
    "attributes": {
        "email": "String",
        "password": "String"
    },
    "associations": {
        "roles": {
            "type": "to_many",
            "target": "role",
            "targetKey": "roleId",
            "sourceKey": "userId",
            "keysIn": "role_to_user",
            "targetStorageType": "sql",
            "label": "name",
            "sublabel": "description"
        }
    },
    "names": {
        "name": "user",
        "nameCp": "User",
        "nameLc": "user",
        "namePl": "users",
        "namePlCp": "Users",
        "namePlLc": "users",
    },
    "toManys": [
        { 
          "relationName":"roles",
          "relationNameCp":"Roles",
          "targetModelLc":"role",
          "targetModelCp":"Role",
          "targetModelPlLc":"roles",
          "targetModelPlCp":"Roles",
          "label":"name",
          "sublabel":"description"
        },
       ],
    "toOnes": [],
}
