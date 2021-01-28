import {
  requestGraphql,
  checkResponse,
  getSearchArgument,
  logRequest,
} from '../utils';
import globals from '../config/globals';

const config = {
  /**
   * Root query
   * ----------
   */
  /**
   * tableTemplate
   *
   * Get role_to_usertable template from GraphQL Server.
   * (root query)
   *
   * @param {String} url GraphQL Server url
   */
  async tableTemplate(url) {
    let graphqlErrors = [];
    let query = `query {csvTableTemplateRole_to_user}`;

    /**
     * Debug
     */
    if (globals.REQUEST_LOGGER) logRequest('tableTemplate', query);

    //request
    let response = await requestGraphql({ url, query });
    let headers = null;
    //check
    let check = checkResponse(
      response,
      graphqlErrors,
      'csvTableTemplateRole_to_user'
    );
    if (check === 'ok') {
      //check type
      if (!Array.isArray(response.data.data['csvTableTemplateRole_to_user']))
        return {
          data: response.data.data,
          value: null,
          message: 'bad_type',
          graphqlErrors: graphqlErrors.length > 0 ? graphqlErrors : undefined,
        };

      //get value
      headers = response.data.data['csvTableTemplateRole_to_user'];
    } else
      return {
        data: response.data.data,
        value: null,
        message: check,
        graphqlErrors: graphqlErrors.length > 0 ? graphqlErrors : undefined,
      };

    //return value
    return {
      value: headers,
      message: 'ok',
      graphqlErrors: graphqlErrors.length > 0 ? graphqlErrors : undefined,
    };
  },

  /**
   * Root query
   * ----------
   */

  /**
   * getCountItems
   *
   * Get role_to_usersitems count from GraphQL Server.
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
    let s = getSearchArgument('role_to_user', searchText, ops, 'object');
    if (s) variables.search = s.search;

    //query
    let query = `query countRole_to_users($search: searchRole_to_userInput) {
             countRole_to_users( search: $search ) }`;
    /**
     * Debug
     */
    if (globals.REQUEST_LOGGER) logRequest('getCountItems', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let count = null;
    //check
    let check = checkResponse(response, graphqlErrors, 'countRole_to_users');
    if (check === 'ok') {
      //check type
      if (!Number.isInteger(response.data.data['countRole_to_users']))
        return {
          data: response.data.data,
          value: null,
          message: 'bad_type',
          graphqlErrors: graphqlErrors.length > 0 ? graphqlErrors : undefined,
        };

      //get value
      count = response.data.data['countRole_to_users'];
    } else
      return {
        data: response.data.data,
        value: null,
        message: check,
        graphqlErrors: graphqlErrors.length > 0 ? graphqlErrors : undefined,
      };

    //return value
    return {
      value: count,
      message: 'ok',
      graphqlErrors: graphqlErrors.length > 0 ? graphqlErrors : undefined,
    };
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
    if (!variables || typeof variables !== 'object')
      throw new Error("internal_error: expected object 'variables' argument");
    if (!variables.pagination || typeof variables.pagination !== 'object')
      throw new Error(
        'internal_error: pagination object expected in variables'
      );
    if (!variables.pagination.first && !variables.pagination.last)
      throw new Error(
        'internal_error: pagination first or last positive argument expected'
      );
    let graphqlErrors = [];

    //search
    let s = getSearchArgument('role_to_user', searchText, ops, 'object');
    if (s) variables.search = s.search;
    //order
    if (orderBy && orderDirection) {
      let upOrderDirection = String(orderDirection).toUpperCase();
      variables.order = [{ field: orderBy, order: upOrderDirection }];
    }

    //set attributes
    let qattributes = `id,
       userId,
       roleId,
`;

    //query
    let query = `query role_to_usersConnection($order: [orderRole_to_userInput], $search: searchRole_to_userInput, $pagination: paginationCursorInput!) {
             role_to_usersConnection( order: $order, search: $search, pagination: $pagination ) {
                pageInfo { startCursor, endCursor, hasPreviousPage, hasNextPage }
                edges { node { ${qattributes} }}
       }}`;

    /**
     * Debug
     */
    if (globals.REQUEST_LOGGER) logRequest('getItems', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let items = null;
    //check
    let check = checkResponse(
      response,
      graphqlErrors,
      'role_to_usersConnection'
    );
    if (check === 'ok') {
      //check type
      if (
        !response.data.data['role_to_usersConnection'] ||
        typeof response.data.data['role_to_usersConnection'] !== 'object' ||
        !Array.isArray(response.data.data['role_to_usersConnection'].edges) ||
        typeof response.data.data['role_to_usersConnection'].pageInfo !==
          'object' ||
        response.data.data['role_to_usersConnection'].pageInfo === null
      )
        return {
          data: response.data.data,
          value: null,
          message: 'bad_type',
          graphqlErrors: graphqlErrors.length > 0 ? graphqlErrors : undefined,
        };

      //get value
      items = response.data.data['role_to_usersConnection'];
    } else
      return {
        data: response.data.data,
        value: null,
        message: check,
        graphqlErrors: graphqlErrors.length > 0 ? graphqlErrors : undefined,
      };

    //return value
    return {
      value: items,
      message: 'ok',
      graphqlErrors: graphqlErrors.length > 0 ? graphqlErrors : undefined,
    };
  },

  /**
   * Root mutation
   * -------------
   */

  /**
   * createItem
   *
   * Add new Role_to_user item on GraphQL Server.
   * (root mutation)
   *
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to create new Role_to_user item.
   */
  async createItem(url, variables) {
    //internal checks
    if (!variables || typeof variables !== 'object')
      throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    //set variables declarations
    let qvariables = `
          $userId:Int,
          $roleId:Int,
`;

    //set parameters assignation
    let qparameters = `
            userId:$userId,
            roleId:$roleId,
`;

    //set attributes to fetch
    let qattributes = `id,
       userId,
       roleId,
`;

    //query
    let query = `mutation addRole_to_user(
          ${qvariables}
          ) { addRole_to_user(
          ${qparameters}
          ) {
          ${qattributes}
          } }`;

    /**
     * Debug
     */
    if (globals.REQUEST_LOGGER) logRequest('createItem', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let item = null;
    //check
    let check = checkResponse(response, graphqlErrors, 'addRole_to_user');
    if (check === 'ok') {
      //check type
      if (
        !response.data.data['addRole_to_user'] ||
        typeof response.data.data['addRole_to_user'] !== 'object'
      )
        return {
          data: response.data.data,
          value: null,
          message: 'bad_type',
          graphqlErrors: graphqlErrors.length > 0 ? graphqlErrors : undefined,
        };

      //get value
      item = response.data.data['addRole_to_user'];
    } else
      return {
        data: response.data.data,
        value: null,
        message: check,
        graphqlErrors: graphqlErrors.length > 0 ? graphqlErrors : undefined,
      };

    //return value
    return {
      value: item,
      message: 'ok',
      graphqlErrors: graphqlErrors.length > 0 ? graphqlErrors : undefined,
    };
  },

  /**
   * Root mutation
   * -------------
   */

  /**
   * updateItem
   *
   * Update Role_to_user item on GraphQL Server.
   * (root mutation)
   *
   * @param {String} url GraphQL Server url.
   * @param {Object} variables Object with values to update the given Role_to_user item.
   */
  async updateItem(url, variables) {
    //internal checks
    if (!variables || typeof variables !== 'object')
      throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    //set variables declarations
    let qvariables = `
          $id:ID!,
          $userId:Int,
          $roleId:Int,
`;

    //set parameters assignation
    let qparameters = `
            id:$id,
            userId: $userId,
            roleId: $roleId,
`;

    //set attributes to fetch
    let qattributes = `id,
       userId,
       roleId,
`;

    //query
    let query = `mutation updateRole_to_user(
          ${qvariables}
          ) { updateRole_to_user(
          ${qparameters}
          ) {
          ${qattributes}
          } }`;

    /**
     * Debug
     */
    if (globals.REQUEST_LOGGER) logRequest('updateItem', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let item = null;
    //check
    let check = checkResponse(response, graphqlErrors, 'updateRole_to_user');
    if (check === 'ok') {
      //check type
      if (
        !response.data.data['updateRole_to_user'] ||
        typeof response.data.data['updateRole_to_user'] !== 'object'
      )
        return {
          data: response.data.data,
          value: null,
          message: 'bad_type',
          graphqlErrors: graphqlErrors.length > 0 ? graphqlErrors : undefined,
        };

      //get value
      item = response.data.data['updateRole_to_user'];
    } else
      return {
        data: response.data.data,
        value: null,
        message: check,
        graphqlErrors: graphqlErrors.length > 0 ? graphqlErrors : undefined,
      };

    //return value
    return {
      value: item,
      message: 'ok',
      graphqlErrors: graphqlErrors.length > 0 ? graphqlErrors : undefined,
    };
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
   * @param {Object} variables Object with values needed to delete the Role_to_user item.
   */
  async deleteItem(url, variables) {
    //internal checks
    if (!variables || typeof variables !== 'object')
      throw new Error("internal_error: expected object 'variables' argument");
    let graphqlErrors = [];

    let query = `mutation
            deleteRole_to_user(
              $id:ID!
        ) { deleteRole_to_user(
              id:$id        ) }`;

    /**
     * Debug
     */
    if (globals.REQUEST_LOGGER) logRequest('deleteItem', query, variables);

    //request
    let response = await requestGraphql({ url, query, variables });
    let result = null;
    //check
    let check = checkResponse(response, graphqlErrors, 'deleteRole_to_user');
    if (check === 'ok') {
      //check type
      if (response.data.data['deleteRole_to_user'] === null)
        return {
          data: response.data.data,
          value: null,
          message: 'bad_type',
          graphqlErrors: graphqlErrors.length > 0 ? graphqlErrors : undefined,
        };

      //get value
      result = response.data.data['deleteRole_to_user'];
    } else
      return {
        data: response.data.data,
        value: null,
        message: check,
        graphqlErrors: graphqlErrors.length > 0 ? graphqlErrors : undefined,
      };

    //return value
    return {
      value: result,
      message: 'ok',
      graphqlErrors: graphqlErrors.length > 0 ? graphqlErrors : undefined,
    };
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
    if (!attribute || typeof attribute !== 'string')
      throw new Error(
        "internal_error: expected string in 'attribute' argument"
      );

    let graphqlErrors = [];
    let batchSize = globals.MAX_RECORD_LIMIT
      ? Math.floor(globals.MAX_RECORD_LIMIT / 2)
      : 5000;

    /**
     * Initialize batch query
     *
     */
    //pagination
    let batchPagination = { first: batchSize };
    //variables
    let batchVariables = { pagination: batchPagination };
    //query
    let batchQuery = `query role_to_usersConnection($pagination: paginationCursorInput!) {
                 role_to_usersConnection(pagination: $pagination) {
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
    while (thereAreMoreItems) {
      /**
       * 1.1 Get @batchSize associated ids.
       *
       */

      /**
       * Debug
       */
      if (globals.REQUEST_LOGGER)
        logRequest(
          `getBarchartData#i-${iteration}#`,
          batchQuery,
          batchVariables
        );

      //request
      let response = await requestGraphql({
        url,
        query: batchQuery,
        variables: batchVariables,
      });
      let items = null;
      //check
      let check = checkResponse(
        response,
        graphqlErrors,
        'role_to_usersConnection'
      );
      if (check === 'ok') {
        //check type
        if (
          !response.data.data['role_to_usersConnection'] ||
          typeof response.data.data['role_to_usersConnection'] !== 'object' ||
          !Array.isArray(response.data.data['role_to_usersConnection'].edges) ||
          typeof response.data.data['role_to_usersConnection'].pageInfo !==
            'object' ||
          response.data.data['role_to_usersConnection'].pageInfo === null
        )
          return {
            data: response.data.data,
            value: null,
            message: 'bad_type',
            graphqlErrors: graphqlErrors.length > 0 ? graphqlErrors : undefined,
          };

        //get value
        items = response.data.data['role_to_usersConnection'];
      } else
        return {
          data: response.data.data,
          value: null,
          message: check,
          graphqlErrors: graphqlErrors.length > 0 ? graphqlErrors : undefined,
        };

      //if there are results...
      if (items.edges.length > 0) {
        //reduce to {x1:y1, x2:y2, ...}
        data = items.edges.reduce((acc, item) => {
          let key = item.node[attribute];
          if (!acc[key]) acc[key] = 1;
          //first ocurrence
          else acc[key]++;
          return acc;
        }, data);
      }

      //set flag
      thereAreMoreItems = items.edges.length > 0 && items.pageInfo.hasNextPage;

      //check
      if (thereAreMoreItems) {
        //adjust pagination for next batch
        batchPagination.after = items.pageInfo.endCursor;
        batchVariables.pagination = batchPagination;

        //continue with next iteration...
        iteration++;
      } else {
        //no more items...

        //return value
        return {
          value: data,
          message: 'ok',
          graphqlErrors: graphqlErrors.length > 0 ? graphqlErrors : undefined,
        };
      }
    } //end: while()
  },
}; //end: export default

export default config;
