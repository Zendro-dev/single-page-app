import { Redirect, Route, RouteProps } from 'react-router-dom';
import { userIsAuthenticated } from '../utils/auth';

interface PrivateRouteProps extends RouteProps {
  component: React.FC;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  ...routeProps
}) => {
  return (
    <Route
      {...routeProps}
      render={({ location }) =>
        userIsAuthenticated() && location.pathname !== '/login' ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
