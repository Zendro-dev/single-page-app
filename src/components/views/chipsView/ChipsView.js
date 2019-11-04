import React, { useState, useEffect, useRef, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { borders } from '@material-ui/system';
import { VariableSizeList as List } from 'react-window';
import ChipsViewSearchBar from './components/ChipsViewSearchBar'

/*
  Material-UI components
*/
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Popover from '@material-ui/core/Popover';
import Popper from '@material-ui/core/Popper';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

//icons
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
    handleClick, handleDelete,
    allowSearch,
  } = props;
  
  /*
    State
  */
  //popper
  const [searchAnchorEl, setSearchAnchorEl] = useState(null);
  const [searchOpen, setSearchOpen] = useState(true);

  /*
    Refs
  */
  const rootRef = useRef(null);
  
  /*
    Hooks
  */
  useEffect(() => {

    console.log("onRender: allowSearch: ", allowSearch);
      
    //add event listener
    window.addEventListener("keydown", handleWindowKeyDown, false);

    // clean up
    return () => {
      window.removeEventListener("keydown", handleWindowKeyDown, false);
    }

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
    Handlers
  */
  const handleWindowKeyDown = (event) => {
      
    console.log("EVENT WINDOW: ", event.key, " allowSearch: ", allowSearch);
    
    if(allowSearch !== undefined && allowSearch) {
      //open search popper
      //setSearchPopoverOpen(true);
    }
  }

  const handleSearchClick = (event) => {

    console.log("#: onCLick: searchOpen ", searchOpen);
    console.log("#: onCLick: event.currentTarget: ", event.currentTarget);
    console.log("#: onCLick: rootRef.current ", rootRef.current);

    setSearchAnchorEl(rootRef.current);
    setSearchOpen(true);
  };

  const handleSearchClose = (event) => {
    setSearchOpen(false);
  };

  /*
    Render
  */
  return (
    <div ref={rootRef} className={classes.root}>
      <Grid container justify='center' spacing={1}>
        
        <Grid item xs={12}>
          <ChipsViewSearchBar />
        </Grid>

        <Grid item xs={12}>
          <Box 
            className={classes.box} 
            border={1} 
            borderColor="text.secondary" 
            borderRadius="borderRadius">

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
                  color={ (hasFocus || valueOk===1) ? 'primary' : (valueOk === -1) ? 'secondary' : 'default'}
                  // style={{backgroundColor: 'primary', color: 'primary'}}
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
};

/*
  PropTypes
*/
ChipsView.propTypes = {
  items: PropTypes.array.isRequired,
};
