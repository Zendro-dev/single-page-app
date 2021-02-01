import { Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Login from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import ModelRoutes from './ModelRoutes';

const AppSwitch: React.FC = () => {
  return (
    <Suspense fallback={<div />}>
      <Switch>
        <PrivateRoute exact path="/" component={ModelRoutes} />
        <Route exact path="/login" component={Login} />
        <Route path="*" component={NotFoundPage} />
      </Switch>
    </Suspense>
  );
};

export default AppSwitch;
