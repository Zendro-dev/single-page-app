import axios from 'axios';
import { GRAPHQL_URL } from '../config/globals';

export function fetcherUpload(model_name, token, file) {
  let query_name = `bulkAdd${model_name}Csv`; //to be updated with query from queries module
  let formData = new FormData();
  formData.append('csv_file', file);
  formData.append('query', `mutation { ${query_name} }`);

  let headers = {
    'Content-Type': 'multipart/form-data',
    Accept: 'application/graphql',
    Authorization: 'Bearer ' + token,
  };

  return axios
    .post(GRAPHQL_URL, formData, { headers: headers })
    .then((response) => response.data.data[query_name])
    .catch((error) => {
      throw error;
    });
}

//to be update with general wrapper graphql request
export function fetcherTemplate(model_name, token) {
  let query_name = `csvTableTemplate${model_name}`; //to be updated with query from queries module

  let headers = {
    Authorization: 'Bearer ' + token,
  };

  return axios
    .post(
      GRAPHQL_URL,
      { query: `query {${query_name}}` },
      { headers: headers }
    )
    .then((response) => response.data.data[query_name])
    .catch((error) => {
      throw error;
    });
}

export function downloadFile(data, name) {
  let file = data.join('\n');
  const url = window.URL.createObjectURL(new Blob([file]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', name);
  document.body.appendChild(link);
  link.click();
}
