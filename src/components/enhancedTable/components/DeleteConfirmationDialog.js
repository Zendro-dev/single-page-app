import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import DetailPanel from '../../detailPanel/DetailPanel'


/*
  Material-UI components
*/
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';



/*
  Styles
*/
const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3),
    minWidth: 450,
  },
  card: {
    margin: theme.spacing(0),
    overflowX: 'auto',
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  tabsA: {
    backgroundColor: "#fafafa",
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    bottom: -26+3,
    right: 10,
    margin: '0 auto',
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DeleteConfirmationDialog(props) {
  /*
    Styles
  */
  const classes = useStyles();

  /*
    Properties
  */
  const { 
    headCells, //current model attributes
    item, //current item values
    toOnes, //current model toOne associations
    toManys, //current model toMany associations
    modelNames, //current model names
    handleAccept,
    handleReject,
  } = props;
  
  /*
    State
  */
  const [open, setOpen] = useState(true);

  /*
    Refs
  */

  /*
    Handlers
  */
 
  const handleCancel = (event) => {
    //update state
    setOpen(false);
    //callback
    handleReject(event);
  }

  const handleOk = (event) => {
    //update state
    setOpen(false);
    //callback
    handleAccept(event, item);
  }

  /*
    Render
  */
  return (
    
    <Dialog 
      open={open}
      fullWidth={true}
      maxWidth='lg' 
      onClose={handleCancel} 
    >
      
      
      <DialogTitle>
        Are you sure you want to delete this item?
      </DialogTitle>

      <DialogContent dividers>
        <DetailPanel 
          headCells={headCells}
          item={item}
          toOnes={toOnes}
          toManys={toManys}
          modelNames={modelNames}
          dialog={false}
        />
      </DialogContent>

      <DialogActions>
        <Button className={classes.button} onClick={handleCancel} color="primary">
          DO NOT DELETE
        </Button>
        <Button className={classes.button} onClick={handleOk} variant="contained" color="secondary">
          YES, DELETE
        </Button>
      </DialogActions>

    </Dialog>
  );
}

/*
  PropTypes
*/