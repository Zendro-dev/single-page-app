import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ChipsView from '../../views/chipsView/ChipsView';
import AttributesFormView from '../../views/attributesFormView/AttributesFormView'

/*
  Material-UI components
*/
import Grid from '@material-ui/core/Grid';

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

  /*
    Refs
  */
  const fieldRefs = useRef([]);

  /*
    Hooks
  */

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
        0: unknown/not tested yet (this is set on initial render)
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
      fieldRefs.current[i].ref.current.focus();
    }

  }

  const handleChipDelete = (event, item) => {
    console.log("@- chip delete: item: ", item);
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

  const handleFieldReady = (key, ref) => {
    /*
      Update refs array
    */
    //make new ref object
    let o = {key: key, ref: ref};
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

  /*
    Render
  */
  return (
    <Grid className={classes.root} container justify='center' alignItems='flex-start'>
      <Grid item xs={3}>
        <ChipsView
          items={items}
          itemFocusStates={itemFocusStates}
          valueOkStates={valueOkStates}
          deletable={false}
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
        />
      </Grid>
    </Grid>
  );
}

/*
  PropTypes
*/
AttributesPage.propTypes = {
  items: PropTypes.array.isRequired,
};