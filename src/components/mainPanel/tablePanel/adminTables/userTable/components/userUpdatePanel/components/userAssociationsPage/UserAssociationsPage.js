import React from 'react';
import PropTypes from 'prop-types';
import RoleTransferLists from './roleTransferLists/RoleTransferLists'
import UserAssociationMenuTabs from './UserAssociationsMenuTabs'
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
    item,
    rolesIdsToAdd,
    rolesIdsToRemove,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleTransferToRemove,
    handleUntransferFromRemove,
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
            <UserAssociationMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* Role Transfer List */}
          {(associationSelected === 'role') && (
            <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
              <RoleTransferLists
                item={item}
                idsToAdd={rolesIdsToAdd}
                idsToRemove={rolesIdsToRemove}
                handleTransferToAdd={handleTransferToAdd}
                handleUntransferFromAdd={handleUntransferFromAdd}
                handleTransferToRemove={handleTransferToRemove}
                handleUntransferFromRemove={handleUntransferFromRemove}
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
  item: PropTypes.object.isRequired,
  rolesIdsToAdd: PropTypes.array.isRequired,
  rolesIdsToRemove: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleTransferToRemove: PropTypes.func.isRequired,
  handleUntransferFromRemove: PropTypes.func.isRequired,
};