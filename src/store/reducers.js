import { combineReducers } from 'redux';
import {
  LOGIN_REQ,
  LOGIN_OK,
  LOGIN_FAIL,
  LOGIN_EXPIRED,
  LOGOUT,
  ACL_MODULE_OK,
  ACL_MODULE_FAIL,
  MODEL_CHANGE,
  CHANGES_COMPLETED,
  CLEAR_CHANGES,
} from './actions.js';
import globals from '../config/globals';

/*
  Reducers
*/
function urls(
  //set initial state.urls if 'undefined'
  state = {
    graphqlServerUrl:
      process.env.REACT_APP_ZENDRO_GRAPHQL_SERVER_URL ||
      (process.env.REACT_APP_ZENDRO_API_URL
        ? process.env.REACT_APP_ZENDRO_API_URL + '/graphql'
        : globals.GRAPHQL_SERVER_URL
        ? globals.GRAPHQL_SERVER_URL
        : 'http://localhost:3000/graphql'),
    loginServerUrl:
      process.env.REACT_APP_ZENDRO_LOGIN_URL ||
      (process.env.REACT_APP_ZENDRO_API_URL
        ? process.env.REACT_APP_ZENDRO_API_URL + '/login'
        : globals.LOGIN_URL
        ? globals.LOGIN_URL
        : 'http://localhost:3000/login'),
    exportServerUrl:
      process.env.REACT_APP_ZENDRO_EXPORT_URL ||
      (process.env.REACT_APP_ZENDRO_API_URL
        ? process.env.REACT_APP_ZENDRO_API_URL + '/export'
        : globals.EXPORT_URL
        ? globals.EXPORT_URL
        : 'http://localhost:3000/export'),
  },
  action
) {
  switch (action.type) {
    default:
      return state;
  }
} //end: urls()

function limits(
  //set initial state.limits if 'undefined'
  state = {
    maxUploadSize:
      process.env.REACT_APP_ZENDRO_MAX_UPLOAD_SIZE ||
      (globals.MAX_UPLOAD_SIZE ? globals.MAX_UPLOAD_SIZE : 500), // size in MB
    maxRecordLimit:
      process.env.REACT_APP_ZENDRO_MAX_RECORD_LIMIT ||
      (globals.MAX_RECORD_LIMIT ? globals.MAX_RECORD_LIMIT : 10000),
  },
  action
) {
  switch (action.type) {
    default:
      return state;
  }
} //end: limits()

function login(
  //set initial state.login if 'undefined'
  state = {
    isFetching: false,
    user: '',
    userId: null,
    userRoles: [],
    loginStatus: '',
    expirationDate: null,
    error: null,
  },
  action
) {
  switch (action.type) {
    case LOGIN_REQ:
      return Object.assign({}, state, {
        isFetching: true,
        user: action.user,
        userId: null,
        userRoles: [],
        loginStatus: 'loading',
        expirationDate: null,
        error: null,
      });

    case LOGIN_OK:
      return Object.assign({}, state, {
        isFetching: false,
        user: action.user,
        userId: action.userId,
        userRoles: action.userRoles,
        loginStatus: 'success',
        expirationDate: action.expirationDate,
        error: null,
      });

    case LOGIN_FAIL:
      return Object.assign({}, state, {
        isFetching: false,
        user: action.user,
        userId: null,
        userRoles: [],
        loginStatus: 'error',
        expirationDate: null,
        error: action.error,
      });

    case LOGIN_EXPIRED:
      return Object.assign({}, state, {
        isFetching: false,
        user: action.user,
        userId: action.userId,
        userRoles: action.userRoles,
        loginStatus: 'expired',
        expirationDate: action.expirationDate,
        error: null,
      });

    case LOGOUT:
      return Object.assign({}, state, {
        isFetching: false,
        user: '',
        userId: null,
        userRoles: [],
        loginStatus: '',
        expirationDate: null,
        error: null,
      });

    default:
      return state;
  } //end: switch()
} //end: login()

function aclModuleStatus(
  //set initial state.aclModuleStatus if 'undefined'
  state = {
    acl: null,
    user: null,
    errors: null,
    aclNotSet: false,
  },
  action
) {
  switch (action.type) {
    case ACL_MODULE_OK:
      return Object.assign({}, state, {
        acl: action.acl,
        user: action.user,
        errors: null,
        aclNotSet: false,
      });

    case ACL_MODULE_FAIL:
      return Object.assign({}, state, {
        acl: null,
        user: action.user,
        errors: action.errors,
        aclNotSet: true,
      });

    default:
      return state;
  }
} //end: aclModuleStatus()

function changes(
  //set initial state.changes if 'undefined'
  state = {
    models: {},
    lastModelChanged: {},
    lastChangeTimestamp: null,
    changesCompleted: false,
  },
  action
) {
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
      if (
        state.models[action.model] &&
        state.models[action.model][String(action.item.id)] &&
        state.models[action.model][String(action.item.id)].changedAssociations
      ) {
        idChanged[String(action.item.id)].changedAssociations = {
          ...state.models[action.model][String(action.item.id)]
            .changedAssociations,
          ...action.changedAssociations,
        };
      } else {
        idChanged[String(action.item.id)].changedAssociations =
          action.changedAssociations;
      }

      //set new change
      modelChanged[action.model] = {
        ...state.models[action.model],
        ...idChanged,
      };

      //set last model change
      lastModelChanged[action.model] = { ...idChanged };

      //return new state
      return Object.assign({}, state, {
        models: { ...state.models, ...modelChanged },
        lastModelChanged: lastModelChanged,
        lastChangeTimestamp: Date.now(),
        changesCompleted: false,
      });

    case CHANGES_COMPLETED:
      //return new state
      return Object.assign({}, state, {
        changesCompleted: true,
      });

    case CLEAR_CHANGES:
      //return new state
      return Object.assign({}, state, {
        models: {},
        lastModelChanged: {},
        lastChangeTimestamp: null,
        changesCompleted: false,
      });

    default:
      return state;
  }
} //end: changes()

//root reducer
const rootReducer = combineReducers({
  urls,
  limits,
  login,
  aclModuleStatus,
  changes,
});

export default rootReducer;
