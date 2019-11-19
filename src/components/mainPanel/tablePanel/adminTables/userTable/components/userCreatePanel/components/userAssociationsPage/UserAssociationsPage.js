import React from 'react';
import PropTypes from 'prop-types';
import RoleTransferLists from './roleTransferLists/RoleTransferLists'
import UserAssociationsMenuTabs from './UserAssociationsMenuTabs'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
  },
  menu: {
    marginTop: theme.spacing(1),
  }
}));

export default function UserAssociationsPage(props) {
  const classes = useStyles();

  const {
    hidden,
    rolesIdsToAdd,
    handleTransferToAdd,
    handleUntransferFromAdd,
  } = props;
  
  const [associationSelected, setAssociationSelected] = React.useState('role');

  const handleAssociationClick = (event, newValue) => {
    setAssociationSelected(newValue);
  }

  return (
    <div hidden={hidden}>
      <Fade in={!hidden} timeout={500}>
        <Grid
          className={classes.root} 
          container 
          justify='center'
          alignItems='flex-start'
          spacing={0}
        > 

          {/* Menu Tabs: Associations */}
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7} className={classes.menu}>
            <UserAssociationsMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>
          
          {/* Role Transfer List */}
          {(associationSelected === 'role') && (
            <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
              <RoleTransferLists
                idsToAdd={rolesIdsToAdd}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
              />
            </Grid>
          )}

        </Grid>
      </Fade>
    </div>
  );
}
UserAssociationsPage.propTypes = {
  hidden: PropTypes.bool.isRequired,
  rolesIdsToAdd: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
};