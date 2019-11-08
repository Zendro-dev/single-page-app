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
     *      countUsers( ${s} ) 
     * }
     * 
     * Where:
     *  ${s}: search parameter (optional)
     * 
     * @param {Object} model Object with model definition data
     * @param {String} url GraphQL Server url
     * @param {String} searchText Text string currently on search bar.
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
     */
    getAssociationFilter(url, modelNames, itemId, associationNames, searchText, paginationOffset, paginationLimit) { 
      return queriesGraphql.getAssociationFilter(url, modelNames, itemId, associationNames, searchText, paginationOffset, paginationLimit);
    },
  
}