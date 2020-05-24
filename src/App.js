import React from 'react';
import { 
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
import { connect } from 'react-redux';
import { isAuthenticated } from './utils';

//components
import Login from './components/pages/LoginPage'
import MainPanel from './components/main-panel/MainPanel'
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

export default connect()(App)
