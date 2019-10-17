import axios from 'axios'

/**
 * GraphQL API Query
 */
export default function ({ url, query, variables }) {

    //get token from local storage
    var token = localStorage.getItem('token');

    //set token on axios headers
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

    return axios.post(url,
        {
            query: query,
            variables: variables
        }
    )
}
