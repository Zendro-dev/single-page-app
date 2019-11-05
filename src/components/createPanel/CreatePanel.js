import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AttributesPage from './components/AttributesPage'

/*
  Material-UI components
*/
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

/*
  Styles
*/
const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(0),
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
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DetailView(props) {
  /*
    Styles
  */
  const classes = useStyles();

  /*
    Properties
  */
  const { headCells, item, open, handleClose } = props;
  const minListHeight = 200;
  const maxListHeight = 450;
  const defaultRowHeight = 50;
  
  /*
    State
  */

  /*
    Hooks
  */

  /*
    Methods
  */
  function getEditableItems() {

    let its = Array.from(headCells);

    /*
      Remove no editable items:
        - name: id
    */
    for(var i=0; i<its.length; ++i)
    {
      if(its[i].name.toLowerCase() === 'id') {
        //remove item
        its.splice(i, 1);
      }
    }

    return its;
  }

  /*
    Handlers
  */
  const handleChipClick = (event, item) => {
    console.log("@- chip clicked: item: ", item);
  }

  const handleChipDelete = (event, item) => {
    console.log("@- chip delete: item: ", item);
  }

  /*
    Render
  */
  return (
    <div className={classes.root}>
      <Grid container justify='center'>
        <Grid item xs={12}>

          <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
            <AppBar className={classes.appBar}>
              <Toolbar>
                <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                  New Item
                </Typography>
              </Toolbar>
            </AppBar>

            {/* Attributes Page */}
            <AttributesPage
              items={getEditableItems()}
              handleClose={handleClose}
            />

          </Dialog>
        </Grid>
      </Grid>
    </div>
  );
}

/*
  PropTypes
*/