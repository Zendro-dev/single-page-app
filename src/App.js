import React, { Suspense, lazy } from 'react';
import { 
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
import { connect } from 'react-redux';
import { isAuthenticated, retry } from './utils';
import ErrorBoundary from './components/pages/ErrorBoundary';

//lazy loading
const Login = lazy(() => retry(() => import(/* webpackChunkName: "Login" */ './components/pages/LoginPage')));
const MainPanel = lazy(() => retry(() => import(/* webpackChunkName: "MainPanel" */ './components/main-panel/MainPanel')));
const NotFoundPage = lazy(() => retry(() => import(/* webpackChunkName: "NotFoundPage" */ './components/pages/NotFoundPage')));

function App() {
  return (
    <Router>
      <div>
        <Suspense fallback={<div />}>
          <Switch>
            
            <RootRoute exact path="/">
              <ErrorBoundary showMessage={true}>
                <Login />
              </ErrorBoundary>
            </RootRoute>

            <RootRoute exact path="/login">
              <ErrorBoundary showMessage={true}>
                <Login />
              </ErrorBoundary>
            </RootRoute>

            <PrivateRoute path="/main">
              <ErrorBoundary showMessage={true}>
                <MainPanel />
              </ErrorBoundary>
            </PrivateRoute>

            <Route path="*">
              <ErrorBoundary showMessage={true}>
                <NotFoundPage />
              </ErrorBoundary>
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
