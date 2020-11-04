import React from 'react';
import {
  Switch,
  Route
} from 'react-router-dom'
import PropTypes from 'prop-types';
import TablesSwitch from './table-panel/TablesSwitch'
import HomePage from './pages/HomePage'
import NotFoundSectionPage from './pages/NotFoundSectionPage'
import ZendroStudio from '../static/zendro-studio/ZendroStudio';

export default function StackView(props) {
  const { permissions } = props;

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

      <Route path="/main/zendro-studio" >
        <ZendroStudio />
      </Route>

      <Route path="/main">
        <NotFoundSectionPage />
      </Route>

    </Switch>
  );
}

StackView.propTypes = {
  permissions: PropTypes.object,
};