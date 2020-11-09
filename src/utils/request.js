import axios from 'axios';

import getAttributes from '../requests/requests.attributes';

import {
  GRAPHQL_SERVER_URL,
  MAX_RECORD_LIMIT,
} from '../config/globals';


/**
 * Query the configured Zendro GraphQL endpoint.
 * @param {string}             query GraphQL formatted query
 * @param {Object<string,any>} variables query variables
 */
export async function graphqlQuery(query, variables) {

  const token = localStorage.getItem('token');

  let response;
  try {

    response = await axios({
      url: GRAPHQL_SERVER_URL,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        common: {
          'Authorization': token ? `Bearer ${token}` : null,
        }
      },
      data: {
        query,
        variables,
      }
    })

  } catch (error) {
    return {
      errors: [ error ]
    };
  }

  return {
    data: response.data?.data,
    errors: response.data?.errors,
    status: response.status,
    statusText: response.statusText,
  };

}

/**
 * Fetch all records from a given model, using an iterative pagination strategy.
 * @typedef  {Object} GQLQueryAllOptions pagination options
 * @property {string?} after first record object encoded as a Base64 string
 * @property {number}  limit maximum number of records to retrieve
 *
 * @param {string}              modelName name of the model to fetch records from
 * @param {GQLQueryAllOptions?}   options options object for the recursive query
 */
export async function graphqlQueryModel(modelName, options) {

  let results = [];

  const attributes = Object.keys( getAttributes(modelName) ?? {} ).join(' ');

  if (!attributes)
    return results;

  const query = `
    query graphqlQueryAll($after: String, $first: Int) {
      ${modelName}sConnection(pagination: { after: $after, first: $first }) {
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          node {
            ${attributes}
          }
        }
      }
    }
  `

  let variables = Object.assign({}, options, { first: MAX_RECORD_LIMIT });
  let hasNextPage = true;
  let remaining = options?.limit;

  while (hasNextPage) {

    /**
     * The query might be optionally limited to a maximum number of desired records.
     */
    if (options?.limit) {

      /**
       * If during previous iterations that optional number is reached, the loop can exit.
       */
      if (!remaining) break;

      /**
       * The internal query limit should also be set accordingly to either the maximum record
       * limit allowed by the graphql endpoint, or to the optional query limit if it is lower.
       */
      if ((remaining - MAX_RECORD_LIMIT) < 0) {
        variables.first = remaining;
        remaining = 0;
      }
    }

    // Attempt to query the graphql endpoint
    const response = await graphqlQuery(query, variables);

    /**
     * The server might throw an error before the query execution begins, in which case
     * the response "data" object will be undefined, and the error stored within the
     * response "errors" array.
     */
    if (!response.data) {
      console.error(response);
      break;
    }

    /**
     * The requested data is stored deep within the response, in an object named like the
     * query resolver.
     */
    const connection = response.data[`${modelName}sConnection`];

    /**
     * The requested data might be null or undefined, which may (or may not?) be the result
     * an error during execution.
     */
    if (!connection) {
      if (response?.errors)
        console.error('The server responded with errors', response);
      break;
    }

    /**
     * If a valid response is received, the data is stripped of the network-like connection
     * layers (edges/node) and pushed to the results array as a bare object.
     */
    connection.edges.forEach(edge => {
      results.push(edge.node);
    });

    /**
     * The next iteration, if any, will continue from the previous end offset (cursor).
     */
    hasNextPage = connection.pageInfo.hasNextPage;
    variables.after = connection.pageInfo.endCursor;
  }

  return results;
}
