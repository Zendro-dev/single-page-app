
/**
 * Wrapper function to use in the Zendro Studio interface.
 * @param {import('../../../utils/request')} zendroApi
 */
export async function createPlot(zendroApi) {
  /**
   * This is the experimental Zendro Studio code editor interface.
   *
   * The code within this function can be executed to query, manipulate, and
   * visualize data using a standard set of APIs.
   *
   *   GraphQL
   *   -------
   *
   *   The "zendroApi" variable exposes a "graphqlQuery" function that can be used
   *   to retrieve data from the configured Zendro GraphQL server.
   *
   *      zendroApi.graphqlQuery(queryString, userVariables);
   *
   *   For more information about the GraphQL types available in the server, please
   *   visit the GraphiQL endpoint ("https://<host>/graphql") and use the Documentation
   *   Exporer as needed. Any query that can be executed in GraphiQL is also valid here.
   *
   *   Additionally, a "graphqlQueryModel" wrapper function can be used to retrieve all
   *   attributes of a single model, using an iterative strategy.
   *
   *      zendroApi.graphqlQueryModel(modelName, options);
   *
   *   The options argument is an object with two optional properties: "after" and "limit".
   *
   *     "after": the Base64 representation of the record after which the search should begin
   *     "limit": the total number of records to be retrieved
   *
   *
   *   Plotly
   *   ------
   *
   *   This function can optionally return an object as specified in the Plotly.js API.
   *   The typical plot object contains three properties: data, layout, and config, that
   *   will be used by Plotly to render the visualization.
   *
   *   For more information visit the official site at https://plotly.com/javascript/.
   *
   *   Example
   *   -------
   *
   *   An example is provided below using the GraphQL and Plotly APIs to query data from
   *   the server and render a visualization.
   *
   */

  const query = `
    query findUserAndRoles($limit: Int!) {
      role_to_users(pagination: {limit: $limit}) {
        userId
        roleId
      }
    }
  `

  const res = await zendroApi.graphqlQuery(query, {
    limit: 100,
  })

  const x = [ ...new Set( res.data.role_to_users.map(x => x.userId) ) ];
  const y = [ ...new Set( res.data.role_to_users.map(x => x.roleId) ) ];
  const z = y.map(i => Array(x.length).fill(0))

  res.data.role_to_users.forEach(({ userId, roleId }) => {
    z[roleId - 1][userId - 1] = roleId;
  });

  const data = [
    {
      x, y, z,
      colorscale: 'Jet',
      type: 'heatmap',
      hoverongaps: false
    }
  ];

  return {
    data,
    layout: {
      xaxis: { title: 'User ID' },
      yaxis: { title: 'Role ID' },
    },
    config: { responsive: true }
  }
}
