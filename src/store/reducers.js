import { combineReducers } from 'redux'
import {
    LOGIN_REQ,
    LOGIN_OK,
    LOGIN_FAIL,
    LOGOUT
} from './actions.js'

/*
  Reducers
*/
function urls(
    //set initial state.login if 'undefined'
    state = {
        graphqlServerUrl: "http://localhost:3000/graphql",
        loginServerUrl: "http://localhost:3000/login",
        exportServerUrl: "http://localhost:3000/export"
    }, 
    action) {
        switch (action.type) {
            
            default:
            return state;
        }
    }//end: urls()

function limits(
    //set initial state.limit if 'undefined'
    state = {
        appMaxUploadSize: 500
    }, 
    action) {
        switch (action.type) {
            
            default:
            return state;
        }
    }//end: urls()

function login( 
    //set initial state.login if 'undefined'
    state = {
        isFetching: false,
        user: '',
        loginStatus: '',
        token: null,
        expirationDate: null,
        error: null
    }, 
    action) {
    
    switch (action.type) {

        case LOGIN_REQ:
            return Object.assign({}, state, {
                isFetching: true,
                user: action.user,
                loginStatus: 'loading',
                token: null,
                expirationDate: null,
                error: null
            });

        case LOGIN_OK:
            return Object.assign({}, state, {
                isFetching: false,
                user: action.user,
                loginStatus: 'success',
                token: action.token,
                expirationDate: action.expirationDate,
                error: null
            });
        
        case LOGIN_FAIL:
            return Object.assign({}, state, {
                isFetching: false,
                user: action.user,
                loginStatus: 'error',
                token: null,
                expirationDate: null,
                error: action.error
            });
        
        case LOGOUT:
            return Object.assign({}, state, {
                isFetching: false,
                user: '',
                loginStatus: '',
                token: null,
                expirationDate: null,
                error: null
            });

        default:
        return state;
    }//end: switch()
}//end: login()

//root reducer
const rootReducer = combineReducers({
    urls,
    limits,
    login
})
  
export default rootReducer