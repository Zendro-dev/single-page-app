import React from 'react';
import { 
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

//components
import RoleTable from './admin/RoleTable'
import NotFoundSection from '../NotFoundSection'


function TableView() {
  return (
    <Router>
          <div>
              <Switch>
                  
                  <Route exact path="/main/admin/role">
                      <RoleTable />
                  </Route>

                  <Route path="/main/admin">
                      <NotFoundSection />
                  </Route>

              </Switch>
          </div>
      </Router>
  );
}

export default TableView;
