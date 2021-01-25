import React, { Suspense, lazy } from 'react';
import { retry } from '../../../../../../../../../utils';
import PropTypes from 'prop-types';
import ErrorBoundary from '../../../../../../../../pages/ErrorBoundary';
import RoleAssociationsMenuTabs from './RoleAssociationsMenuTabs';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
//lazy loading
const UsersCompactView = lazy(() => retry(() => import(/* webpackChunkName: "Detail-CompactView-Users" */ './users-compact-view/UsersCompactView')));

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
    minHeight: `calc(57vh + 84px)`,
  },
  menu: {
    marginTop: theme.spacing(0),
  }
}));

export default function RoleAssociationsPage(props) {
  const classes = useStyles();
  const {
    item,
    deleted,
    handleClickOnUserRow,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('users');

  const handleAssociationClick = (event, newValue) => {
    setAssociationSelected(newValue);
  }

  return (
    <Fade in={!deleted} timeout={500}>
      <Grid
        id='RoleAssociationsPage-div-root'
        className={classes.root} 
        container 
        justify='center'
        alignItems='flex-start'
        alignContent='flex-start'
        spacing={2}
      > 
        {/* Menu Tabs: Associations */}
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7} className={classes.menu}>
          <RoleAssociationsMenuTabs
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* Users Compact View */}
        {(associationSelected === 'users') && (
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <Suspense fallback={<div />}><ErrorBoundary belowToolbar={true} showMessage={true}>
              <UsersCompactView
                item={item}
                handleClickOnUserRow={handleClickOnUserRow}
              />
            </ErrorBoundary></Suspense>
          </Grid>
        )}

      </Grid>
    </Fade>
  );
}
RoleAssociationsPage.propTypes = {
  item: PropTypes.object.isRequired,
  deleted: PropTypes.bool,
  handleClickOnUserRow: PropTypes.func.isRequired, 
};
