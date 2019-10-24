import React from 'react';
import { 
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

//components
import RoleTable from './admin/RoleTable'
import UserTable from './admin/UserTable'
import UserTableB from './admin/UserTableB'
import UserTableC from './admin/UserTableC'
import NotFoundSection from '../NotFoundSection'


function TableView() {
  return (
    
              <Switch>
                  
                  <Route exact path="/main/admin/role" component={RoleTable} />
                  <Route exact path="/main/admin/user" component={UserTableC} />
                  <Route exact path="/main/admin/role_to_user" component={UserTableB} />

                  {/* Default */}
                  <Route exact path="/main/admin/role" component={NotFoundSection} />

              </Switch>
  );
}

export default TableView;
