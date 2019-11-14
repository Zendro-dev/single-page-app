import React from 'react';
import RolesToAddTransferView from './rolesToAddTransferView/RolesToAddTransferView'
import RolesToRemoveTransferView from './rolesToRemoveTransferView/RolesToRemoveTransferView'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
  },
}));

export default function RoleTransferLists(props) {
  const classes = useStyles();

  const {
    item,
    idsToAdd,
    idsToRemove,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleTransferToRemove,
    handleUntransferFromRemove,
  } = props;
  
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

          <Grid item xs={12}>
            <RolesToAddTransferView
              item={item}
              idsToAdd={idsToAdd}
              handleTransfer={handleTransferToAdd}
              handleUntransfer={handleUntransferFromAdd}
            />
          </Grid>

          <Grid item xs={12}>
            <RolesToRemoveTransferView
              item={item}
              idsToRemove={idsToRemove}
              handleTransfer={handleTransferToRemove}
              handleUntransfer={handleUntransferFromRemove}
            />
          </Grid>

        </Grid>
      </Fade>
    </div>
  );
}
/*
  PropTypes
*/
RoleTransferLists.propTypes = {
  item: PropTypes.object.isRequired,
  idsToAdd: PropTypes.array.isRequired,
  idsToRemove: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.function.isRequired,
  handleUntransferFromAdd: PropTypes.function.isRequired,
  handleTransferToRemove: PropTypes.function.isRequired,
  handleUntransferFromRemove: PropTypes.function.isRequired,
};