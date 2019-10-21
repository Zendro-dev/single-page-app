import requestGraphql from './request'

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
     * @param {String} url GraphQL Server url
     * @param {String} searchText Text string currently on search bar.
     * @param {Object} orderBy Object with order properties.
     * @param {String} orderDirection Text string: asc | desc.
     * @param {Number} paginationOffset Offset.
     * @param {Number} paginationLimit Max number of items to retreive.
     */
    getItems(url, searchText, orderBy, orderDirection, paginationOffset, paginationLimit) {
        /*
          Construct search parameter
        */
        var s = null;
        if (searchText !== null && searchText !== '') {
            s = `search: {
                    operator:or, search: [
                        {field:name, value:{value:"%${searchText}%"}, operator:like}, 
                        {field:description, value:{value:"%${searchText}%"}, operator:like}, 
                    ]
                }`
        }
        /*
          Construct order parameter
        */
        var o = null;
        if (typeof orderBy !== 'undefined') {
            let upOrderDirection = String(orderDirection).toUpperCase();
            o = `order: [ {field: ${orderBy.field}, order: ${upOrderDirection}} ]`;
        }
        /*
          Construct pagination parameter
        */
        var p = `pagination: {offset: ${paginationOffset}, limit: ${paginationLimit}}`
        
        /*
          Construct graphQL query
        */
        var query = '';

        //if has search
        if (s !== null) {
            //if has order
            if (o != null) {
                //query with search & sort & pagination
                query =
                    `{
                        roles(${s}, ${o}, ${p}) {
                            id
                            name 
                            description 
                        }
                    }`
            }//end: if has order
            else { //has not order
                //query with search & pagination
                query =
                    `{
                        roles(${s}, ${p}) {
                            id
                            name 
                            description 
                        }
                    }`
            }//end: else: has not order
        }//end: if has search
        else { // has not search
            //if has order
            if (o != null) {
                //query with sort & pagination
                query =
                    `{
                        roles(${o}, ${p}) {
                            id
                            name 
                            description 
                        }
                    }`
            }//end: if has order
            else { //has not order
                //query string with pagination only
                query =
                    `{
                        roles(${p}) {
                            id
                            name 
                            description 
                        }
                    }`
            }//end: else: has not order
        }//end: else: has not search
        
        /**
         * Debug
         */
        console.log("query: gql:\n", query);

        //do request
        return requestGraphql({ url, query });
    }//end: getItems()
}
