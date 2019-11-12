import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { VariableSizeList as List } from 'react-window';

/*
  Material-UI components
*/
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

/*
  Styles
*/
const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(0),
  },
  card: {
    margin: theme.spacing(1),
    overflowX: 'auto',
  },
}));

export default function DetailView(props) {
  /*
    Styles
  */
  const classes = useStyles();

  /*
    Properties
  */
  const {
    modelNames,
    item, 
    headCells,
    toOnes,
    toManys,
  } = props;
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
    console.log("@@- headCells: ", headCells);
  }, []);
  
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
          <Card className={classes.card}>

            <List
              height={listHeight}
              width="100%"
              itemCount={headCells.length}
              itemSize={getItemSize}
            >
              {Row}
            </List>

          </Card>
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