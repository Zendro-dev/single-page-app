import React from 'react';
import RoleTransferLists from './RoleTransferLists/RoleTransferLists'
import AssociationMenuTabs from './AssociationsMenuTabs'
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
    //find current association ids to add
    for(var i=0; i<associationIdsToAdd.length; ++i) {
      if(associationIdsToAdd[i].key === associationName) {
        return associationIdsToAdd[i].ids;
      }
    }
    //if not found
    return [];
  }

  function getIdsToRemove(associationName) {
    //find current association ids to remove
    for(var i=0; i<associationIdsToRemove.length; ++i) {
      if(associationIdsToRemove[i].key === associationName) {
        return associationIdsToRemove[i].ids;
      }
    }
    //if not found
    return [];
  }

  const handleAssociationClick = (event, newValue) => {
    //update current association selected
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
          <Grid item xs={11} sm={9} className={classes.menu}>
            <AssociationMenuTabs
              associationSelected={associationSelected}
              handleClick={handleAssociationClick}
            />
          </Grid>

          {/* Role Transfer List */}
          {(associationSelected === 'role') && (
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
/*
  PropTypes
*/
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