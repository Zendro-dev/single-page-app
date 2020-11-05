import axios from 'axios';
import {
  GRAPHQL_SERVER_URL,
} from '../config/globals';


/**
 * @typedef  {Object} QueryVariables configuration variables in GraphQL query utils.
 * @property {PaginationVariable} pagination pagination variables
**/

/**
 * @typedef  {Object} PaginationVariable pagination variables for the GraphQL query utility.
 * @property {number?}  limit number of records that should be fetch in each request
 * @property {string?} cursor record object encoded as a Base64 string
**/

/**
 * Query the configured Zendro GraphQL endpoint.
 * @param {string}             query GraphQL formatted query
 * @param {Object<string,any>} variables query variables
 */
export async function graphqlQuery(query, variables) {

  const token = localStorage.getItem('token');

  const { data } = await axios({
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

  return data;

}
