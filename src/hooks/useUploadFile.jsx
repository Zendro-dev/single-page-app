import axios from 'axios';
import useSWR from 'swr';

const graphqlServerUrl = '';

const fetcher = (query, token, file) => {
  let formData = new FormData();
  formData.append('csv_file', file);
  formData.append('query', query);

  let headers = {
    'Content-Type': 'multipart/form-data',
    Accept: 'application/graphql',
    Authorization: 'Bearer ' + token,
  };

  //return axios.post(graphqlServerUrl, formData, { headers: headers});

  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({ data: 'Query result' });
    }, 3000)
  );
  //return  {data:"SOMETHING"}
};

export default function useUploadFile({ model_name, token, file }) {
  let query = `mutation {bulkAdd${model_name} }`;

  const { data, error } = useSWR([query, token, file], fetcher);

  //we might add loading handling

  return { data, error };
}
