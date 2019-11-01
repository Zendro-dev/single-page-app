import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { VariableSizeList } from 'react-window';
import ChipsView from '../views/chipsView/ChipsView';
import AttributesFormView from '../views/attributesFormView/AttributesFormVIew'

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
  const [listHeight, setListHeight] = useState(Math.min(Math.max(minListHeight, (props.headCells.length * defaultRowHeight)), maxListHeight));
  const [areRowsReady, setAreRowsReady] = useState(false);
  var itemHeights = new Array(props.headCells.length).fill(defaultRowHeight);

  /*
    Hooks
  */
  useEffect(() => {

    if(areRowsReady) {
      //get new total items height
      var t = 0;
      for (var i=0; i < itemHeights.length; ++i) 
      {
        t += itemHeights[i];
      }
      //update listHeight
      setListHeight(Math.min(Math.max(minListHeight, t), maxListHeight));
    }
  }, [areRowsReady]);

  /*
    Methods
  */
  const getItemSize = index => {
    
    if(itemHeights.length > 0) {
      return itemHeights[index];
    }
    else {
      return defaultRowHeight;
    }
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
    SubComponent: Row
  */
  const Row = ({ index, style }) => {
    const head = headCells[index];
    const itemRef = useRef(null);

    useEffect(() => {
      //set new item height
      itemHeights[index] = itemRef.current.clientHeight;

      //update state
      if(index < (headCells.length-1)) {
        setAreRowsReady(false);
      } else {
        setAreRowsReady(true);
      }

    },[]);

    return (
      <CardContent ref={itemRef} >

        <Typography variant="h5">
          {head.label}
        </Typography>

        <Typography color="textSecondary">
          {item[head.name]}
        </Typography>

      </CardContent>
    )
  };

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
                <Button color="inherit" onClick={handleClose}>
                  save
                </Button>
              </Toolbar>
            </AppBar>

            <Grid container justify='center'>
              <Grid item xs={3}>
                <ChipsView
                  items={headCells}
                  deletable={false}
                  handleClick={handleChipClick}
                  handleDelete={handleChipDelete}
                />
              </Grid>
              <Grid item xs={6}>
                <AttributesFormView
                  items={headCells}
                />
              </Grid>
            </Grid>
          </Dialog>
        </Grid>
      </Grid>
    </div>
  );
}

/*
  PropTypes
*/
DetailView.propTypes = {
  item: PropTypes.object.isRequired,
  headCells: PropTypes.array.isRequired,
};