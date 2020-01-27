import axios from 'axios'
import decode from 'jwt-decode';
import Acl from 'acl'
import { aclRules } from '../acl_rules';

/*
  Action types
*/

export const LOGIN_REQ = 'LOGIN_REQ';
export const LOGIN_OK = 'LOGIN_OK';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGOUT = 'LOGOUT';
export const ACL_MODULE_FAIL = 'ACL_MODULE_FAIL';
export const MODEL_CHANGE = 'MODEL_CHANGE';

/*
  Action creators
*/

const loginReq = user => ({
  type: LOGIN_REQ,
  user
});

const loginOk = (user, userId, userRoles, token, expirationDate, acl) => ({
  type: LOGIN_OK,
  user,
  userId,
  userRoles,
  token,
  expirationDate,
  acl
});

const loginFail = (user, error) => ({
  type: LOGIN_FAIL,
  user,
  error
});

const logout = () => ({
  type: LOGOUT
});

const aclModuleFail = (user, errors) => ({
  type: ACL_MODULE_FAIL,
  user,
  errors
});

export const modelChange = (model, op, item, newItem) => ({
  type: MODEL_CHANGE,
  model,
  op,
  item,
  newItem
});

/*
  Thunks
*/
export function authRequest(user, password) {

  return function (dispatch, getState) {
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
        (response) => {
          /*
            JWT
          */
          const token = response.data.token;
          var decoded_token = null;
          try {

            decoded_token = decode(token);
          }
          catch(err) { //bad token
            
            //clean up local storage
            localStorage.removeItem('token');

            /*
              Dispatch loginFail action: 
              State is updated to inform that login was failed.
            */
            dispatch(loginFail(user, err));

            return "tokenError";
          } //JWT decoded ok

          //check null token
          if(!token) {
            //clean up local storage
            localStorage.removeItem('token');

            /*
              Dispatch loginFail action: 
              State is updated to inform that login was failed.
            */
            dispatch(loginFail(user, 'null token error'));

            return "tokenError";
          }

          //save token on local storage
          localStorage.setItem('token', token);
          //set token on axios headers
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

          /*
            ACL
          */
          var acl = new Acl(new Acl.memoryBackend());
          var aclContext = {user: user, errors: []}
          acl.allow(aclRules, function(err) {
            if(err) {
              this.errors.push({allowError: err});
              /*
                Dispatch aclModuleFail action: 
                State is updated to inform that ACL module has failed.
              */
              dispatch(aclModuleFail(this.user, this.errors));
              console.log("Error on ACL module: ", err);
            }
          }.bind(aclContext))
          .then( (result) => {
      
            acl.addUserRoles(user, decoded_token.roles, function(err) {
              if(err) {
                this.errors.push({addUserRolesError: err});
                /*
                  Dispatch aclModuleFail action: 
                  State is updated to inform that ACL module has failed.
                */
                dispatch(aclModuleFail(this.user, this.errors));
                console.log("Error on ACL module: ", err);
              }
            }.bind(aclContext))
            .then( (result) => {
              /*
                Dispatch loginOk action: 
                State is updated to inform that login was successful.
              */
              dispatch(loginOk(user, decoded_token.id, decoded_token.roles, token, decoded_token.exp, acl));
            });
      
          });

          return "loginSuccess";
        },
        //on login fail handler
        err => {
          /**
           * Debug
           */
          console.log("ERROR: on authRequest, err: ", err);
          console.log("ERROR: on authRequest, err.message: ", err.message);
          console.log("ERROR: on authRequest, response.data:", err.response);

          //remove items from localStorage
          localStorage.removeItem('token');
          
          /*
            Dispatch loginFail action: 
            State is updated to inform that login was failed.
          */
          dispatch(loginFail(user, err));

          /*
            Get status (todo: fix this)
          */
         let errStatus = err.response.status;

         if(errStatus !== undefined) {
           return String(errStatus);
         }
         else {
           return 'connectionRefused';
         }
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
  }
}

export function onRefresh() {

  return function (dispatch, getState) {
    const state = getState();
    /*
      ACL
    */
    var acl = new Acl(new Acl.memoryBackend());
    var aclContext = {user: state.login.user, errors: []};
    acl.allow(aclRules, function(err) {
      if(err) {
        this.errors.push({allowError: err});
        /*
          Dispatch aclModuleFail action: 
          State is updated to inform that ACL module has failed.
        */
        dispatch(aclModuleFail(this.user, this.errors));
        console.log("Error on ACL module: ", err);
      }
    }.bind(aclContext))
    .then( (result) => {

      acl.addUserRoles(state.login.user, state.login.userRoles, function(err) {
        if(err) {
          this.errors.push({addUserRolesError: err});
          /*
            Dispatch aclModuleFail action: 
            State is updated to inform that ACL module has failed.
          */
          dispatch(aclModuleFail(this.user, this.errors));
          console.log("Error on ACL module: ", err);
        }
      }.bind(aclContext))
      .then( (result) => {
        /*
          Dispatch loginOk action: 
          State is updated with current login data and acl.
        */
        dispatch(loginOk(state.login.user, state.login.userId, state.login.userRoles, state.login.token, state.login.expirationDate, acl));
      });

    });
  }
}