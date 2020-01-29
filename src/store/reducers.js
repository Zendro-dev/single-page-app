import { combineReducers } from 'redux'
import decode from 'jwt-decode';
import {
    LOGIN_REQ,
    LOGIN_OK,
    LOGIN_FAIL,
    LOGOUT,
    ACL_MODULE_FAIL,
    MODEL_CHANGE,
    CHANGES_COMPLETED,
    CLEAR_CHANGES,
} from './actions.js'

/*
  Reducers
*/
function urls(
    //set initial state.urls if 'undefined'
    state = {
        graphqlServerUrl: process.env.REACT_APP_CENZ_GRAPHQL_SERVER_URL || (process.env.REACT_APP_CENZ_API_URL) ? process.env.REACT_APP_CENZ_API_URL+"/graphql" : "http://localhost:3000/graphql",
        loginServerUrl: process.env.REACT_APP_CENZ_LOGIN_URL || (process.env.REACT_APP_CENZ_API_URL) ? process.env.REACT_APP_CENZ_API_URL+"/login" : "http://localhost:3000/login",
        exportServerUrl: process.env.REACT_APP_CENZ_EXPORT_URL || (process.env.REACT_APP_CENZ_API_URL) ? process.env.REACT_APP_CENZ_API_URL+"/export" : "http://localhost:3000/export",
    }, 
    action) {
        switch (action.type) {
            
            default:
            return state;
        }
    }//end: urls()

function limits(
    //set initial state.limits if 'undefined'
    state = {
        appMaxUploadSize: process.env.REACT_APP_CENZ_MAX_UPLOAD_SIZE || 500 // size in MB
    }, 
    action) {
        switch (action.type) {
            
            default:
            return state;
        }
    }//end: limits()

function login( 
    //set initial state.login if 'undefined'
    state = {
        isFetching: false,
        user: '',
        userId: null,
        userRoles: [],
        loginStatus: '',
        token: null,
        expirationDate: null,
        acl: null,
        error: null
    }, 
    action) {
    
      switch (action.type) {

          case LOGIN_REQ:
              return Object.assign({}, state, {
                  isFetching: true,
                  user: action.user,
                  userId: null,
                  userRoles: [],
                  loginStatus: 'loading',
                  token: null,
                  expirationDate: null,
                  acl: null,
                  error: null
              });

          case LOGIN_OK:
              return Object.assign({}, state, {
                  isFetching: false,
                  user: action.user,
                  userId: action.userId,
                  userRoles: action.userRoles,
                  loginStatus: 'success',
                  token: action.token,
                  expirationDate: action.expirationDate,
                  acl: action.acl,
                  error: null
              });
          
          case LOGIN_FAIL:
              return Object.assign({}, state, {
                  isFetching: false,
                  user: action.user,
                  userId: null,
                  userRoles: [],
                  loginStatus: 'error',
                  token: null,
                  expirationDate: null,
                  acl: null,
                  error: action.error
              });
          
          case LOGOUT:
              return Object.assign({}, state, {
                  isFetching: false,
                  user: '',
                  userId: null,
                  userRoles: [],
                  loginStatus: '',
                  token: null,
                  expirationDate: null,
                  acl: null,
                  error: null
              });

          case ACL_MODULE_FAIL:
          case MODEL_CHANGE:
          case CHANGES_COMPLETED:
          case CLEAR_CHANGES:
              return state;

          default:
            onRefresh(state);
            return state;
      }//end: switch()
}//end: login()

function aclModuleStatus(
  //set initial state.aclModuleStatus if 'undefined'
  state = {
      user: null,
      errors: null
  }, 
  action) {
      switch (action.type) {

        case ACL_MODULE_FAIL:
          return Object.assign({}, state, {
            user: action.user,
            errors: action.errors
          });
          
        default:
        return state;
      }
  }//end: aclModuleStatus()

function changes(
  //set initial state.changes if 'undefined'
  state = {
      models: {},
      lastModelChanged: {},
      changesCompleted: false
  }, 
  action) {
      switch (action.type) {
          
        case MODEL_CHANGE:
          let modelChanged = {};
          let lastModelChanged = {};
          let idChanged = {};
          
          //new change
          idChanged[String(action.item.id)] = {};
          idChanged[String(action.item.id)].op = action.op;
          idChanged[String(action.item.id)].item = action.item;
          idChanged[String(action.item.id)].newItem = action.newItem;
          if(state.models[action.model]&&state.models[action.model][String(action.item.id)]&&state.models[action.model][String(action.item.id)].changedAssociations) {
            idChanged[String(action.item.id)].changedAssociations = { ...state.models[action.model][String(action.item.id)].changedAssociations, ...action.changedAssociations};
          } else {
            idChanged[String(action.item.id)].changedAssociations = action.changedAssociations;
          }

          //set new change
          modelChanged[action.model] = {...state.models[action.model], ...idChanged};

          //set last model change
          lastModelChanged[action.model] = {...idChanged};
          
          //return new state
          return Object.assign({}, state, {
            models: {...state.models, ...modelChanged},
            lastModelChanged: lastModelChanged,
            changesCompleted: false
          });

        case CHANGES_COMPLETED:
          //return new state
          return Object.assign({}, state, {
            changesCompleted: true
          });

        case CLEAR_CHANGES:
          //return new state
          return Object.assign({}, state, {
            models: {},
            lastModelChanged: {},
            changesCompleted: false
          });

          default:
          return state;
      }
  }//end: changes()

//root reducer
const rootReducer = combineReducers({
    urls,
    limits,
    login,
    aclModuleStatus,
    changes,
})

function onRefresh(state) {
  /*
    JWT
  */
  const token = localStorage.getItem('token');
  var decoded_token = null;
  try {
    decoded_token = decode(token);
    
    //if valid token...
    if(decoded_token) {

      let expdate = new Date(decoded_token.exp*1000);
      let d = new Date();
      let expired = expdate < d;

      //init login state to token values
      state.isFetching = false;
      state.user = decoded_token.email;
      state.userId = decoded_token.id;
      state.userRoles = decoded_token.roles;
      state.token = token;
      state.expirationDate = decoded_token.exp;
      state.acl = null;
      state.error = null;

      
      // if not expired...
      if(!expired) {
        state.loginStatus = 'refreshed';
      } else {
        state.loginStatus = 'expired';

        //clean up local storage
        localStorage.removeItem('token');
        decoded_token = null;
      }
    }
  }
  catch(err) { //bad token
    state.loginStatus = 'expired';

    //clean up local storage
    localStorage.removeItem('token');
    decoded_token = null;
    
  } //JWT decoded ok
}
  
export default rootReducer
