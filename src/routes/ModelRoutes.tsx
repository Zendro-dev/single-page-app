import { ReactElement } from 'react';
import { Switch, Route } from 'react-router-dom';
import MainPanel from '../layout/MainPanel';
import TableLayout from '../layout/TableLayout';

interface Props {
  path: string;
}

const ModelHome = () => <div>Home works!</div>;

export default function ModelRoutes({ path }: Props): ReactElement {
  return (
    <MainPanel>
      <Switch>
        <Route exact path={path} component={TableLayout} />
      </Switch>
    </MainPanel>
  );
}
