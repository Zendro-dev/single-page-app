import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ChipsView from '../../views/chipsView/ChipsView';
import AttributesFormView from '../../views/attributesFormView/AttributesFormView'

/*
  Material-UI components
*/
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import Input from '@material-ui/core/Input';

/*
  Styles
*/
const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
  },
}));

export default function AttributesPage(props) {
  /*
    Styles
  */
  const classes = useStyles();

  /*
    Properties
  */
  const { items } = props;
  
  /*
    State
  */
  const [itemFocusStates, setItemFocusStates] = useState(items.map(function(item, index){ return {key: item.key, focus: false}}));
  const [valueOkStates, setValueOkStates] = useState(items.map(function(item, index){ return {key: item.key, valueOk: 0}}));
  //popper
  const [attsSearchAnchorEl, setAttsSearchAnchorEl] = useState(null);
  const [attsSearchOpen, setAttsSearchOpen] = useState(false);
  const [allowChipsSearch, setAllowChipsSearch] = useState(true);
  
  /*
    Refs
  */
  const fieldRefs = useRef([]);
  const fieldHasFocus = useRef(false);


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

  function getAcceptableStatus(key, value) {
    /*
      For now, just context validations are done
      to ensure that in future, this function can
      be used to enforce acceptable conditions
      retrieved from model specs.

      status codes:
        1: acceptable
        0: unknown/not tested yet (this is set on initial render)/empty
       -1: not acceptable 
    */
    
    /*
      Check 1: item exists with itemKey
    */
    let it = items.find(itemHasKey, {key: key});
    if(it === undefined) {
      return -1;
    }

    /*
      Check 2: null or undefined value
    */
    if(value === null || value === undefined) {
      return -1;
    }

    /*
      Check 3 (last): empty
    */
    if(value.trim() === '') {
      return 0;
    }

    return 1;
  }

  /*
    Handlers
  */
  const handleChipClick = (event, item) => {
    /*
      Set focus on respective field
    */
    //find index ref
    let i = -1;
    if(fieldRefs.current.length > 0) {
      i = fieldRefs.current.findIndex(itemHasKey, {key: item.key}); 
    }
    if(i !== -1) {
      //set focus
      fieldRefs.current[i].inputRef.current.focus();
      
      //scroll
      //last item
      fieldRefs.current[i].textFieldRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  const handleChipDelete = (event, item) => {
    console.log("@- chip delete: item: ", item);
  }

  const handleFieldChange = (event, value, key) => {
    /*
      Handle: valueOk state (reset)
    */
    //make new valueOk state object
    let o = {key: key, valueOk: 0};
    let i = -1;
    //find index
    if(valueOkStates.length > 0) {
      i = valueOkStates.findIndex(itemHasKey, {key:key});
    }
    //update state
    if(i !== -1) {
      let newValueOkStates = Array.from(valueOkStates);
      newValueOkStates[i] = o;
      setValueOkStates(newValueOkStates);
    }
  }

  const handleFieldFocus = (event, value, key) => {
    /*
      Handle: focus state
    */
    //make new focus state object
    let o = {key: key, focus: true};
    let i = -1;
    //find index
    if(itemFocusStates.length > 0) {
      i = itemFocusStates.findIndex(itemHasKey, {key:key});
    }
    //update state
    if(i !== -1) {
      let newItemFocusStates = Array.from(itemFocusStates);
      newItemFocusStates[i] = o;
      setItemFocusStates(newItemFocusStates);
      setAllowChipsSearch(false);
      
      //update ref
      //fieldHasFocus.current = true;
    }
  }

  const handleFieldBlur = (event, value, key) => {
    /*
      Handle: focus state
    */
    //make new focus state object
    let o = {key: key, focus: false};
    let i = -1;
    //find index
    if(itemFocusStates.length > 0) {
      i = itemFocusStates.findIndex(itemHasKey, {key:key});
    }
    //update state
    if(i !== -1) {
      let newItemFocusStates = Array.from(itemFocusStates);
      newItemFocusStates[i] = o;
      setItemFocusStates(newItemFocusStates);
      setAllowChipsSearch(true);
      
      //update ref
      //fieldHasFocus.current = false;
    }

    /*
      Handle: valueOk state
    */
    //make new valueOk state object
    o = {key: key, valueOk: getAcceptableStatus(key, value)};
    i = -1;
    //find index
    if(valueOkStates.length > 0) {
      i = valueOkStates.findIndex(itemHasKey, {key:key});
    }
    //update state
    if(i !== -1) {
      let newValueOkStates = Array.from(valueOkStates);
      newValueOkStates[i] = o;
      setValueOkStates(newValueOkStates);
    }
  }

  const handleFieldReady = (key, textFieldRef, inputRef) => {
    /*
      Update refs array
    */
    //make new ref object
    let o = {key: key, textFieldRef: textFieldRef, inputRef: inputRef};
    //find index ref
    let i = -1;
    if(fieldRefs.current.length > 0) {
      i = fieldRefs.current.findIndex(itemHasKey, {key: key}); 
    }
    //if ref already exists
    if(i !== -1) {
      //update ref
      fieldRefs.current[i] = o;
    } else {
      //push new ref
      fieldRefs.current.push(o);
    }
  }

  const handleFieldsKeyDown = (event, value, key) => {
    
    console.log("EVENT: bubbles: ", event.bubbles);

    /*
      Enter
    */
    if(event.key === 'Enter') {
        handleOkState(value, key);
    }
  }

  const handleOkState = (value, key) => {
    //make new valueOk state object
    let o = {key: key, valueOk: getAcceptableStatus(key, value)};
    let i = -1;
    //find index
    if(valueOkStates.length > 0) {
      i = valueOkStates.findIndex(itemHasKey, {key:key});
    }
    //update state
    if(i !== -1) {
      let newValueOkStates = Array.from(valueOkStates);
      newValueOkStates[i] = o;
      setValueOkStates(newValueOkStates);
    }
  }

  /*
    Render
  */
  return (
    <div>
      <Grid
        className={classes.root} 
        container justify='center' 
        alignItems='flex-start'
        spacing={2}
      >
        <Grid item xs={3}>
          <ChipsView
            items={items}
            itemFocusStates={itemFocusStates}
            valueOkStates={valueOkStates}
            deletable={false}
            allowSearch={allowChipsSearch}
            handleClick={handleChipClick}
            handleDelete={handleChipDelete}
          />
        </Grid>
        <Grid item xs={6}>
          <AttributesFormView
            items={items}
            itemFocusStates={itemFocusStates}
            handleFocus={handleFieldFocus}
            handleBlur={handleFieldBlur}
            handleFieldReady={handleFieldReady}
            handleChange = {handleFieldChange}
            handleKeyDown = {handleFieldsKeyDown}
          />
        </Grid>
      </Grid>
    </div>
  );
}

/*
  PropTypes
*/
AttributesPage.propTypes = {
  items: PropTypes.array.isRequired,
};