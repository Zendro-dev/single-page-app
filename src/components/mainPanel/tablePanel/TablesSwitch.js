import React from 'react';
import { 
  Switch,
  Route
} from 'react-router-dom'

import AminoacidsequenceTable from './modelsTables/aminoacidsequenceTable/AminoacidsequenceEnhancedTable'
import SequencingExperimentTable from './modelsTables/sequencingExperimentTable/SequencingExperimentEnhancedTable'
import IndividualTable from './modelsTables/individualTable/IndividualEnhancedTable'
import Role_to_userTable from './modelsTables/role_to_userTable/Role_to_userEnhancedTable'
import Transcript_countTable from './modelsTables/transcript_countTable/Transcript_countEnhancedTable'

import RoleTable from './adminTables/roleTable/RoleEnhancedTable'
import UserTable from './adminTables/userTable/UserEnhancedTable'
import NotFoundSection from '../pages/NotFoundSectionPage'


export default function TablesSwitch() {
  return (
    
    <Switch>

        {/* Models */}
        <Route exact path="/main/model/aminoacidsequence" component={AminoacidsequenceTable} />
        <Route exact path="/main/model/sequencingExperiment" component={SequencingExperimentTable} />
        <Route exact path="/main/model/individual" component={IndividualTable} />
        <Route exact path="/main/model/role_to_user" component={Role_to_userTable} />
        <Route exact path="/main/model/transcript_count" component={Transcript_countTable} />

        {/* Accounts admin */}
        <Route exact path="/main/admin/role" component={RoleTable} />
        <Route exact path="/main/admin/user" component={UserTable} />

        {/* Default */}
        <Route path="/main/" component={NotFoundSection} />

    </Switch>
  );
}
