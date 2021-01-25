import { requestGraphql, checkResponse, getSearchArgument, logRequest } from '../utils'
import globals from '../config/globals';

export default {

/**
 * Root query
 * ----------
 */
  /**
   * tableTemplate
   *
   * Get usertable template from GraphQL Server.
   * (root query)
   *
   * @param {String} url GraphQL Server url
   */
  async tableTemplate(url) {
    let graphqlErrors = [];
    let query = `query {csvTableTemplateUser}`;

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('tableTemplate', query );

    //request
    let response = await requestGraphql({ url, query });
    let headers = null;
    //check
    let check = checkResponse(response, graphqlErrors, "csvTableTemplateUser");
    if(check === 'ok') {
      //check type
      if(!Array.isArray(response.data.data["csvTableTemplateUser"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      headers = response.data.data["csvTableTemplateUser"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: headers, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },

/**
 * Root query
 * ----------
 */

  /**
   * getCountItems
   *
   * Get usersitems count from GraphQL Server.
   * (root query)
   *
   * @param {String} url GraphQL Server url
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getCountItems(url, searchText, ops) {
    let graphqlErrors = [];
    let variables = {};
    //search
    let s = getSearchArgument('user', searchText, ops, 'object');
    if(s) variables.search = s.search;

    //query
    let query =
      `query countUsers($search: searchUserInput) { 
             countUsers( search: $search ) }`
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getCountItems', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "countUsers");
    if(check === 'ok') {
      //check type
      if(!Number.isInteger(response.data.data["countUsers"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["countUsers"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },

/**
 * Root query
 * ----------
 */

  /**
   * getItems
   *
   * Get items from GraphQL Server.
   *
   * @param {String} url GraphQL Server url
   * @param {String} searchText Text string currently on search bar.
   * @param {String} orderBy Order field string.
   * @param {String} orderDirection Text string: asc | desc.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with additional query options.
   */
  async getItems(url, searchText, orderBy, orderDirection, variables, ops) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
    let graphqlErrors = [];

    //search
    let s = getSearchArgument('user', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //order
    if(orderBy && orderDirection) {
      let upOrderDirection = String(orderDirection).toUpperCase();
      variables.order = [ {field: orderBy, order: upOrderDirection} ]
    }

    //set attributes
    let qattributes = 
      `id,
       email,
       password,
`;

    //query
    let query =
      `query usersConnection($order: [orderUserInput], $search: searchUserInput, $pagination: paginationCursorInput!) { 
             usersConnection( order: $order, search: $search, pagination: $pagination ) {
                pageInfo { startCursor, endCursor, hasPreviousPage, hasNextPage }
                edges { node { ${qattributes} }}
       }}`

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getItems', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    let check = checkResponse(response, graphqlErrors, "usersConnection");
    if(check === 'ok') {
      //check type
      if(!response.data.data["usersConnection"]
      || typeof response.data.data["usersConnection"] !== 'object'
      || !Array.isArray(response.data.data["usersConnection"].edges)
      || typeof response.data.data["usersConnection"].pageInfo !== 'object' 
      || response.data.data["usersConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["usersConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },

/**
 * Root mutation
 * -------------
 */

    /**
   * createItem
   *
   * Add new User item on GraphQL Server.
   * (root mutation)
   *
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to create new User item.
   */
  async createItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    //set variables declarations
    let qvariables = `
          $email:String,
          $password:String,
          $addRoles: [ID],
`;

    //set parameters assignation
    let qparameters = `
            email:$email,
            password:$password,
            addRoles: $addRoles,
`;

    //set attributes to fetch
    let qattributes = 
      `id,
       email,
       password,
`;

    //query
    let query =
      `mutation addUser(
          ${qvariables}
          ) { addUser(
          ${qparameters}
          ) {
          ${qattributes}
          } }`;

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('createItem', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let item = null;
    //check
    let check = checkResponse(response, graphqlErrors, "addUser");
    if(check === 'ok') {
        //check type
        if(!response.data.data["addUser"]
        || typeof response.data.data["addUser"] !== 'object')
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        item = response.data.data["addUser"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: item, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },

/**
 * Root mutation
 * -------------
 */

  /**
   * updateItem
   *
   * Update User item on GraphQL Server.
   * (root mutation)
   *
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to update the given User item.
   */
  async updateItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    //set variables declarations
    let qvariables = `
          $id:ID!,
          $email:String,
          $password:String,
          $addRoles: [ID],
          $removeRoles: [ID],
`;

    //set parameters assignation
    let qparameters = `
            id:$id,
            email: $email,
            password: $password,
            addRoles: $addRoles,
            removeRoles: $removeRoles,
`;

    //set attributes to fetch
    let qattributes = 
      `id,
       email,
       password,
`;

    //query
    let query =
      `mutation updateUser(
          ${qvariables}
          ) { updateUser(
          ${qparameters}
          ) {
          ${qattributes}
          } }`;

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('updateItem', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let item = null;
    //check
    let check = checkResponse(response, graphqlErrors, "updateUser");
    if(check === 'ok') {
        //check type
        if(!response.data.data["updateUser"]
        || typeof response.data.data["updateUser"] !== 'object')
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        item = response.data.data["updateUser"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: item, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },

/**
 * Root mutation
 * -------------
 */

  /**
   * deleteItem
   *
   * Delete an item on GraphQL Server.
   * (root mutation)
   *
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values needed to delete the User item.
   */
  async deleteItem(url, variables) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    let query =
      `mutation 
            deleteUser(
              $id:ID!
        ) { deleteUser(
              id:$id        ) }`;

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('deleteItem', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let result = null;
    //check
    let check = checkResponse(response, graphqlErrors, "deleteUser");
    if(check === 'ok') {
      //check type
      if(response.data.data["deleteUser"] === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      result = response.data.data["deleteUser"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: result, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getRoles   *
   * Get roles records associated to the given user record
   * through association 'Roles', from GraphQL Server.
   *
   *
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {Object} variables Object with cursor-based-pagination variables.
   * @param {String} ops Object with adittional query options.
   */
  async getRoles(url, itemId, searchText, variables, ops) {
    //internal checks
    if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
    if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
    let graphqlErrors = [];

    //set attributes
    let qattributes = 
    `id,
     name,
     description,
`;

    variables["id"] = itemId;
    //set search
    let s = getSearchArgument('role', searchText, ops, 'object');
    if(s) variables.search = s.search;
    let qbody = `
          pageInfo {startCursor, endCursor, hasPreviousPage, hasNextPage},
          edges {
            node {
              ${qattributes}
            }
          }`;

    let query =
      `query readOneUser($id:ID!, $search: searchRoleInput, $pagination: paginationCursorInput!) {
             readOneUser(id:$id) {
                rolesConnection(search: $search, pagination: $pagination) {
                  ${qbody},
                },
             }}`;
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getRoles', query, variables);

//request
    let response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneUser");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneUser"]
      || typeof response.data.data["readOneUser"] !== 'object'
      || !response.data.data["readOneUser"]["rolesConnection"]
      || typeof response.data.data["readOneUser"]["rolesConnection"] !== 'object'
      || !Array.isArray(response.data.data["readOneUser"]["rolesConnection"].edges)
      || typeof response.data.data["readOneUser"]["rolesConnection"].pageInfo !== 'object' 
      || response.data.data["readOneUser"]["rolesConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      items = response.data.data["readOneUser"]["rolesConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: items, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getRolesCount
   * 
   * Get roles records count associated to the given user record
   * through association 'Roles', from GraphQL Server.
   * 
   * 
   * @param {String} url GraphQL Server url
   * @param {Number} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getRolesCount(url, itemId, searchText, ops) {
    let graphqlErrors = [];

    let variables = {"id": itemId};
    //search
    let s = getSearchArgument('role', searchText, ops, 'object');
    if(s) variables.search = s.search;
    //query
    let query =
      `query readOneUser($id:ID!, $search: searchRoleInput) { 
             readOneUser(id:$id) {
              countFilteredRoles(search: $search) 
       }}`

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getRolesCount', query, variables);
    
    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, "readOneUser");
    if(check === 'ok') {
      //check type
      if(!response.data.data["readOneUser"]
      || typeof response.data.data["readOneUser"] !== 'object'
      || !Number.isInteger(response.data.data["readOneUser"]["countFilteredRoles"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      count = response.data.data["readOneUser"]["countFilteredRoles"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: count, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

  /**
   * getNotAssociatedRolesCount
   *
   * Get count of not associated Roles from GraphQL Server.
   *
   * @param {String} url GraphQL Server url.
   * @param {String} itemId Model item internalId.
   * @param {String} searchText Text string currently on search bar.
   * @param {String} ops Object with adittional query options.
   */
  async getNotAssociatedRolesCount(url, itemId, searchText, ops) {
    let graphqlErrors = [];
    /**
     * Algorithm:
     *    1. get count of all associtation items (countA).
     *    2. get count of all associated items (countB).
     *    3. @return (countA - countB).
     *  
     */

    /**
     *    1. get count of all associtation items (countA).
     * 
     */
    let variables = {};
    //search
    let s = getSearchArgument('role', searchText, ops, 'object');
    if(s) variables.search = s.search;

    //set query
    let query = 
     `query countRoles($search: searchRoleInput) {
            countRoles(search: $search) }`;
    
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getNotAssociatedRolesCount.query1', query, variables);
    //request
    let response = await requestGraphql({ url, query, variables });
    let countA = null;
    //check
    let check = checkResponse(response, graphqlErrors, "countRoles");
    if(check === 'ok') {
      //check type
      if(!Number.isInteger(response.data.data["countRoles"])) 
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      countA = response.data.data["countRoles"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    /**
     *    2. get count of all associated items (countB).
     *  
     */
    variables = {};
    //id
    variables["id"] = itemId;
    //search
    if(s) variables.search = s.search;
    //query
    query =
      `query readOneUser($id:ID!, $search: searchRoleInput) { 
             readOneUser(id:$id) {
              countFilteredRoles(search: $search) 
       }}`

    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest('getRolesCount.query2', query, variables);
    //request
    response = await requestGraphql({ url, query, variables });
    let countB = null;
    //check
    check = checkResponse(response, graphqlErrors, "readOneUser");
    if(check === 'ok') {
      //check types
      if(!response.data.data["readOneUser"]
      ||typeof response.data.data["readOneUser"] !== 'object'
      || !Number.isInteger(response.data.data["readOneUser"]["countFilteredRoles"])
      ) return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      
      //get value
      countB = response.data.data["readOneUser"]["countFilteredRoles"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

    //return value
    return {value: (countA - countB), message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  },


/**
 * Filter
 * ------
 */

/**
 * getNotAssociatedRoles
 *
 * Get not associated Roles items from GraphQL Server.
 *
 * @param {String} url GraphQL Server url.
 * @param {String} itemId Model item internalId.
 * @param {String} searchText Text string currently on search bar.
 * @param {Object} variables Object with cursor-based-pagination variables.
 * @param {String} ops Object with additional query options.
 * @param {Int}    batchSize Max number of records to fetch in batch from GraphQL Server.
 */
async getNotAssociatedRoles(url, itemId, searchText, variables, ops, batchSize) {
   //internal checks
   if(!variables||typeof variables !== 'object') throw new Error("internal_error: expected object 'variables' argument");
   if(!variables.pagination||typeof variables.pagination !== 'object' ) throw new Error("internal_error: pagination object expected in variables");
    if(!variables.pagination.first&&!variables.pagination.last ) throw new Error("internal_error: pagination first or last positive argument expected");
  let graphqlErrors = [];

  //set attributes
  let qattributes = 
    `id,
     name,
     description,
`;
  /**
   * Recursive fetch of not associated items algorithm (cursor-based-pagination):
   *  1 Until @requiredItems are fetched, do:
   *    1.2 Get @requiredItems ( equal to @first or @last ) minus lenght.of( @notAssociatedItems already fetched) items, 
   *        where each item will be fetched with the correspondent associationConnection, which in turn will be 
   *        filtered by the current itemId. The resulting associationConnection will contain a non-empty edges-array if
   *        the current item is associated or an empty edges-array otherwise.
   *    1.3 Join fetched items in 1.2 with previous ones if any: in @notAssociatedItemsEdges array.
   *        Only the items with an empty edges-array in its associationConnection will be added.
   *    1.4 Check number of fetched items:
   *        1.4.1  If: fetched items are less than the requested number of items in 1.2 and there are more items:
   *               1.4.1.1 Adjust pagination to get the next batch of items.
   *               1.4.1.2 @continue with next iteration.
   *        1.4.2  Else: fetched items are equal to the requested number of items in 1.2 or there are no more items: 
   *               1.4.2.1 Return Connection with edges and pageInfo properly configured.  
   *               1.4.2.2 @done
   */
  //set direction
  let isForward = variables.pagination.first ? true : false;
  //set required number of items
  let requiredItems = isForward ? variables.pagination.first : variables.pagination.last;

  /**
   * Initialize batch query
   * 
   */
  //pagination
  let batchPagination = {...variables.pagination, first: isForward ? batchSize : null, last: !isForward ? batchSize : null};
  //search
  let batchSearch = getSearchArgument('role', searchText, ops, 'object');
  //variables
  let batchVariables = {"id": itemId, pagination: batchPagination};
  if(batchSearch) batchVariables.search = batchSearch.search;
  
  let batchQuery = 
        `query rolesConnection($id: String, $search: searchRoleInput, $pagination: paginationCursorInput!) {
               rolesConnection(search: $search, pagination: $pagination) {
                  pageInfo {startCursor endCursor hasPreviousPage hasNextPage}
                  edges {node {
                    ${qattributes}
                    usersConnection(
                      search: {field: id, value: $id, valueType: Int, operator: eq },
                      pagination: {first: 1}){ edges {node {id}}}
          }}}}`;

  //initialize results
  let nonaPageInfo = {startCursor: null, endCursor: null, hasPreviousPage: false, hasNextPage: false};
  let nonaEdges = [];

  //batch counter
  let iteration = 1;
  
   /**
   * Recursive fetch of not associated items algorithm (cursor-based-pagination):
   *  1 Until @requiredItems are fetched, do:
   * 
   */
  while(nonaEdges.length < requiredItems) {    
    /**
     *    1.2 Get @requiredItems ( equal to @first or @last ) minus lenght.of( @notAssociatedItems already fetched) items, 
     *        where each item will be fetched with the correspondent associationConnection, which in turn will be 
     *        filtered by the current itemId. The resulting associationConnection will contain a non-empty edges-array if
     *        the current item is associated or an empty edges-array otherwise.
     * 
     */
    /**
     * Debug
     */
    if(globals.REQUEST_LOGGER) logRequest(`getNotAssociatedRoles.batch.${iteration}`, batchQuery, batchVariables);

    //request
    let response = await requestGraphql({ url, query:batchQuery, variables:batchVariables });
    let batchConnection = null;
    //check
    let check = checkResponse(response, graphqlErrors, "rolesConnection");
    if(check === 'ok') {
      //check type
      if(!response.data.data["rolesConnection"]
      || typeof response.data.data["rolesConnection"] !== 'object'
      || !Array.isArray(response.data.data["rolesConnection"].edges)
      || typeof response.data.data["rolesConnection"].pageInfo !== 'object'
      || response.data.data["rolesConnection"].pageInfo === null)
      return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //get value
      batchConnection = response.data.data["rolesConnection"];
    } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
    
    /**
     *    1.3 Join fetched items in 1.2 with previous ones if any: in @notAssociatedItemsEdges array.
     *        Only the items with an empty edges-array in its associationConnection will be added.
     * 
     */
    //get all not associated in current batch
    let batchEdges = [];
    for(let i=0; (i<batchConnection.edges.length && nonaEdges.length<requiredItems); i++) {          
        //check: not associated item
        if(batchConnection.edges[i].node["usersConnection"].edges.length === 0) {
        
          //new non-associated edge
          let edge = {...batchConnection.edges[i]};

          //push new edge
          batchEdges.push(edge);
        }
    }
    let thereAreMoreNonaItems = (batchEdges.length > (requiredItems - nonaEdges.length));

    if(batchEdges.length > 0) { //if there are new non-associated items... 
      //adjust pageInfo (start)
      if(nonaEdges.length === 0) {
        if(isForward) {
          nonaPageInfo.startCursor = batchEdges[0].cursor;
          nonaPageInfo.hasPreviousPage = batchConnection.pageInfo.hasPreviousPage;
        } else {
          nonaPageInfo.endCursor = batchEdges[batchEdges.length-1].cursor;
          nonaPageInfo.hasNextPage = batchConnection.pageInfo.hasNextPage;
        }
      } 
      //join new items
      if(isForward) nonaEdges = [...nonaEdges, ...batchEdges.slice(0, (requiredItems - nonaEdges.length)) ];
      else          nonaEdges = [...batchEdges.slice(-(requiredItems - nonaEdges.length)), ...nonaEdges ];
    }

    /**
     *    1.4 Check number of fetched items:
     *        1.4.1  If: fetched items are less than the requested number of items in 1.2 and there are more items:
     *               1.4.1.1 Adjust pagination to get the next batch of items.
     *               1.4.1.2 @continue with next iteration.
     *        1.4.2  Else: fetched items are equal to the requested number of items in 1.2 or there are no more items: 
     *               1.4.2.1 Return Connection with edges and pageInfo properly configured.  
     *               1.4.2.2 @done
     * 
     */
    let thereAreMoreItems = isForward ? batchConnection.pageInfo.hasNextPage : batchConnection.pageInfo.hasPreviousPage;

    if(nonaEdges.length < requiredItems && thereAreMoreItems) {
      //adjust pagination for next batch associated ids
      batchPagination.after = isForward ? batchConnection.pageInfo.endCursor : null;
      batchPagination.before = !isForward ? batchConnection.pageInfo.startCursor : null;
      batchPagination.includeCursor = false;
      batchVariables.pagination = batchPagination;

      //continue with next iteration...
      iteration++;
    } else {
      
      //adjust pagination info (end)
      if(nonaEdges.length > 0) {
        if(isForward) {
          nonaPageInfo.endCursor = nonaEdges[nonaEdges.length - 1].cursor;
          nonaPageInfo.hasNextPage = batchConnection.pageInfo.hasNextPage || thereAreMoreNonaItems;
        } else {
          nonaPageInfo.startCursor = nonaEdges[0].cursor;
          nonaPageInfo.hasPreviousPage = batchConnection.pageInfo.hasPreviousPage || thereAreMoreNonaItems;
        }
      }

      //delete innerConnecton and cursor
      for(let i=0; i<nonaEdges.length; i++) {
        delete nonaEdges[i].node["usersConnection"];
        delete nonaEdges[i].cursor;
      }

      //return value
      return {value: {pageInfo: nonaPageInfo, edges: nonaEdges}, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
    }
  }//end: while()

  /////////////////////////////
  /**
   * Alternative algorithm.
   * 
   * Fetch not associated items excluding associated ones in batches.
   */
  /////////////////////////////
  // /**
  //  * Recursive fetch of not associated items algorithm (cursor-based-pagination):
  //  *  1 Until @requiredItems are fetched, do:
  //  *    1.1 Get @batchSize associated ids.
  //  *    1.2 Get @requiredItems ( equal to @first or @last ) minus lenght.of( @notAssociatedItems already fetched) items, 
  //  *        with a search filter excluding the set of associated ids fetched at 1.1 and not exceeding the last (or first) 
  //  *        associated id in this set.
  //  *    1.3 Join fetched items in 1.2 with previous ones if any: in @notAssociatedItemsEdges array.
  //  *    1.4 Check number of items fetched:
  //  *        1.4.1  If: fetched items are less than the requested number of items in 1.2 and there are more items:
  //  *               1.4.1.1 Adjust pagination to get the next batch of associated ids and next not-associated items page.
  //  *               1.4.1.2 @continue with next iteration.
  //  *        1.4.2  Else: fetched items are equal to the requested number of items in 1.2 or there are no more items:
  //  *               1.4.2.1 Return Connection with edges and pageInfo properly configured. 
  //  *               1.4.2.2 @done
  //  */

  // //set direction
  // let isForward = variables.pagination.first ? true : false;
  // //set required number of items
  // let requiredItems = isForward ? variables.pagination.first : variables.pagination.last;
  // //set general search filters
  // let s = getSearchArgument('role', searchText, ops, 'object');

  // /**
  //  * Initialize batch query
  //  * 
  //  */
  // //pagination
  // let batchPagination = {...variables.pagination, first: isForward ? batchSize : null, last: !isForward ? batchSize : null, includeCursor: false};
  // //search
  // let batchSearch = s ? {...s} : null;
  // //variables
  // let batchVariables = {"id": itemId, pagination: batchPagination};
  // if(batchSearch) batchVariables.search = batchSearch.search;
  // //query
  // let batchQuery = 
  //       `query readOneUser($id:ID!, $search: searchRoleInput, $pagination: paginationCursorInput!) {
  //              readOneUser(id: $id) {
  //                 rolesConnection( search: $search, pagination: $pagination ) {
  //                   pageInfo {startCursor endCursor hasPreviousPage hasNextPage}
  //                   edges {node {id}}
  //         }}}`;

  // /**
  //  * Initialize non-associated items query
  //  * 
  //  */
  // //pagination
  // let nonaPagination = {...variables.pagination};
  // //search
  // let nonaSearch = null; //will be set in each iteration
  // //variables
  // let nonaVariables = {pagination: nonaPagination};
  // //query
  // let nonaQuery =
  //       `query rolesConnection($search: searchRoleInput, $pagination: paginationCursorInput!) {
  //              rolesConnection( search: $search, pagination: $pagination ) {
  //                 pageInfo {startCursor endCursor hasPreviousPage hasNextPage}
  //                 edges {node {${qattributes}}}
  //         }}`;

  // //initialize final results
  // let nonaPageInfo = {startCursor: null, endCursor: null, hasPreviousPage: false, hasNextPage: false};
  // let nonaEdges = [];

  // /**
  //  * Recursive fetch of not associated items algorithm (cursor-based-pagination):
  //  *  1 Until @requiredItems are fetched, do:
  //  * 
  //  */
  // let iteration = 1;
  // while(nonaEdges.length < requiredItems) {
  //   /**
  //    * 1.1 Get @batchSize associated ids.
  //    * 
  //    */

  //   /**
  //    * Debug
  //    */
  //   if(globals.REQUEST_LOGGER) logRequest(`getNotAssociatedRoles.batch.${iteration}`, batchQuery, batchVariables);

  //   //request
  //   let response = await requestGraphql({ url, query:batchQuery, variables:batchVariables });
  //   let batchConnection = null;
  //   //check
  //   let check = checkResponse(response, graphqlErrors, "readOneUser");
  //   if(check === 'ok') {
  //     //check type
  //     if(!response.data.data["readOneUser"]
  //     || typeof response.data.data["readOneUser"] !== 'object'
  //     || response.data.data["readOneUser"]["rolesConnection"] === null
  //     || typeof response.data.data["readOneUser"]["rolesConnection"] !== 'object'
  //     || !Array.isArray(response.data.data["readOneUser"]["rolesConnection"].edges)
  //     || typeof response.data.data["readOneUser"]["rolesConnection"].pageInfo !== 'object' 
  //     || response.data.data["readOneUser"]["rolesConnection"].pageInfo === null)
  //     return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

  //     //get value
  //     batchConnection = response.data.data["readOneUser"]["rolesConnection"];
  //   } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
    
  //   //get ids to exclude
  //   let idsToExclude = batchConnection.edges.map(o => o.node.id);

  //   /**
  //    * Debug
  //    */
  //   console.log("@@-- iteration: ", iteration);
  //   console.log("@@-- requiredItems: ", requiredItems);
  //   console.log("@@-- batchConnection: ", batchConnection);
  //   console.log("@@-- idsToExclude: ", idsToExclude);

  //   /**
  //    * 1.2 Get @requiredItems ( equal to @first or @last ) minus lenght.of( @notAssociatedItems already fetched) items, 
  //    *      with a search filter excluding the set of associated ids fetched at 1.1 and not exceeding the last (or first) 
  //    *      associated id in this set.
  //    */
  //   //init with general search
  //   nonaSearch = s ? {...s} : null;
  
  //   //case: there are associated items to exclude...
  //   if(idsToExclude.length > 0) {
  //     //add exclusions
  //     let nonaOps = {
  //       exclude: [{
  //         type: 'Int',
  //         values: {"id": idsToExclude}
  //       }]
  //     };
      
  //     //set exclusion filters (ands)
  //     let nonaSearchB = getSearchArgument('role', null, nonaOps, 'object');

  //     //set filter to limit results
  //     if(isForward) {
  //       //case: there are more associated ids...
  //       if(batchConnection.pageInfo.hasNextPage) {
  //         //make filter to limit results to before the last associated id.
  //         let f1 = {field: "id", valueType: Int, value: idsToExclude[idsToExclude.length-1], operator: "lt"};
  //         //add filter
  //         nonaSearchB.search.search.push(f1);
  //       }
  //     } else { //isBackward
  //       //case: there are more associated ids...
  //       if(batchConnection.pageInfo.hasPreviousPage) {
  //         //make filter to limit results to after the first associated id.
  //         let f1 = {field: "id", valueType: Int, value: idsToExclude[0], operator: "gt"};
  //         //add filter
  //         nonaSearchB.search.search.push(f1);
  //       }
  //     }

  //     //join search filters
  //     if(nonaSearch) nonaSearch.search.search = [...nonaSearch.search.search, ...nonaSearchB.search.search];
  //     else           nonaSearch = nonaSearchB;
  //   }
  //   //add search to variables
  //   if(nonaSearch) nonaVariables.search = nonaSearch.search;

  //   /**
  //    * Debug
  //    */
  //   if(globals.REQUEST_LOGGER) logRequest(`getNotAssociatedRoles.nonAssociatedBatch.${iteration}`, nonaQuery, nonaVariables);
    
  //   //request
  //   response = await requestGraphql({ url, query:nonaQuery, variables:nonaVariables });
  //   let nonaConnection = null;
  //   //check
  //   check = checkResponse(response, graphqlErrors, "rolesConnection");
  //   if(check === 'ok') {
  //     //check type
  //     if(!response.data.data["rolesConnection"]
  //     || typeof response.data.data["rolesConnection"] !== 'object'
  //     || !Array.isArray(response.data.data["rolesConnection"].edges)
  //     || typeof response.data.data["rolesConnection"].pageInfo !== 'object' 
  //     || response.data.data["rolesConnection"].pageInfo === null)
  //     return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

  //     //get value
  //     nonaConnection = response.data.data["rolesConnection"];
  //   } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

  //   /**
  //    * Debug
  //    */
  //   console.log("@@-- nonaConnection: ", nonaConnection);

  //   /**
  //    * 1.3 Join fetched items in 1.2 with previous ones if any: in @notAssociatedItemsEdges array.
  //    */
  //   if(nonaConnection.edges.length > 0) { //if there are new items...
  //     //adjust pageInfo for the first non associated items
  //     if(nonaEdges.length === 0) {
  //       nonaPageInfo = { ...nonaConnection.pageInfo};
  //     } else {  //adjust pageInfo for the last non associated items
  //       if(isForward) {
  //         nonaPageInfo.endCursor = nonaConnection.pageInfo.endCursor;
  //         nonaPageInfo.hasNextPage = nonaConnection.pageInfo.hasNextPage;
  //       } else {
  //         nonaPageInfo.startCursor = nonaConnection.pageInfo.startCursor;
  //         nonaPageInfo.hasPreviousPage = nonaConnection.pageInfo.hasPreviousPage;
  //       }
  //     } 
  //     //join new items      
  //     if(isForward) nonaEdges = [...nonaEdges, ...nonaConnection.edges ];
  //     else          nonaEdges = [...nonaConnection.edges, ...nonaEdges ];
  //   }

  //   /**
  //    * Debug
  //    */
  //   console.log("@@-- nonaEdges: ", nonaEdges);

  //   /**
  //    * 1.4 Check number of items fetched:
  //    *    1.4.1  If: fetched items are less than the requested number of items in 1.2 and there are more items:
  //    *           1.4.1.1 Adjust pagination to get the next batch of associated ids and next not-associated items page.
  //    *           1.4.1.2 @continue with next iteration.
  //    *    1.4.2  If: fetched items are equal to the requested number of items in 1.2 or there are no more items:
  //    *           1.4.2.1 Return Connection with edges and pageInfo properly configured. 
  //    *           1.4.2.2 @done
  //    */
  //   let thereAreMoreItems = isForward ? batchConnection.pageInfo.hasNextPage : batchConnection.pageInfo.hasPreviousPage;

  //   /**
  //    * Debug
  //    */
  //   console.log("@@-- thereAreMoreItems: ", thereAreMoreItems);
  //   console.log("@@-- nonaEdges.length : ", nonaEdges.length);

  //   if(nonaEdges.length < requiredItems && thereAreMoreItems) {
  //     //adjust pagination for next batch associated ids
  //     batchPagination.after = isForward ? batchConnection.pageInfo.endCursor : null;
  //     batchPagination.before = !isForward ? batchConnection.pageInfo.startCursor : null;
  //     batchVariables.pagination = batchPagination;
      
  //     //adjust pagination for the next non-associated items
  //     nonaPagination.first = isForward ? (requiredItems - nonaEdges.length) : null;
  //     nonaPagination.last = !isForward ? (requiredItems - nonaEdges.length) : null;
  //     nonaPagination.after = isForward ? batchConnection.pageInfo.endCursor : null;
  //     nonaPagination.before = !isForward ? batchConnection.pageInfo.startCursor : null;
  //     nonaPagination.includeCursor = false;
  //     nonaVariables = {pagination: nonaPagination}; //search will be set in next iteration

  //     //continue with next iteration...
  //     iteration++;
  //   } else {        
  //     //return value
  //     return {value: {pageInfo: nonaPageInfo, edges: nonaEdges}, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
  //   }
  // }//end: while()
},



/**
 * Plotly query
 * ------------
 */

  /**
   * getBarchartData
   *
   * Given an @attribute, calculates the object {x1:y1, x2:y2, ...} where
   * @x is a value of the attribute and @y is the total ocurrences of the 
   * value, calculated over all records in the model's table.
   * 
   * The items attrbutes are fetched from GraphQL Server in paginatedbatches, 
   * using a cursor-based connection. Gets only the indicated attribute. 
   * No search nor order are specified.
   * 
   * @param {String} url GraphQL Server url
   * @param {String} attribute Name of the attribute to be retrieved.
   */
  async getBarchartData(url, attribute) {
    //internal checks
    if(!attribute||typeof attribute !== 'string') throw new Error("internal_error: expected string in 'attribute' argument");
    
    let graphqlErrors = [];
    let batchSize = globals.MAX_RECORD_LIMIT ? Math.floor(globals.MAX_RECORD_LIMIT/2) : 5000;
    
    /**
     * Initialize batch query
     * 
     */
    //pagination
    let batchPagination = {first: batchSize};
    //variables
    let batchVariables = {pagination: batchPagination};
    //query
    let batchQuery = 
          `query usersConnection($pagination: paginationCursorInput!) {
                 usersConnection(pagination: $pagination) {
                    pageInfo {startCursor endCursor hasPreviousPage hasNextPage}
                    edges {node {${attribute}}}
                 }}`;
    
    //initialize results
    let data = {};

    /**
     *  Recursive fetch of items algorithm (cursor-based-pagination):
     *  1 while @thereAreMoreItems do:
     *    1.1 fetch @batchSize items.
     *    1.2 reduce items result to {x1:y1, x2:y2, ...} and accumulate in @data object.
     *    1.3 calculates new @thereAreMoreItems value.
     *    1.4 if @thereAreMoreItems
     *      1.4.1 adjust pagination and @continue with next iteration.
     *    1.5 else: !@thereAreMoreItems 
     *      1.5.1 return @data or null if there are no values in @data.
     * 
     */
    let thereAreMoreItems = true;
    let iteration = 1;
    while(thereAreMoreItems) {
      /**
       * 1.1 Get @batchSize associated ids.
       * 
       */

      /**
       * Debug
       */
      if(globals.REQUEST_LOGGER) logRequest(`getBarchartData#i-${iteration}#`, batchQuery, batchVariables);

      //request
      let response = await requestGraphql({ url, query:batchQuery, variables:batchVariables });
      let items = null;
      //check
      let check = checkResponse(response, graphqlErrors, "usersConnection");
      if(check === 'ok') {
        //check type
        if(!response.data.data["usersConnection"]
        || typeof response.data.data["usersConnection"] !== 'object'
        || !Array.isArray(response.data.data["usersConnection"].edges)
        || typeof response.data.data["usersConnection"].pageInfo !== 'object' 
        || response.data.data["usersConnection"].pageInfo === null)
        return {data: response.data.data, value: null, message: 'bad_type', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

        //get value
        items = response.data.data["usersConnection"];
      } else return {data: response.data.data, value: null, message: check, graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};

      //if there are results...
      if(items.edges.length > 0) {
        //reduce to {x1:y1, x2:y2, ...}
        data = items.edges.reduce((acc, item) => {
          let key = item.node[attribute];
          if(!acc[key]) acc[key] = 1; //first ocurrence
          else acc[key]++;
          return acc;
        }, data);
      }

      //set flag
      thereAreMoreItems = (items.edges.length > 0) && items.pageInfo.hasNextPage;

      //check
      if(thereAreMoreItems) {
        //adjust pagination for next batch
        batchPagination.after = items.pageInfo.endCursor;
        batchVariables.pagination = batchPagination;
        
        //continue with next iteration...
        iteration++;

      } else { //no more items...

        //return value
        return {value: data, message: 'ok', graphqlErrors: (graphqlErrors.length>0) ? graphqlErrors : undefined};
      }
    }//end: while()
  },

}//end: export default

