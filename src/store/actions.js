import axios from 'axios'
import decode from 'jwt-decode';
import Acl from 'acl'
import { aclRules } from '../acl_rules';
import { isAuthenticated, removeToken } from '../utils';

/*
  Action types
*/

export const LOGIN_REQ = 'LOGIN_REQ';
export const LOGIN_OK = 'LOGIN_OK';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGIN_EXPIRED = 'LOGIN_EXPIRED';
export const LOGOUT = 'LOGOUT';
export const ACL_MODULE_OK = 'ACL_MODULE_OK';
export const ACL_MODULE_FAIL = 'ACL_MODULE_FAIL';
export const MODEL_CHANGE = 'MODEL_CHANGE';
export const CHANGES_COMPLETED = 'CHANGES_COMPLETED';
export const CLEAR_CHANGES = 'CLEAR_CHANGES';

/*
  Action creators
*/

const loginReq = user => ({
  type: LOGIN_REQ,
  user
});

const loginOk = (user, userId, userRoles, expirationDate) => ({
  type: LOGIN_OK,
  user,
  userId,
  userRoles,
  expirationDate
});

const loginFail = (user, error) => ({
  type: LOGIN_FAIL,
  user,
  error
});

const loginExpired = (user, userId, userRoles, expirationDate) => ({
  type: LOGIN_EXPIRED,
  user,
  userId,
  userRoles,
  expirationDate
});

const logout = () => ({
  type: LOGOUT
});

const aclModuleOk = (acl) => ({
  type: ACL_MODULE_OK,
  acl
});

const aclModuleFail = (user, errors) => ({
  type: ACL_MODULE_FAIL,
  user,
  errors
});

export const modelChange = (model, op, item, newItem, changedAssociations) => ({
  type: MODEL_CHANGE,
  model,
  op,
  item,
  newItem,
  changedAssociations,
});

export const changesCompleted = () => ({
  type: CHANGES_COMPLETED
});

export const clearChanges = () => ({
  type: CLEAR_CHANGES
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
        //resolved
        (response) => {
          /*
            Check JWT
          */
          let token = response.data.token;
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
          
          //decode
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

          //save token on local storage
          localStorage.setItem('token', token);
          //set token on axios headers
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

          /**
           * At this point, login is successful.
           * Main app component should dispatch a setAcl action to set acl rules.
           * Any ACL error status should be checked in the main app component.
           */
          /*
            Dispatch loginOk action: 
            State is updated to inform that login was successful.
          */
          dispatch(loginOk(user, decoded_token.id, decoded_token.roles, decoded_token.exp));
          return "loginSuccess";
        },
        //rejected
        (err) => {
          //remove items from localStorage
          localStorage.removeItem('token');
          
          /*
            Dispatch loginFail action: 
            State is updated to inform that login was failed.
          */
          dispatch(loginFail(user, err));

          return err;
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

export function setAclRules(user, userRoles) {

  return function (dispatch) {
    /*
      Set ACL rules
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

      acl.addUserRoles(user, userRoles, function(err) {
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
          Dispatch aclModuleOk action: 
          State is updated to inform that acl was set successful.
        */
        dispatch(aclModuleOk(acl, user));
      });
    });
  }
}

export function checkAuthentication() {

  return function (dispatch, getState) {
    let decoded_token = isAuthenticated();
    console.log("--detoken: ", decoded_token)

    if(decoded_token) {
      /*
        Dispatch loginOk action: 
        State is updated to inform that login is valid.
      */
      dispatch(loginOk(decoded_token.email, decoded_token.id, decoded_token.roles, decoded_token.exp));
    } else {
      /*
        Dispatch loginExpired action: 
        State is updated to inform that login is expired.
      */
      dispatch(loginExpired(decoded_token.email, decoded_token.id, decoded_token.roles, decoded_token.exp));
      removeToken();
    }
  }
}
