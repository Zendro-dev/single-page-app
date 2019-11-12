import requestGraphql from './request'
import queriesGraphql from './queries'

/**
 * GraphQL API Queries
 * 
 * Model: role
 */
export default {

    create: function ({ url, variables, token }) {
        let query = ` mutation addRole(
   $name:String  $description:String      $addUsers:[ID]  ){
    addRole(
     name:$name   description:$description           addUsers:$addUsers     ){id  name   description   }
  }
  `
        return requestGraphql({ url, query, variables, token });
    },


    readOneRole: function ({ url, variables, token }) {
        let query = `query readOneRole($id:ID!){
      readOneRole(id:$id){id  name   description               countFilteredUsers     }
    }`
        return requestGraphql({ url, query, variables, token });
    },

    update: function ({ url, variables, token }) {
        let query = `mutation updateRole($id:ID!
     $name:String  $description:String          $addUsers:[ID] $removeUsers:[ID]     ){
      updateRole(id:$id
       name:$name   description:$description               addUsers:$addUsers removeUsers:$removeUsers       ){id  name   description  }
    }`

        return requestGraphql({ url, query, variables, token });
    },

    deleteRole: function ({ url, variables, token }) {
        let query = `mutation deleteRole($id:ID!){
      deleteRole(id:$id)
    }`
        return requestGraphql({ url, query, variables, token });
    },

    tableTemplate: function ({ url }) {
        let query = `query {csvTableTemplateRole }`

        return requestGraphql({ url, query });
    },
    /**
     * getCountItems
     * 
     * Construct query to get count of items. Then do the query-request 
     * to GraphQL Server.
     * 
     * Query format:
     * 
     * {
     *      countRoles( ${s} ) 
     * }
     * 
     * Where:
     *  ${s}: search parameter (optional)
     * 
     * @param {Object} model Object with model definition data
     * @param {String} url GraphQL Server url
     * @param {String} searchText Text string currently on search bar.
     * @param {String} ops Object with adittional query options.
     */
    getCountItems (model, url, searchText, ops){
        return queriesGraphql.getCountItems(model, url, searchText, ops);
    },
    /**
     * getItems
     * 
     * Construct query to get items. Then do the query-request 
     * to GraphQL Server.
     * 
     * Query format:
     * 
     * {
     *      roles(${s}, ${o}, ${p}) {
     *          id
     *          name 
     *          description 
     *      }
     * }
     * 
     * Where:
     *  ${s}: search parameter (optional)
     *  ${o}: order parameter (optional)
     *  ${p}: pagination parameter (required)
     * 
     * 
     * @param {Object} model Object with model definition data
     * @param {String} url GraphQL Server url
     * @param {String} searchText Text string currently on search bar.
     * @param {Object} orderBy Object with order properties.
     * @param {String} orderDirection Text string: asc | desc.
     * @param {Number} paginationOffset Offset.
     * @param {Number} paginationLimit Max number of items to retreive.
     * @param {String} ops Object with adittional query options.
     */
    getItems(model, url, searchText, orderBy, orderDirection, paginationOffset, paginationLimit, ops) {
        return queriesGraphql.getItems(model, url, searchText, orderBy, orderDirection, paginationOffset, paginationLimit, ops);
    },
    /**
     * 
     *  
     * getAssociationFilter
     * 
     * Construct query to get associations filter of the given item model. 
     * Then do the query-request to GraphQL Server.
     * 
     * Query format:
     * 
     * {
     *    readOne${modelName}(id: ${itemId}) {
     *      ${association}Filter {
     *        id
     *        ${label}
     *        ${sublabel}
     *      }
     *    }
     * }
     * 
     * @param {String} url GraphQL Server url
     * @param {Object} modelNames Model names object.
     * @param {Number} itemId Model item id.
     * @param {Object} associationNames Association names object.
     * @param {String} label Label name.
     * @param {String} sublabel Sublabel name.
     * @param {Number} paginationOffset Offset.
     * @param {Number} paginationLimit Max number of items to retreive.
     * @param {String} ops Object with adittional query options.
     */
    getAssociationFilter(url, modelNames, itemId, associationNames, searchText, paginationOffset, paginationLimit, ops) { 
      return queriesGraphql.getAssociationFilter(url, modelNames, itemId, associationNames, searchText, paginationOffset, paginationLimit, ops);
    },
    /**
     * 
     *  
     * getAssociatedIds
     * 
     * Construct query to get association records ids associated to the given item model. 
     * Then do the query-request to GraphQL Server.
     * 
     * Query format:
     * 
     * {
     *    readOne${modelName}(id: ${itemId}) {
     *      ${association}Filter() {
     *        id
     *      }
     *    }
     * }
     * 
     * @param {String} url GraphQL Server url
     * @param {Object} modelNames Model names object.
     * @param {Number} itemId Model item id.
     * @param {Object} associationNames Association names object.
     */
    getAssociatedIds(url, modelNames, itemId, associationNames) {
      return queriesGraphql.getAssociatedIds(url, modelNames, itemId, associationNames);
    },
    /**
     * createItem
     * 
     * Construct query to add new item. Then do the query-request 
     * to GraphQL Server.
     * 
     * Query format:
     * 
     * mutation{
     *  add${Model}(${attributesToAdd}) {
     *    ${attributesToGet}
     *  } 
     * }
     * 
     * 
     * Where:
     *  ${Model}: name (capitalized) of the model.
     *  ${attributesToAdd}: attributes to add.
     *  ${attributesToGet}: attributes returned by mutation.
     * 
     * @param {String} url GraphQL Server url.
     * @param {Object} modelNames Object with model names.
     * @param {Array} attributesValues Array of objects with attributes names and values. 
     * @param {Array} asssociationsIds Array of objects with association names and ids to add.
     */
    createItem(url, modelNames, attributesValues, asssociationsIds) {
      return queriesGraphql.createItem(url, modelNames, attributesValues, asssociationsIds);
    },
    /**
     * updateItem
     * 
     * Construct query to update item. Then do the query-request 
     * to GraphQL Server.
     * 
     * Query format:
     * 
     * mutation{
     *  update${Model}(${attributesToUpdate}) {
     *    ${attributesToGet}
     *  } 
     * }
     * 
     * 
     * Where:
     *  ${Model}: name (capitalized) of the model.
     *  ${attributesToUpdate}: attributes to update.
     *  ${attributesToGet}: attributes returned by mutation.
     * 
     * @param {String} url GraphQL Server url.
     * @param {Object} modelNames Object with model names.
     * @param {Number} itemId Model item id.
     * @param {Array} attributesValues Array of objects with attributes names and values. 
     * @param {Array} asssociationsIdsToAdd Array of objects with association names and ids to add.
     * @param {Array} asssociationsIdsToRemove Array of objects with association names and ids to remove.
     */
    updateItem(url, modelNames, itemId, attributesValues, asssociationsIdsToAdd, asssociationsIdsToRemove) {
      return queriesGraphql.updateItem(url, modelNames, itemId, attributesValues, asssociationsIdsToAdd, asssociationsIdsToRemove);
    },
    /**
     * deleteItem
     * 
     * Construct query to delete an item. Then do the query-request 
     * to GraphQL Server.
     * 
     * Query format:
     * 
     * mutation{
     *  delete${Model}(id: ${id}) 
     * }
     * 
     * 
     * Where:
     *  ${Model}: name (capitalized) of the model.
     *  ${id}: Id of item that will be delete.
     * 
     * @param {String} url GraphQL Server url.
     * @param {Object} modelNames Object with model names.
     * @param {Number} itemId Model item id.
     */
    deleteItem(url, modelNames, itemId) {
      return queriesGraphql.deleteItem(url, modelNames, itemId);
    }
}
