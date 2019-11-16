import React from 'react';
import PropTypes from 'prop-types';
import RoleTransferLists from './RoleTransferLists/RoleTransferLists'
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
    associationIdsToAdd,
    associationIdsToRemove,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleTransferToRemove,
    handleUntransferFromRemove,
  } = props;
  const [associationSelected, setAssociationSelected] = React.useState('');

  function getIdsToAdd(associationName) {
    for(var i=0; i<associationIdsToAdd.length; ++i) {
      if(associationIdsToAdd[i].key === associationName) {
        return associationIdsToAdd[i].ids;
      }
    }
    return [];
  }

  function getIdsToRemove(associationName) {
    for(var i=0; i<associationIdsToRemove.length; ++i) {
      if(associationIdsToRemove[i].key === associationName) {
        return associationIdsToRemove[i].ids;
      }
    }
    return [];
  }

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
          {(associationSelected === 'role' || associationSelected === '') && (
            <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
              <RoleTransferLists
                item={item}
                idsToAdd={getIdsToAdd('role')}
                idsToRemove={getIdsToRemove('role')}
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
  hidden: PropTypes.bool.bool.isRequired,
  item: PropTypes.object.isRequired,
  associationIdsToAdd: PropTypes.array.isRequired,
  associationIdsToRemove: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.function.isRequired,
  handleUntransferFromAdd: PropTypes.function.isRequired,
  handleTransferToRemove: PropTypes.function.isRequired,
  handleUntransferFromRemove: PropTypes.function.isRequired,
};