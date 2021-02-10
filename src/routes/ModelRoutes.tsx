import { ReactElement } from 'react';
import { Switch, Route, RouteComponentProps } from 'react-router-dom';
import MainPanel from '../layout/MainPanel';
import TableLayout from '../layout/TableLayout';

const ModelHome = () => <div>Home works!</div>;
const AssocHome: React.FC<RouteComponentProps> = () => <div>Assoc works!</div>;

export default function ModelRoutes(props: RouteComponentProps): ReactElement {
  return (
    <MainPanel>
      <Switch>
        <Route exact path={`/models/no_assoc`} component={TableLayout} />
        <Route path={'/'} component={ModelHome} />
      </Switch>
    </MainPanel>
  );
}
