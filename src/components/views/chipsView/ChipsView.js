import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { VariableSizeList as List } from 'react-window';

/*
  Material-UI components
*/
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

/*
  Styles
*/
const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
  },
  card: {
    margin: theme.spacing(5),
    maxHeight: '90vh',
    overflow: 'auto',
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

export default function ChipsView(props) {
  /*
    Styles
  */
  const classes = useStyles();

  /*
    Properties
  */
  const { items, deletable, handleClick, handleDelete } = props;
  
  /*
    State
  */

  /*
    Hooks
  */
  useEffect(() => {
  }, []);

  /*
    Methods
  */

  /*
    Render
  */
  return (
    <div className={classes.root}>
      <Grid container justify='center'>
        <Grid item xs={12}>
          <Box className={classes.card}>

            {items.map(item => {
              return (
                <Chip
                  key={item.key}
                  label={item.label + item.type}
                  className={classes.chip}
                  variant="outlined"
                  clickable={true}
                  onClick={(event) => handleClick(event, item)}
                  onDelete={deletable ? ((event) => handleDelete(event, item)) : undefined}
                />
              );
            })}

          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

/*
  PropTypes
*/
ChipsView.propTypes = {
  items: PropTypes.array.isRequired,
};