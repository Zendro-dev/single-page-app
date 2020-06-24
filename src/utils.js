import decode from 'jwt-decode';
import axios from 'axios';

/**
 * makeCancelable()
 * 
 * This function equips a promise with a cancel() method.
 * 
 * Solution given by @istarkov on:  https://github.com/facebook/react/issues/5465#issuecomment-157888325
 * Also referenced here: https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
*/

export const makeCancelable = (promise) => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      (val) => hasCanceled_ ? reject({isCanceled: true}) : resolve(val),
      (error) => hasCanceled_ ? reject({isCanceled: true}) : reject(error)
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

/** 
 * isAuthenticated()
 * 
 * This function validates the following conditions to determine 
 * if there is an authenticated session:
 * 
 *  1) Token exists on localStorage, and,
 *  2) Expiration time is valid (greater than current time).
 * 
 * @return {boolean} true if authenticated, false otherwise. 
*/
export function isAuthenticated() {

  //get token from local storage
  var token = localStorage.getItem('token');
  var decoded_token = null;

  //check 1: token not null
  if(token == null)
  {
    return false;
  }
  else
  {
    /*
      Decode JWT
    */
    try {
      decoded_token = decode(token);

    }
    catch(err) { //bad token
      
      //clean up localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('expirationDate');

      return false;
    }
  }
  //check 1: token not null: ok

  //check 2: expiration date
  if(decoded_token.hasOwnProperty('exp'))
  {
    //get current date
    var d = new Date();
    //get exp date
    var expDate = new Date(decoded_token.exp * 1000);

    if(d >= expDate)
    {
      //expired
      return false;
    }
    else
    {//check 2: expiration date: ok

      //not expired
      return decoded_token;
    }
  }
  else{ //bad json

    //clean up localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');

    return false;
  }
}

export function removeToken() {
  //clean up token
  localStorage.removeItem('token');
}

/** 
 * requestGraphql()
 * 
 * GraphQL API Query made with axios.
 * 
 * @return {Promise} Axios promise of the request made. 
*/
export function requestGraphql({ url, query, variables }) {

  var token = localStorage.getItem('token');
  if(token) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  }

  return axios.post(url,
    {
        query: query,
        variables: variables
    }
  );
}
