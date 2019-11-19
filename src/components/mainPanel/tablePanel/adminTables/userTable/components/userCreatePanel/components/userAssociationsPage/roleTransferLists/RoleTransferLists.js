import React from 'react';
import PropTypes from 'prop-types';
import RolesToAddTransferView from './rolesToAddTransferView/RolesToAddTransferView'
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
    idsToAdd,
    handleTransferToAdd,
    handleUntransferFromAdd,
  } = props;
  
  return (
    <div>
      <Fade in={true} timeout={500}>
        <Grid
          className={classes.root} 
          container 
          justify='center'
          alignItems='flex-start'
          spacing={0}
        > 

          <Grid item xs={12}>
            <RolesToAddTransferView
              idsToAdd={idsToAdd}
              handleTransfer={handleTransferToAdd}
              handleUntransfer={handleUntransferFromAdd}
            />
          </Grid>

        </Grid>
      </Fade>
    </div>
  );
}
RoleTransferLists.propTypes = {
  idsToAdd: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
};