import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import UserAttributesPage from './components/userAttributesPage/UserAttributesPage'
import UserAssociationsPage from './components/userAssociationsPage/UserAssociationsPage'
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3),
    minWidth: 450,
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function UserDetailPanel(props) {
  const classes = useStyles();
  const { 
    item,
    dialog,
    handleClose
  } = props;
  
  const [open, setOpen] = useState(true);
  const [valueOkStates, setValueOkStates] = useState(getInitialValueOkStates());

  function getInitialValueOkStates() {
    let keys = Object.keys(item);
    let initialValueOkStates = [];

    for(var i=0; i<keys.length; ++i) {
      if(keys[i] !== 'id') {
        let o = {
          key: keys[i],
          valueOk: getAcceptableStatus(keys[i], item[keys[i]])
        };
        initialValueOkStates.push(o);
      }
    }
    return initialValueOkStates;
  }

  const handleCancel = (event) => {
    setOpen(false);
    handleClose(event);
  }

  return (
    <div>
      {/* Dialog Mode */}
      {(dialog !== undefined && dialog === true) && (
        
        <Dialog fullScreen open={open} onClose={handleCancel} TransitionComponent={Transition}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <Tooltip title={"Close"}>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleCancel}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
              <Typography variant="h6" className={classes.title}>
                User Info
              </Typography>
            </Toolbar>
          </AppBar>
    
          <div className={classes.root}>
            <Grid container justify='center'>
              <Grid item xs={12}>
                  
                {/* Attributes Page */}
                <AttributesPage
                  item={item}
                  valueOkStates={valueOkStates}
                />
    
                {/* Associations Page */}
                <AssociationsPage
                  item={item}
                />
    
              </Grid>
            </Grid>
          </div>
        </Dialog>
      )}

      {/* No-Dialog Mode */}
      {(dialog !== undefined && dialog === false) && (
    
          <div className={classes.root}>
            <Grid container justify='center'>
              <Grid item xs={12}>
                  
                {/* Attributes Page */}
                <UserAttributesPage
                  item={item}
                  valueOkStates={valueOkStates}
                />
    
                {/* Associations Page */}
                <UserAssociationsPage
                  item={item}
                />
    
              </Grid>
            </Grid>
          </div>
      )}
    </div>
  );
}
UserDetailPanel.propTypes = {
  item: PropTypes.object.isRequired,
  dialog: PropTypes.bool,
  handleClose: PropTypes.function.isRequired
};