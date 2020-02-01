import axios from 'axios'

/**
 * GraphQL API Query
 */
export default function ({ url, query, variables }) {

    var token = localStorage.getItem('token');
    if(token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    }

    return makeCancelable(axios.post(url,
        {
            query: query,
            variables: variables
        }
    ));
}

/**
 * makeCancelable()
 * 
 * This function equips a promise with a cancel() method.
 * 
 * Solution given by @istarkov on:  https://github.com/facebook/react/issues/5465#issuecomment-157888325
 * Also referenced here: https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
*/

const makeCancelable = (promise) => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then((val) =>
      hasCanceled_ ? reject({isCanceled: true}) : resolve(val)
    );
    promise.catch((error) =>
      hasCanceled_ ? reject({isCanceled: true}) : reject(error)
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    },
  };
};