import { GRAPHQL_SERVER_URL } from '../config/globals';

export function fetcherUpload(query, token, file) {
  let formData = new FormData();
  formData.append('csv_file', file);
  formData.append('query', query);

  let headers = {
    'Content-Type': 'multipart/form-data',
    Accept: 'application/graphql',
    Authorization: 'Bearer ' + token,
  };

  //return axios.post(GRAPHQL_SERVER_URL, formData, { headers: headers});

  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({ data: 'Query result' });
    }, 3000)
  );
}
