import React, { Suspense, lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import { retry } from '../../../utils.js';
import PropTypes from 'prop-types';
import NotFoundSection from '../pages/NotFoundSectionPage';
import NoPermissionSectionPage from '../pages/NoPermissionSectionPage';
import ErrorBoundary from '../../pages/ErrorBoundary';

//lazy loading
const NoAssocTable = lazy(() => retry(() => import(/* webpackChunkName: "Table-NoAssoc" */ './models-tables/no_assoc-table/No_assocEnhancedTable')));
const RoleTable = lazy(() => retry(() => import(/* webpackChunkName: "Table-Role" */ './admin-tables/role-table/RoleEnhancedTable')));
const RoleToUserTable = lazy(() => retry(() => import(/* webpackChunkName: "Table-RoleToUser" */ './admin-tables/role_to_user-table/Role_to_userEnhancedTable')));
const UserTable = lazy(() => retry(() => import(/* webpackChunkName: "Table-User" */ './admin-tables/user-table/UserEnhancedTable')));

export default function TablesSwitch(props) {
  const { permissions } = props;

  return (
    
    <Suspense fallback={<div />}>
      <Switch>
        {/* Models */}
        <Route exact path="/main/model/no_assoc" 
          render={
            /* acl check */
            (permissions&&permissions.no_assoc&&Array.isArray(permissions.no_assoc)
            &&(permissions.no_assoc.includes('read') || permissions.no_assoc.includes('*')))
            ? ((props) => <ErrorBoundary showMessage={true} belowToolbar={true}><NoAssocTable {...props} permissions={permissions}/></ErrorBoundary>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />

        {/* Admin models */}
        <Route exact path="/main/admin/role" 
          render={
            /* acl check */
            (permissions&&permissions.role&&Array.isArray(permissions.role)
            &&(permissions.role.includes('read') || permissions.role.includes('*')))
            ? ((props) => <ErrorBoundary showMessage={true} belowToolbar={true}><RoleTable {...props} permissions={permissions}/></ErrorBoundary>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/admin/role_to_user" 
          render={
            /* acl check */
            (permissions&&permissions.role_to_user&&Array.isArray(permissions.role_to_user)
            &&(permissions.role_to_user.includes('read') || permissions.role_to_user.includes('*')))
            ? ((props) => <ErrorBoundary showMessage={true} belowToolbar={true}><RoleToUserTable {...props} permissions={permissions}/></ErrorBoundary>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />
        <Route exact path="/main/admin/user" 
          render={
            /* acl check */
            (permissions&&permissions.user&&Array.isArray(permissions.user)
            &&(permissions.user.includes('read') || permissions.user.includes('*')))
            ? ((props) => <ErrorBoundary showMessage={true} belowToolbar={true}><UserTable {...props} permissions={permissions}/></ErrorBoundary>) : ((props) => <NoPermissionSectionPage {...props}/>)
        } />

        {/* Default */}
        <Route path="/main/" component={NotFoundSection} />
      </Switch>
    </Suspense>
  );
}

TablesSwitch.propTypes = {
  permissions: PropTypes.object,
};
