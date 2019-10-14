import { combineReducers } from 'redux'
import {
    LOGIN_REQ,
    LOGIN_OK,
    LOGIN_FAIL
} from './actions.js'

/*
  Reducers
*/
function urls(
    //set initial state.login if 'undefined'
    state = {
        graphqlServerUrl: "http://localhost:3000/graphql",
        loginServerUrl: "http://localhost:3000/login"
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
        status: '',
        token: '',
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
                token: '',
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
                token: '',
                expirationDate: null,
                error: action.error
            });

        default:
        return state;
    }//end: switch()
}//end: login()

//root reducer
const rootReducer = combineReducers({
    urls,
    login
})
  
export default rootReducer