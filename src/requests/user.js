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
     * getCount
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
     * 
     * @param {String} url GraphQL Server url
     * @param {String} searchText Text string currently on search bar.
     */
    getCount (url, searchText){
        /*
          Set @search arg
        */
        var s = '';
        var query = '';

        if (searchText !== null && searchText !== '') {
            //make search argument
            s = `search: {operator:or, search: [ 
                            {field:email, value:{value:"%${searchText}%"}, operator:like}, 
                            {field:password, value:{value:"%${searchText}%"}, operator:like}, 
                        ]}`
            //make query with search argument
            query = `{ countUsers(${s}) }`;
        }
        else {
            //make query without search argument
            query = `{ countUsers }`;
        }

        //do request
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
     *      users(${s}, ${o}, ${p}) {
     *          id
     *          email 
     *          password
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
     * @param {String} orderBy Order field string.
     * @param {String} orderDirection Text string: asc | desc.
     * @param {Number} paginationOffset Offset.
     * @param {Number} paginationLimit Max number of items to retreive.
     */
    getItems (url, searchText, orderBy, orderDirection, paginationOffset, paginationLimit) {
        /*
          Construct search parameter
        */
        var s = null;
        if (searchText !== null && searchText !== '') {
            s = `search: {
                operator:or, search: [
                    {field:email, value:{value:"%${searchText}%"}, operator:like}, 
                    {field:password, value:{value:"%${searchText}%"}, operator:like}, 
                ]
            }`
        }
        /*
          Construct order parameter
        */
        var o = null;
        if (orderBy !== '' && orderBy !== null) {
            let upOrderDirection = String(orderDirection).toUpperCase();
            o = `order: [ {field: ${orderBy}, order: ${upOrderDirection}} ]`;
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
                        users(${s}, ${o}, ${p}) {
                            id
                            email 
                            password 
                        }
                    }`
            }//end: if has order
            else { //has not order
                //query with search & pagination
                query =
                    `{
                        users(${s}, ${p}) {
                            id
                            email 
                            password 
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
                        users(${o}, ${p}) {
                            id
                            email 
                            password 
                        }
                    }`
            }//end: if has order
            else { //has not order
                //query string with pagination only
                query =
                    `{
                        users(${p}) {
                            id
                            email 
                            password 
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
