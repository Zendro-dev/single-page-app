import { ReactElement } from 'react';
import { Switch, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

interface Props {
  path: string;
}

const ModelHome = () => <div>Home works!</div>;

export default function ModelRoutes({ path }: Props): ReactElement {
  return (
    <Switch>
      <PrivateRoute exact path={path} component={ModelHome} />
    </Switch>
  );
}
