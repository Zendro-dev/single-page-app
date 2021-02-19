import axios from 'axios';
import { request } from 'graphql-request';
import { GRAPHQL_SERVER_URL } from '../config/globals';

export function fetcherUpload(model_name, token, file) {
  let query_name = `bulkAdd${model_name}Csv`;
  let formData = new FormData();
  formData.append('csv_file', file);
  formData.append('query', `mutation { ${query_name} }`);

  let headers = {
    'Content-Type': 'multipart/form-data',
    Accept: 'application/graphql',
    Authorization: 'Bearer ' + token,
  };

  return axios
    .post(GRAPHQL_SERVER_URL, formData, { headers: headers })
    .then((response) => response.data.data[query_name])
    .catch((error) => {
      throw error;
    });
}

export function fetcherTemplate(model_name) {
  let query_name = `csvTableTemplate${model_name}`;

  return request(GRAPHQL_SERVER_URL, `{${query_name}}`)
    .then((response) => response[query_name])
    .catch((error) => {
      throw error;
    });
}
