import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { borders } from '@material-ui/system';
import { VariableSizeList as List } from 'react-window';

/*
  Material-UI components
*/
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import DoneIcon from '@material-ui/icons/Done';

/*
  Styles
*/
const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(5),
  },
  box: {
    margin: 'auto',
    maxHeight: '80vh',
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
  const { 
    items, itemFocusStates, deletable,
    valueOkStates, 
    handleClick, handleDelete 
  } = props;
  
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
  function itemHasKey(item, index) {
    if(item !== undefined) {
      return item.key === this.key;
    } else {
      return false;
    }
  }

  function getFocusStatus(key) {
    let it = undefined;

    //find index
    if(itemFocusStates.length > 0) {
      it = itemFocusStates.find(itemHasKey, {key:key});
    }
    //update state
    if(it !== undefined) {
      return it.focus;
    } else {
      return false;
    }
  }

  function getValueOkStatus(key) {
    let it = undefined;

    //find index
    if(valueOkStates.length > 0) {
      it = valueOkStates.find(itemHasKey, {key:key});
    }
    //update state
    if(it !== undefined) {
      return it.valueOk;
    } else {
      return 0;
    }
  }

  /*
    Render
  */
  return (
    <div className={classes.root}>
      <Grid container justify='center'>
        <Grid item xs={12}>
          <Box className={classes.box} border={1} borderColor="primary.main" borderRadius="borderRadius">

            {items.map((item, index) => {
              var hasFocus = getFocusStatus(item.key);
              var valueOk = getValueOkStatus(item.key);

              return (
                <Chip
                  key={item.key}
                  label={item.label}
                  className={classes.chip}
                  variant={hasFocus ? 'default' : 'outlined'}
                  size='small'
                  color={
                    hasFocus ? 'primary' : 
                      (valueOk === 1 ? 'secondary' : 'default')
                  }
                  icon={(valueOk === 1) ? <DoneIcon /> : null}
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