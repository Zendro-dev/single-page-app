import React from 'react';
import { 
  Switch,
  Route
} from 'react-router-dom'
import TablesSwitch from './tablePanel/TablesSwitch'
import HomePage from './pages/HomePage'
import NotFoundSectionPage from './pages/NotFoundSectionPage'

function StackView() {
  return (
              <Switch>
                  <Route exact path="/main">
                      <HomePage />
                  </Route>

                  <Route exact path="/main/home">
                      <HomePage />
                  </Route>

                  <Route path="/main/admin">
                      <TablesSwitch />
                  </Route>

                  <Route path="/main">
                      <NotFoundSectionPage />
                  </Route>

              </Switch>
  );
}

export default StackView;
