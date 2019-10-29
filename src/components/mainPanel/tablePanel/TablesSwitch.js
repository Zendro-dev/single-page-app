import React from 'react';
import { 
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

//components
import RoleTable from './adminTables/RoleTable'
import UserTable from './adminTables/UserTable'
import NotFoundSection from '../pages/NotFoundSectionPage'


export default function TablesSwitch() {
  return (
    
              <Switch>
                  
                  <Route exact path="/main/admin/role" component={RoleTable} />
                  <Route exact path="/main/admin/user" component={UserTable} />

                  {/* Default */}
                  <Route exact path="/main/admin/role" component={NotFoundSection} />

              </Switch>
  );
}
