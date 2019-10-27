import requestGraphql from './request'

/**
 * GraphQL API Queries
 */
export default {

    /**
     * getCountItems
     * 
     * Construct query to get count of items. Then do the query-request 
     * to GraphQL Server.
     * 
     * Query format:
     * 
     * {
     *      countModel( ${s} ) 
     * }
     * 
     * Where:
     *  ${s}: search parameter (optional)
     * 
     * 
     * @param {Object} model Object with model definition data
     * @param {String} url GraphQL Server url
     * @param {String} searchText Text string currently on search bar.
     */
    getCountItems (model, url, searchText){
        /**
         * Debug
         */
        console.log("getCountItems.model: ", model);

        //set
        const queryName = `count${model.names.namePlCp}`; //PlCp: pluralize-capitalized
        var modelAttributes = Object.keys(model.attributes);
        modelAttributes.unshift('id');


        /**
         * Debug
         */
        console.log("getCountItems.queryName: ", queryName);
        console.log("getCountItems.modelAttributes: ", modelAttributes);

        /*
          Set @search arg
        */
        var s = '';
        var query = '';

        if (searchText !== null && searchText !== '') {
            //make search fields
            var sf = '';
            for(var i=0; i<modelAttributes.length; i++)
            {
              /*
                For now: only add search fields of type: String
              */
              if(model.attributes[modelAttributes[i]] === 'String') {
                sf += `{field:${modelAttributes[i]}, value:{value:"%${searchText}%"}, operator:like},`
              }
            }

            //make search argument
            s = `search: {operator:or, search: [ ${sf} ]}`

            //make query with search argument
            query = `{ ${queryName}(${s}) }`;
        }
        else {
            //make query without search argument
            query = `{ ${queryName} }`;
        }

        /**
         * Debug
         */
        console.log("getCountItems.query: gql:\n", query);

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
     *      model(${s}, ${o}, ${p}) {
     *          ${atts}
     *      }
     * }
     * 
     * Where:
     *  ${s}: search parameter (optional)
     *  ${o}: order parameter (optional)
     *  ${p}: pagination parameter (required)
     *  ${atts}: model attributes list (required)
     * 
     * 
     * @param {Object} model Object with model definition data
     * @param {String} url GraphQL Server url
     * @param {String} searchText Text string currently on search bar.
     * @param {String} orderBy Order field string.
     * @param {String} orderDirection Text string: asc | desc.
     * @param {Number} paginationOffset Offset.
     * @param {Number} paginationLimit Max number of items to retreive.
     */
    getItems (model, url, searchText, orderBy, orderDirection, paginationOffset, paginationLimit) {
        //set
        const queryName = model.names.namePlLc; //PlLc: pluralize-lowercase
        var modelAttributes = Object.keys(model.attributes);
        modelAttributes.unshift('id');

        /*
          Construct search parameter
        */
        var s = null;
        if (searchText !== null && searchText !== '') {
            //make search fields
            var sf = '';
            for(var i=0; i<modelAttributes.length; i++)
            {
              /*
                For now: only add search fields of type: String
              */
              if(model.attributes[modelAttributes[i]] === 'String') {
                sf += `{field:${modelAttributes[i]}, value:{value:"%${searchText}%"}, operator:like},`
              }
            }

            //make search argument
            s = `search: {operator:or, search: [ ${sf} ]}`
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
                        ${queryName}(${s}, ${o}, ${p}) {
                            ${modelAttributes.join()} 
                        }
                    }`
            }//end: if has order
            else { //has not order
                //query with search & pagination
                query =
                    `{
                        ${queryName}(${s}, ${p}) {
                            ${modelAttributes.join()}  
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
                        ${queryName}(${o}, ${p}) {
                            ${modelAttributes.join()}  
                        }
                    }`
            }//end: if has order
            else { //has not order
                //query string with pagination only
                query =
                    `{
                        ${queryName}(${p}) {
                            ${modelAttributes.join()}  
                        }
                    }`
            }//end: else: has not order
        }//end: else: has not search
        
        /**
         * Debug
         */
        console.log("getData.query: gql:\n", query);

        //do request
        return requestGraphql({ url, query });
    }//end: getItems()
}
