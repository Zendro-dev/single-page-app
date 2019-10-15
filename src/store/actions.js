import axios from 'axios'
import decode from 'jwt-decode';

/*
  Action types
*/

export const LOGIN_REQ = 'LOGIN_REQ';
export const LOGIN_OK = 'LOGIN_OK';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGOUT = 'LOGOUT';

/*
  Action creators
*/

const loginReq = user => ({
  type: LOGIN_REQ,
  user
});

const loginOk = (user, token, expirationDate) => ({
  type: LOGIN_OK,
  user,
  token,
  expirationDate
});

const loginFail = (user, error) => ({
  type: LOGIN_FAIL,
  user,
  error
});

const logout = () => ({
  type: LOGOUT
});

/*
  Thunks
*/
export function authRequest(user, password) {

  return function (dispatch, getState) {
    /**
     * Debug
     */
    console.log("onAuthRequest.init: user: ", user);
    
    /*
      Dispatch loginReq action: 
      State is updated to inform that an API call is starting.
    */
    dispatch(loginReq(user));

    //get state
    const state = getState();

    //get user data
    let user_data = {
      email: user,
      password: password
    };

    /*
      POST: login authorization request
    */
    return axios(
      {
        url: state.urls.loginServerUrl,
        data: user_data,
        method: 'POST'
      })
      .then(
        //on successful login handler
        response => {
          //get token
          const token = response.data.token;
          var decoded_token = null;

          /*
            Decode JWT
          */ 
          try {

            decoded_token = decode(token);
            console.log("decoded_token: ok: ", decoded_token);
          }
          catch(err) { //bad token
            
            //clean up token
            localStorage.removeItem('token');
            localStorage.removeItem('expirationDate');

            /*
              Dispatch loginFail action: 
              State is updated to inform that login was failed.
            */
            dispatch(loginFail(user, err));

            return "loginError";
          } //JWT decoded ok

          //save token on local storage
          localStorage.setItem('token', token);
          //set token on axios headers
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
          //set expiration date
          let date = null;
          if (decoded_token.exp) {
            date = new Date(0);
            date.setUTCSeconds(decoded_token.exp);
          }
          //save expiration date on local storage
          localStorage.setItem('expirationDate', date);
          /*
            Dispatch loginOk action: 
            State is updated to inform that login was successful.
          */
          dispatch(loginOk(user, token, date));

          return "loginSuccess";
        },
        //on login fail handler
        err => {
          /**
           * Debug
           */
          console.log("ERROR: on authRequest, err: ", err);
          console.log("ERROR: on authRequest, response:", err.response);

          //remove items from localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('expirationDate');

          /*
            Dispatch loginFail action: 
            State is updated to inform that login was failed.
          */
          dispatch(loginFail(user, err));

          return "loginError";
        });
    // Do not use catch, because that will also catch
    // any errors in the dispatch and resulting render,
    // causing a loop of 'Unexpected batch number' errors.
    // https://github.com/facebook/react/issues/6895
  }

}//end: authRequest()

export function logoutRequest() {

  return function (dispatch) {
    /*
      Dispatch logout action: 
      State is cleared.
    */
  dispatch(logout());

  //clean up token
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  }
}