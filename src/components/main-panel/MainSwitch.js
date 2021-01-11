import React, { Suspense, lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import { retry } from '../../utils';
import ErrorBoundary from '../pages/ErrorBoundary';
import PropTypes from 'prop-types';

//lazy loading
const HomePage = lazy(() => retry(() => import(/* webpackChunkName: "HomePage" */ './pages/HomePage')));
const NotFoundSectionPage = lazy(() => retry(() => import(/* webpackChunkName: "NotFoundSectionPage" */ './pages/NotFoundSectionPage')));
const ZendroStudioPage = lazy(() => retry(() => import(/* webpackChunkName: "ZendroStudioPage" */ './pages/ZendroStudioPage')));
const TablesSwitch = lazy(() => retry(() => import(/* webpackChunkName: "TablesSwitch" */ './table-panel/TablesSwitch')));

export default function StackView(props) {
  const { permissions, zendroStudio } = props;

  return (
      <Suspense fallback={<div />}>
        <Switch>
          <Route exact path="/main">
            <ErrorBoundary showMessage={true} belowToolbar={true}>
              <HomePage />
            </ErrorBoundary>
          </Route>

          <Route exact path="/main/home">
            <ErrorBoundary showMessage={true} belowToolbar={true}>
              <HomePage />
            </ErrorBoundary>
          </Route>

          <Route path="/main/admin">
            <ErrorBoundary showMessage={true} belowToolbar={true}>
              <TablesSwitch permissions={permissions}/>
            </ErrorBoundary>
          </Route>

          <Route path="/main/model">
            <ErrorBoundary showMessage={true} belowToolbar={true}>
              <TablesSwitch permissions={permissions}/>
            </ErrorBoundary>
          </Route>

          {
            zendroStudio &&
            <Route path="/main/zendro-studio" >
              <ErrorBoundary showMessage={true} belowToolbar={true}>
                <ZendroStudioPage />
              </ErrorBoundary>
            </Route>
          }

          <Route path="/main">
            <ErrorBoundary showMessage={true} belowToolbar={true}>
              <NotFoundSectionPage />
            </ErrorBoundary>
          </Route>

        </Switch>
      </Suspense>
  );
}

StackView.propTypes = {
  permissions: PropTypes.object,
};