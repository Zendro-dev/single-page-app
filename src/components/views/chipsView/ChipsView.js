import React, { useState, useEffect, useRef, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ChipsViewSearchBar from './components/ChipsViewSearchBar'

/*
  Material-UI components
*/
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';


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
  ibox: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  divider: {
    height: 1,
    width: '100%',
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
    onGetSearchAllowed,
  } = props;
  
  /*
    State
  */
  //filter
  const [filterStates, setFilterStates] = useState(items.map(function(item, index){ return {key: item.key, filtered: false}})); //filtered means no-visible
  const [searchValue, setSearchValue] = useState('');
  const [searchActive, setSearchActive] = useState(false);

  /*
    Refs
  */
  const rootRef = useRef(null);
  
  /*
    Hooks
  */
  useEffect(() => {
      
    //add event listener
    window.addEventListener("keydown", handleWindowKeyDown, false);

    // clean up
    return () => {
      window.removeEventListener("keydown", handleWindowKeyDown, false);
    }

  }, []);

  useEffect(() => {
    console.log("@- new searchValue: ", searchValue);

    //if empty filter
    if(searchValue === '') {
      //close search
      setSearchActive (false);
    }
  }, [searchValue]);

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

  function getFilterStatus(key) {
    let it = undefined;

    //find index
    if(filterStates.length > 0) {
      it = filterStates.find(itemHasKey, {key:key});
    }
    //update state
    if(it !== undefined) {
      return it.filtered;
    } else {
      return false;
    }
  }

  function getMatches(value) {
    let m = [];

    for(var i=0; i<items.length; ++i)
    {
      //search
      let l = items[i].label.trim().toLowerCase();
      let v = value.trim().toLowerCase();
      let s = l.indexOf(v);

      if(s !== -1) {
        //add match
        m.push(items[i].key);
      }
    }

    return m;
  }

  /*
    Handlers
  */
  const handleWindowKeyDown = (event) => {
    /*
      Checks to open search bar.
    */
    if(onGetSearchAllowed() //no field has focus
        && !searchActive    //search input is inactive
        && !event.ctrlKey   //no ctrl key
        && /^[a-zA-Z0-9!"#$%&'()*+,.\/:;<=>¿?@\[\]^_`{|}~-°]$/.test(event.key) //is printable (no-white-space) 
      )
    {  
      //set search active
      setSearchActive(true);
    }
  }

  const handleSearchOpen = (event) => {
    //update state
    setSearchActive(true);
  };


  const handleSearchClose = (event) => {
    /*
      Unfiltering
    */
    //new filter states array: all unfiltered
    let newFilterStates = items.map(function(item, index){ return {key: item.key, filtered: false}});
    
    //update state
    setFilterStates(newFilterStates);
    setSearchValue('');
    setSearchActive(false);
  };

  const handleSearchChange = (event, value) => {
    /*
      Do filtering
    */
    //get match keys
    let matches = getMatches(value);

    //new filter states array: all filtered
    let newFilterStates = items.map(function(item, index){ return {key: item.key, filtered: true}});

    //for each match
    for(var j=0; j<matches.length; ++j)
    {
      //make new filter state object
      let o = {key: matches[j], filtered: false};
      let i = -1;

      //find index
      i = items.findIndex(itemHasKey, {key:matches[j]});

      //update filter state for matching item
      if(i !== -1) {
        newFilterStates[i] = 0;
      }
    }

    //update value state
    setSearchValue(value);

    //update filter states
    setFilterStates(newFilterStates);
  }

  /*
    Render
  */
  return (
    <div ref={rootRef} className={classes.root}>
      <Grid container justify='center' spacing={2}>
        
        {/* Search Bar */}
        <Grid item xs={12}>
          <Box className={classes.ibox}>
            <ChipsViewSearchBar 
              value={searchValue}
              searchActive={searchActive}
              handleValueChange={handleSearchChange}
              handleOpen={handleSearchOpen}
              handleClose={handleSearchClose}
            />
          </Box>
        </Grid>

        {/* Divider */}
        <Divider className={classes.divider} orientation="horizontal" />

        {/* Chips */}
        <Grid item xs={12}>
          <Box 
            className={classes.box} 
            border={0} 
            borderColor="grey.500" 
            borderRadius="borderRadius">

            {items.map((item, index) => {
              var hasFocus = getFocusStatus(item.key);
              var valueOk = getValueOkStatus(item.key);
              var filtered = getFilterStatus(item.key);

              return (
                <span key={'span-'+item.key}>
                  {(!filtered) && (
                    <Chip
                      key={item.key}
                      label={item.label}
                      className={classes.chip}
                      variant={hasFocus ? 'default' : 'outlined'}
                      size='small'
                      color={ (hasFocus || valueOk===1) ? 'primary' : (valueOk === -1) ? 'secondary' : 'default'}
                      icon={(valueOk === 1) ? <DoneIcon /> : null}
                      clickable={true}
                      onClick={(event) => handleClick(event, item)}
                      onDelete={deletable ? ((event) => handleDelete(event, item)) : undefined}
                    />
                  )}
                </span>
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
