import requestGraphql from './request'

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
   *    countUsers( ${s} ) 
   * }
   * 
   * Where:
   *  ${s}: search parameter (optional)
   * 
   * 
   * @param {String} url GraphQL Server url
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  getCountItems(url, searchText, ops) {
    //search
    var s = getSearchArgument('user', searchText, ops);
    
    //query
    var query = '';

    //if has search
    if (s !== null) {
      query = `{ countUsers(${s}) }`;
    }
    else {
      query = `{ countUsers }`;
    }

    /**
     * Debug
     */
    console.log("getCountItems.query: gql:\n", query);

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
   * @param {String} url GraphQL Server url
   * @param {String} searchText Text string currently on search bar.
   * @param {String} orderBy Order field string.
   * @param {String} orderDirection Text string: asc | desc.
   * @param {Number} paginationOffset Offset.
   * @param {Number} paginationLimit Max number of items to retreive.
   * @param {String} ops Object with adittional query options.
   */
  getItems(url, searchText, orderBy, orderDirection, paginationOffset, paginationLimit, ops) {
    //search
    var s = getSearchArgument('user', searchText, ops);
    
    //order
    var o = null;
    if (orderBy !== '' && orderBy !== null) {
      let upOrderDirection = String(orderDirection).toUpperCase();
      o = `order: [ {field: ${orderBy}, order: ${upOrderDirection}} ]`;
    }
    
    //pagination
    var p = `pagination: {offset: ${paginationOffset}, limit: ${paginationLimit}}`

    //query
    var query = '';

    //if has search
    if (s !== null) {
      //if has order
      if (o != null) {
        //query with search & sort & pagination
        query =
          `{ users( ${s}, ${o}, ${p} ) {
            id, email, password 
           }}`
      }
      else { //has not order
        //query with search & pagination
        query =
          `{ users( ${s}, ${p} ) {
            id, email, password 
           }}`
      }
    }
    else { // has not search
      //if has order
      if (o != null) {
        //query with sort & pagination
        query =
          `{ users( ${o}, ${p} ) {
            id, email, password 
           }}`
      }
      else { //has not order
        //query string with pagination only
        query =
          `{ users( ${p} ) {
            id, email, password 
           }}`
      }
    }

    /**
     * Debug
     */
    console.log("getData.query: gql:\n", query);

    return requestGraphql({ url, query });

  }, //end: getItems()

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
   *      ${association}Filter(${s}, ${p}) {
   *        id
   *        ${label}
   *        ${sublabel}
   *      }
   *    }
   * }
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item id.
   * @param {String} association Association filter name.
   * @param {String} label Label name.
   * @param {String} sublabel Sublabel name.
   * @param {String} searchText Text string currently on search bar.
   * @param {Number} paginationOffset Offset.
   * @param {Number} paginationLimit Max number of items to retreive.
   * @param {String} ops Object with adittional query options.
   */
  getAssociationFilter(url, itemId, association, label, sublabel, searchText, paginationOffset, paginationLimit, ops) {
    associationCp = association.charAt(0).toUpperCase() + association.slice(1);
    
    //search
    var s = getSearchArgument(association, searchText, ops);

    //pagination
    var p = `pagination: {offset: ${paginationOffset}, limit: ${paginationLimit}}`

    //query
    var query = '';

    //if has search
    if (s !== null) {
      query = `{ readOneUser(id: ${itemId}) { ${association}Filter( ${s}, ${p} ) { id, ${label}, ${sublabel} }, countFiltered${associationCp}( ${s} ) } }`;
    }
    else {
      query = `{ readOneUser(id: ${itemId}) { ${association}Filter( ${p} ) { id, ${label}, ${sublabel} }, countFiltered${associationCp} } }`;
    }

    /**
     * Debug
     */
    console.log("getAssociationFilter.query: gql:\n", query);

    return requestGraphql({ url, query });
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
   * @param {Number} itemId Model item id.
   * @param {String} association Association filter name.
   */
  getAssociatedIds(url, itemId, association) {
    /*
      Get graphQL @query
    */
    var query = `{ readOneUser( id: ${itemId} ){ ${association}Filter{ id } } }`;

    /**
     * Debug
     */
    console.log("getAssociatedIds.query: gql:\n", query);

    //do request
    return requestGraphql({ url, query });
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
   * @param {Object} values Object with values to create new item. 
   */
  createItem(url, values) {
    /*
      Get graphQL @query
    */
    var query = 
      `mutation{ 
        addUser(
          email: "${values.email}", 
          password: "${values.password}", 
          addRoles: ${values.addRoles},
          ) 
          { 
            id,
            email,
            password, 
          } }`;

    /**
     * Debug
     */
    console.log("createItem.query: gql:\n", query);

    //do request
    return requestGraphql({ url, query });
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
   * @param {Number} itemId Model item id.
   * @param {Object} values Object with values to create new item. 
   */
  updateItem(url, itemId, values) {

    var query = 
        `mutation{ 
          updateUser(
            id: "${itemId}", 
            email: "${values.email}", 
            password: "${values.password}", 
            addRoles: ${values.addRoles},
            removeRoles: ${values.removeRoles},
            )
            { 
              id,
              email,
              password, 
            } }`;

    /**
     * Debug
     */
    console.log("updateItem.query: gql:\n", query);

    //do request
    return requestGraphql({ url, query });
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
   * @param {Number} itemId Model item id.
   */
  deleteItem(url, itemId) {
    /*
      Get graphQL @query
    */
    var query = `mutation{ deleteUser(id: ${itemId}) }`;

    /**
     * Debug
     */
    console.log("deleteItem.query: gql:\n", query);

    //do request
    return requestGraphql({ url, query });
  },
}

/**
 * Utils
 */
function getSearchArgument(filterName, searchText, ops) {
  
  filterAttributes = getSearchAttributes(filterName);
  var modelAttributes = Object.keys(filterAttributes.attributes);
  var ors = '';
  var orSearch = null;
  var ands = '';
  var andSearch = null;

  if (searchText !== null && searchText !== '') {

    /*
      Make AND fields
    */
    var words = searchText.split(' ');
    /**
     * Debug
     */
    console.log("@- words: ", words);

    //for each word
    for (var w = 0; w < words.length; w++) {
      /*
        Make OR fields
      */

      //for each attribute
      for (var i = 0; i < modelAttributes.length; i++) {
        let num = 0;
        let d = '';
        let t = '';
        let dt = '';

        console.log("@--switch: attType: ", model.attributes[modelAttributes[i]], "  att: ", modelAttributes[i]);

        /*
          Case (special): attribute: id
        */
        if (modelAttributes[i] === 'id') {
          console.log("@--s: case ID (INT): num: ", parseInt(words[w]));
          num = parseInt(words[w]);
          //add if: word is an integer number
          if (!isNaN(num)) {
            ors += `{field:${modelAttributes[i]}, value:{value:"${num}"}, operator:eq},`
          }
        } else {
          /*
            Other attributes
          */
          switch (model.attributes[modelAttributes[i]]) {
            case 'String':
              //add
              ors += `{field:${modelAttributes[i]}, value:{value:"%${words[w]}%"}, operator:like},`
              break;

            case 'Int':
              console.log("@--s: case Int: num: ", parseInt(words[w]));
              num = parseInt(words[w]);
              //add if: word is an integer number
              if (!isNaN(num)) {
                ors += `{field:${modelAttributes[i]}, value:{value:"${num}"}, operator:eq},`
              }
              break;

            case 'Float':
              num = parseFloat(words[w]);
              //add if: word is a float number
              if (!isNaN(num)) {
                ors += `{field:${modelAttributes[i]}, value:{value:"${num}"}, operator:eq},`
              }
              break;

            case 'Boolean':
              //add if: word is 'true' or 'false'
              if (words[w] === 'true' || words[w] === 'false') {
                ors += `{field:${modelAttributes[i]}, value:{value:"${words[w]}"}, operator:eq},`
              }
              break;

            case 'Date':
              d = getIsoDate(words[w]);
              //add if: word is an ISO date
              if (d !== '') {
                ors += `{field:${modelAttributes[i]}, value:{value:"${d}"}, operator:eq},`
              }
              break;

            case 'Time':
              t = getIsoTime(words[w]);
              //add if: word is an ISO time
              if (t !== '') {
                ors += `{field:${modelAttributes[i]}, value:{value:"${t}"}, operator:eq},`
              }
              break;

            case 'DateTime':
              dt = getIsoDateTime(words[w]);
              //add if: word is an ISO datetime
              if (dt !== '') {
                ors += `{field:${modelAttributes[i]}, value:{value:"${dt}"}, operator:eq},`
              }
              break;

            default:
              break;
          }
        }

        //make OR search argument
        orSearch = `{operator:or, search: [ ${ors} ]},`

        /**
         * Debug
         */
        console.log("@- orSearch[", i, "]: ", orSearch);

      }//end: for each attribute (ORs)

      //add to ANDs
      ands += orSearch;

    }//end: for each word (ANDs)

    /*
      Options
    */
    if (ops !== undefined && ops !== null && typeof ops === 'object') {

      /*
        -- 'only' option --
        For each field name in only array, an AND search argument will be added to search string. 

        Format:
          {
            only: [
              {
                values: {
                  'fieldName1': ['value1', 'value2', ..., 'valueN'],
                  ...
                  'fieldNameM': ['value1', 'value2', ..., 'valueN'],
                }
                type: 'type'
              },
              ...
              {
                values: {
                  'fieldName1': ['value1', 'value2', ..., 'valueN'],
                  ...
                  'fieldNameN': ['value1', 'value2', ..., 'valueN'],
                }
                type: 'type'
              }
            ]
          }
      */
      if (ops.hasOwnProperty('only') && Array.isArray(ops.only)) {
        let onlyOrs = '';
        let onlySearch = '';

        //for each only object
        for (var i = 0; i < ops.only.length; i++) {
          let o = ops.only[i];
          /*
            Switch type

            At the momment, just 'Int' type is supported for only option
          */
          if (o.type === 'Int') {
            let v = o.values;
            let vkeys = Object.keys(v);

            //for each key
            for (var k = 0; k < vkeys.length; k++) {
              let va = v[vkeys[k]]; //values array

              //for each value
              for (var kv = 0; kv < va.length; kv++) {
                let nvalue = parseInt(va[kv]);
                //add if: value is an integer number
                if (!isNaN(nvalue)) {
                  onlyOrs += `{field:${vkeys[k]}, value:{value:"${nvalue}"}, operator:eq},`
                }
              }//end: for earch value
            }//end: for earch key
          }//end: if type 'Int
        }//end: for earch only object

        onlySearch = `{operator:or, search: [ ${onlyOrs} ]},`;
        ands += onlySearch;

      }//end: if has 'only'

      /*
        -- 'exclude' option --
        For each field name in exclude array, an AND search argument will be added to search string. 

        Format:
          {
            exclude: [
              {
                values: {
                  'fieldName1': ['value1', 'value2', ..., 'valueN'],
                  ...
                  'fieldNameM': ['value1', 'value2', ..., 'valueN'],
                }
                type: 'type'
              },
              ...
              {
                values: {
                  'fieldName1': ['value1', 'value2', ..., 'valueN'],
                  ...
                  'fieldNameN': ['value1', 'value2', ..., 'valueN'],
                }
                type: 'type'
              }
            ]
          }
      */
      if (ops.hasOwnProperty('exclude') && Array.isArray(ops.exclude)) {
        //for each exclude object
        for (var i = 0; i < ops.exclude.length; i++) {
          let o = ops.exclude[i];
          /*
            Switch type

            At the momment, just 'Int' type is supported for exclude option
          */
          if (o.type === 'Int') {
            let v = o.values;
            let vkeys = Object.keys(v);

            //for each key
            for (var k = 0; k < vkeys.length; k++) {
              let va = v[vkeys[k]]; //values array

              //for each value
              for (var kv = 0; kv < va.length; kv++) {
                let nvalue = parseInt(va[kv]);
                //add if: value is an integer number
                if (!isNaN(nvalue)) {
                  ands += `{field:${vkeys[k]}, value:{value:"${nvalue}"}, operator:ne},`
                }
              }//end: for earch value
            }//end: for earch key
          }//end: if type 'Int
        }//end: for earch exclude object
      }//end: if has 'exclude'
    }//end: if has 'ops'

    //make search argument
    andSearch = `search: {operator:and, search: [ ${ands} ]}`
  }//end: if searchText
  else {
    /*
      Check: ops
    */
    /*
      Options
    */
    if (ops !== undefined && ops !== null && typeof ops === 'object') {
      /*
        -- 'only' option --
        For each field name in only array, an AND search argument will be added to search string. 
  
        Format:
          {
            only: [
              {
                values: {
                  'fieldName1': ['value1', 'value2', ..., 'valueN'],
                  ...
                  'fieldNameM': ['value1', 'value2', ..., 'valueN'],
                }
                type: 'type'
              },
              ...
              {
                values: {
                  'fieldName1': ['value1', 'value2', ..., 'valueN'],
                  ...
                  'fieldNameN': ['value1', 'value2', ..., 'valueN'],
                }
                type: 'type'
              }
            ]
          }
      */
      if (ops.hasOwnProperty('only') && Array.isArray(ops.only)) {
        let onlyOrs = '';
        let onlySearch = '';

        //for each only object
        for (var i = 0; i < ops.only.length; i++) {
          let o = ops.only[i];
          /*
            Switch type

            At the momment, just 'Int' type is supported for only option
          */
          if (o.type === 'Int') {
            let v = o.values;
            let vkeys = Object.keys(v);

            //for each key
            for (var k = 0; k < vkeys.length; k++) {
              let va = v[vkeys[k]]; //values array

              //for each value
              for (var kv = 0; kv < va.length; kv++) {
                let nvalue = parseInt(va[kv]);
                //add if: value is an integer number
                if (!isNaN(nvalue)) {
                  onlyOrs += `{field:${vkeys[k]}, value:{value:"${nvalue}"}, operator:eq},`
                }
              }//end: for earch value
            }//end: for earch key
          }//end: if type 'Int
        }//end: for earch only object

        onlySearch = `{operator:or, search: [ ${onlyOrs} ]},`;
        ands += onlySearch;

      }//end: if has 'only'

      /*
        -- 'exclude' option --
        For each field name in exclude array, an AND search argument will be added to search string. 
  
        Format:
          {
            exclude: [
              {
                values: {
                  'fieldName1': ['value1', 'value2', ..., 'valueN'],
                  ...
                  'fieldNameM': ['value1', 'value2', ..., 'valueN'],
                }
                type: 'type'
              },
              ...
              {
                values: {
                  'fieldName1': ['value1', 'value2', ..., 'valueN'],
                  ...
                  'fieldNameN': ['value1', 'value2', ..., 'valueN'],
                }
                type: 'type'
              }
            ]
          }
      */
      if (ops.hasOwnProperty('exclude') && Array.isArray(ops.exclude)) {

        //for each exclude object
        for (var i = 0; i < ops.exclude.length; i++) {
          let o = ops.exclude[i];
          /*
            Switch type
  
            At the momment, just 'Int' type is supported for exclude option key
          */
          if (o.type === 'Int') {
            let v = o.values;
            let vkeys = Object.keys(v);

            //for each key
            for (var k = 0; k < vkeys.length; k++) {
              let va = v[vkeys[k]]; //values array

              //for each value
              for (var kv = 0; kv < va.length; kv++) {
                let nvalue = parseInt(va[kv]);
                //add if: value is an integer number
                if (!isNaN(nvalue)) {
                  ands += `{field:${vkeys[k]}, value:{value:"${nvalue}"}, operator:ne},`
                }
              }//end: for earch value
            }//end: for earch key
          }//end: if type 'Int
        }//end: for earch exclude object
      }//end: if has 'exclude'

      //make search argument
      andSearch = `search: {operator:and, search: [ ${ands} ]}`
    }//end: if has 'ops'
  }//end: if !searchText

  return andSearch;
}

function getIsoDate(text) {
  //if has the form: aaaa[-/]mm[-/]dd
  if (/^\d{4}[-/][01]\d[-/][0-3]\d/.test(text)) {

    let m = text.slice(5, 7);
    let d = text.slice(8, 10);

    let numM = parseInt(m);
    let numD = parseInt(d);

    //if has the correct content
    if ((numM >= 1 && numM <= 12) && (numD >= 1 && numD <= 31)) {
      console.log("ISO Date ok: ", text);
      return text;
    }
  }
  return '';
}

function getSearchAttributes(filterName) {
  switch(filterName) {
    
    case 'user':
      return {
        "id": "Int",
        "name": "String",
        "description": "String"
      };
    case 'roles':
      return {
        "id": "Int",
        "email": "String",
        "password": "String",
      };    
    default:
      return {};
  }
}

function getIsoTime(text) {

  /**
   * Case: complete precision: hh:mm:ss.d+
   */
  if (/^[0-2]\d:[0-5]\d:[0-5]\d\.\d+/.test(text)) {

    let h = text.slice(0, 2);
    let numH = parseInt(h);

    if (numH >= 0 && numH <= 23) {
      console.log("ISO Time ok(1): ", text);
      return text;
    }

    return '';
  } else {
    /**
     * Case: no milliseconds: hh:mm:ss
     */
    if (/^[0-2]\d:[0-5]\d:[0-5]\d/.test(text)) {

      let h = text.slice(0, 2);
      let numH = parseInt(h);

      if (numH >= 0 && numH <= 23) {
        console.log("ISO Time ok(2): ", text);
        return text;
      }

      return '';
    } else {
      /**
       * Case: no seconds: hh:mm
       */
      if (/^[0-2]\d:[0-5]\d/.test(text)) {

        let h = text.slice(0, 2);
        let numH = parseInt(h);

        if (numH >= 0 && numH <= 23) {
          console.log("ISO Time ok(3): ", text);
          return text;
        }

        return '';
      }
    }
  }

  return '';
}

function getIsoDateTime(text) {

  /**
   * Case: complete precision: YYYY[-/]MM[-/]DD[ T]hh:mm:ss.d+
   */
  if (/^\d{4}[/-][01]\d[/-][0-3]\d[T ][0-2]\d:[0-5]\d:[0-5]\d\.\d+/.test(text)) {

    let M = text.slice(5, 7);
    let D = text.slice(8, 10);
    let h = text.slice(11, 13);

    let numM = parseInt(M);
    let numD = parseInt(D);
    let numH = parseInt(h);

    //if content ok
    if ((numM >= 1 && numM <= 12) && (numD >= 1 && numD <= 31) && (numH >= 0 && numH <= 23)) {
      console.log("ISO Date ok(1): ", text);
      return text;
    }

    return '';
  } else {
    /**
     * Case: no milliseconds: YYYY[-/]MM[-/]DD[ T]hh:mm:ss
     */
    if (/^\d{4}[/-][01]\d[/-][0-3]\d[T ][0-2]\d:[0-5]\d:[0-5]\d/.test(text)) {

      let M = text.slice(5, 7);
      let D = text.slice(8, 10);
      let h = text.slice(11, 13);

      let numM = parseInt(M);
      let numD = parseInt(D);
      let numH = parseInt(h);

      //if content ok
      if ((numM >= 1 && numM <= 12) && (numD >= 1 && numD <= 31) && (numH >= 0 && numH <= 23)) {
        console.log("ISO Date ok(2): ", text);
        return text;
      }

      return '';
    } else {
      /**
       * Case: no seconds: YYYY[-/]MM[-/]DD[ T]hh:mm
       */
      if (/^\d{4}[/-][01]\d[/-][0-3]\d[T ][0-2]\d:[0-5]\d/.test(text)) {

        let M = text.slice(5, 7);
        let D = text.slice(8, 10);
        let h = text.slice(11, 13);

        let numM = parseInt(M);
        let numD = parseInt(D);
        let numH = parseInt(h);

        //if content ok
        if ((numM >= 1 && numM <= 12) && (numD >= 1 && numD <= 31) && (numH >= 0 && numH <= 23)) {
          console.log("ISO Date ok(3): ", text);
          return text;
        }

        return '';
      } else {
        /**
         * Case: no time: YYYY[-/]MM[-/]DD
         */
        if (/^\d{4}[/-][01]\d[/-][0-3]\d/.test(text)) {

          let M = text.slice(5, 7);
          let D = text.slice(8, 10);

          let numM = parseInt(M);
          let numD = parseInt(D);

          //if content ok
          if ((numM >= 1 && numM <= 12) && (numD >= 1 && numD <= 31)) {
            console.log("ISO Date ok(4): ", text);
            return text;
          }

          return '';
        }
      }
    }
  }

  return '';
}filterName