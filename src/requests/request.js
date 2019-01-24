import axios from 'axios'

export default function({url, query, variables}){
  return axios.post(url,{
    query:query,
    variables:variables
  })
}
