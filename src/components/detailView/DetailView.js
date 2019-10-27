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
  const { headCells, item } = props;
  const minListHeight = 200;
  const maxListHeight = 450;
  var itemHeights = new Array(props.headCells.length).fill(50);
  /*
    State
  */
  const [totalItemsHeight, setTotalItemsHeight] = useState(props.headCells.length * 50);
  const [listHeight, setListHeight] = useState(Math.min(Math.max(minListHeight, (props.headCells.length * 50)), maxListHeight));
  /*
    Hooks
  */
  useEffect(() => {
    //get new total items height
    let t = 0;
    for (var i = 0; i < headCells.length; ++i) {
      t += itemHeights[i];
    }

    /**
     * Debug
     */
    console.log("curTH: ", totalItemsHeight, " newTH: ", t);
    console.log("curIH: ", itemHeights);

    //update totalItemsHeight
    setTotalItemsHeight(t);
    //update listHeight
    setListHeight(Math.min(Math.max(minListHeight, t)), maxListHeight);

  }, []);

  /*
    Methods
  */
  const getItemSize = index => {
    return itemHeights[index];
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