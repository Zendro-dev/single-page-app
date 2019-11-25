import axios from 'axios'

/**
 * GraphQL API Query
 */
export default function ({ url, query, variables }) {

    var token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

    return axios.post(url,
        {
            query: query,
            variables: variables
        }
    )
}
