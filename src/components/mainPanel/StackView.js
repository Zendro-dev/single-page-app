import React from 'react';
import { 
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

//components
import HomePage from './HomePage'
import TableVIew from './TableView'
import NotFoundSection from '../NotFoundSection'


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
                      <TableVIew />
                  </Route>

                  <Route path="/main">
                      <NotFoundSection />
                  </Route>

              </Switch>
  );
}

export default StackView;
