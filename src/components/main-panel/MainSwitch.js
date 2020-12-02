import React, { Suspense, lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes         from 'prop-types';

//lazy loading
const HomePage = lazy(() => import(/* webpackChunkName: "HomePage" */ './pages/HomePage'));
const NotFoundSectionPage = lazy(() => import(/* webpackChunkName: "NotFoundSectionPage" */ './pages/NotFoundSectionPage'));
const ZendroStudioPage = lazy(() => import(/* webpackChunkName: "ZendroStudioPage" */ './pages/ZendroStudioPage'));
const TablesSwitch = lazy(() => import(/* webpackChunkName: "TablesSwitch" */ './table-panel/TablesSwitch'));

export default function StackView(props) {
  const { permissions, zendroStudio } = props;

  return (
    <Suspense fallback={<div />}>
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
    </Suspense>
  );
}

StackView.propTypes = {
  permissions: PropTypes.object,
};