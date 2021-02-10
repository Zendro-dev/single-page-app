import { Redirect, Route, RouteProps, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PrivateRoute: React.FC<RouteProps> = ({ ...routeProps }) => {
  const location = useLocation();
  const { auth } = useAuth();

  return auth.user?.isValid ? (
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
