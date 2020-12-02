import React, { Suspense, lazy } from 'react';
import { 
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
import { connect } from 'react-redux';
import { isAuthenticated } from './utils';

//lazy loading
const Login = lazy(() => import(/* webpackChunkName: "Login" */ './components/pages/LoginPage'));
const MainPanel = lazy(() => import(/* webpackChunkName: "MainPanel" */ './components/main-panel/MainPanel'));
const NotFoundPage = lazy(() => import(/* webpackChunkName: "NotFoundPage" */ './components/pages/NotFoundPage'));

function App() {
  return (
    <Router>
      <div>
        <Suspense fallback={<div />}>
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
        </Suspense>
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
