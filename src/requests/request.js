import axios from 'axios'

export default function({url, query, variables, token }){
  return axios.post(url,{
    query:query,
    variables:variables,
    headers: {
      'authorization': `Bearer ${token}`,
      'Accept': 'application/graphql'
    }
  })
}
