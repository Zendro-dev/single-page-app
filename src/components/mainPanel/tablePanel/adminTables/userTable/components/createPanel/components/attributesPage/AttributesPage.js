import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import AttributesFormView from './attributesFormView/AttributesFormView'

/*
  Material-UI components
*/
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';

/*
  Styles
*/
const useStyles = makeStyles(theme => ({
  root1: {
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
  const {
    modelNames,
    items, 
    valueOkStates,
    hidden,
    handleFieldChange,
    handleOkStateUpdate,
  } = props;
  
  /*
    State
  */
  const [itemFocusStates, setItemFocusStates] = useState(items.map(function(item){ return {key: item.key, focus: false}}));
  
  /*
    Refs
  */
  const fieldRefs = useRef([]);
  const searchAllowed = useRef(true);

  /*
    Hooks
  */
  useEffect(() => {

    //set focus on first item
    setFocusOnIndex(0);

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

  function setFocusOnIndex(index) {
    //find index ref
    let i = -1;
    if(fieldRefs.current.length > 0 && items.length > 0) {
      i = fieldRefs.current.findIndex(itemHasKey, {key: items[index].key}); 
    }
    if(i !== -1) {
      //set focus
      fieldRefs.current[i].inputRef.current.focus();
      
      //scroll
      fieldRefs.current[i].textFieldRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
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
      
      //update ref
      searchAllowed.current = false;
    }
  }

  const handleFieldBlur = (event, name, value, key) => {
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
      
      //update ref
      searchAllowed.current = true;
    }

    //callback
    handleOkStateUpdate(name, value, key);
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

  const handleFieldsKeyDown = (event, name, value, key) => {
    /*
      Enter
    */
    if(event.key === 'Enter') {
        //callback
        handleOkStateUpdate(name, value, key);
    }
  }

  const onGetSearchAllowed = () => {
    if(searchAllowed !== undefined) {
      return searchAllowed.current;
    } else {
      return false;
    }
  }

  /*
    Render
  */
  return (
    <div hidden={hidden}>
      <Fade in={!hidden} timeout={500}>
        <Grid
          className={classes.root1} 
          container justify='center' 
          alignItems='flex-start'
          spacing={0}
        > 

          {/* Attributes Form View */}
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <AttributesFormView
              modelNames={modelNames}
              items={items}
              valueOkStates={valueOkStates}
              handleFocus={handleFieldFocus}
              handleBlur={handleFieldBlur}
              handleFieldReady={handleFieldReady}
              handleChange={handleFieldChange}
              handleKeyDown={handleFieldsKeyDown}
            />
          </Grid>
        </Grid>
      </Fade>
    </div>
  );
}

/*
  PropTypes
*/
AttributesPage.propTypes = {
  items: PropTypes.array.isRequired,
};