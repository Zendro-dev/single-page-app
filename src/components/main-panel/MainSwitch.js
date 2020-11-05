import React             from 'react';
import { Switch, Route } from 'react-router-dom'
import PropTypes         from 'prop-types';

import HomePage            from './pages/HomePage'
import NotFoundSectionPage from './pages/NotFoundSectionPage'
import ZendroStudioPage    from './pages/ZendroStudioPage';
import TablesSwitch        from './table-panel/TablesSwitch'


export default function StackView(props) {
  const { permissions, zendroStudio } = props;

  return (
    <Switch>
      <Route exact path="/main">
        <HomePage />
      </Route>

      <Route exact path="/main/home">
        <HomePage />
      </Route>

      <Route path="/main/admin">
        <TablesSwitch permissions={permissions}/>
      </Route>

      <Route path="/main/model">
        <TablesSwitch permissions={permissions}/>
      </Route>

      {
        zendroStudio &&
        <Route path="/main/zendro-studio" >
          <ZendroStudioPage />
        </Route>
      }

      <Route path="/main">
        <NotFoundSectionPage />
      </Route>

    </Switch>
  );
}

StackView.propTypes = {
  permissions: PropTypes.object,
};