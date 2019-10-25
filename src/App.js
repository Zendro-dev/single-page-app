import React from 'react';
import { 
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
import { connect } from 'react-redux';
import decode from 'jwt-decode';

//components
import Login from './components/pages/LoginPage'
import MainPanel from './components/mainPanel/MainPanel'
import NotFoundPage from './components/pages/NotFoundPage'


function App() {
  return (
    <Router>
      <div>
        <Switch>
          
          <RootRoute exact path="/">
            <Login />
          </RootRoute>

          <RootRoute exact path="/login">
            <Login />
          </RootRoute>

          <PrivateRoute path="/main">
            <MainPanel />
          </PrivateRoute>

          <Route path="*">
            <NotFoundPage />
          </Route>

        </Switch>
      </div>
    </Router>
  );
}


/*
  Component: Root Route
*/
// A wrapper for <Route> that redirects '/' to '/main/home/'
// screen if you are authenticated already.
function RootRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={ 
        ({ location }) => !isAuthenticated() ? 
        (children) : 
        (<Redirect 
            to={{pathname: "/main/home",
            state: { from: location }
            }}
        />)
      }
    />
  );
}

/*
  Component: Private Route
*/
// A wrapper for <Route> that redirects '/main/*' to '/'
// screen if you're not yet authenticated.
function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={ 
        ({ location }) => isAuthenticated() ? 
        (children) : 
        (<Redirect 
            to={{pathname: "/",
            state: { from: location }
            }}
        />)
      }
    />
  );
}

/*
  Methods
*/
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
function isAuthenticated() {

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
      return true;
    }
  }
  else{ //bad json

    //clean up localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');

    return false;
  }
}  


export default connect()(App)
