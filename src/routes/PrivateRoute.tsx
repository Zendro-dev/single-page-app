import { Redirect, Route, RouteProps, useLocation } from 'react-router-dom';
import { userIsAuthenticated } from '../utils/auth';

const PrivateRoute: React.FC<RouteProps> = ({ ...routeProps }) => {
  const location = useLocation();
  return userIsAuthenticated() && location.pathname !== '/login' ? (
    <Route {...routeProps} />
  ) : (
    <Redirect
      to={{
        pathname: '/login',
        state: { from: location },
      }}
    />
  );
};

export default PrivateRoute;
