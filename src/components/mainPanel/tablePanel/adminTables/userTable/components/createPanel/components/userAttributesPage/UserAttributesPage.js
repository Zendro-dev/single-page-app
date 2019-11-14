import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import UserAttributesFormView from './attributesFormView/UserAttributesFormView'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
  },
}));

export default function UserAttributesPage(props) {
  const classes = useStyles();
  const {
    item,
    valueOkStates,
    hidden,
    handleFieldChange,
    handleOkStateUpdate,
  } = props;
  
  const [itemFocusStates, setItemFocusStates] = useState(getInitialFocusStates());
  const fieldRefs = useRef([]);

  useEffect(() => {
    setFocusOnIndex(0);
  }, []);

  function getInitialFocusStates() {
    let keys = Object.keys(item);
    let a = [];
    for(var i=0; i<keys; ++i) {
      if(keys[i] !== 'id') {
        a.push({key: keys[i], focus:false});
      }
    }
    return a;
  }

  function itemHasKey(item, index) {
    if(item !== undefined) {
      return item.key === this.key;
    } else {
      return false;
    }
  }

  function setFocusOnIndex(index) {
    let i = -1;
    if(fieldRefs.current.length > 0 && itemFocusStates.length > 0) {
      i = fieldRefs.current.findIndex(itemHasKey, {key: itemFocusStates[index].key}); 
    }
    if(i !== -1) {
      fieldRefs.current[i].inputRef.current.focus();
      fieldRefs.current[i].textFieldRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const handleFieldFocus = (event, value, key) => {
    let o = {key: key, focus: true};
    let i = -1;
    if(itemFocusStates.length > 0) {
      i = itemFocusStates.findIndex(itemHasKey, {key:key});
    }
    if(i !== -1) {
      let newItemFocusStates = Array.from(itemFocusStates);
      newItemFocusStates[i] = o;
      setItemFocusStates(newItemFocusStates);
    }
  };

  const handleFieldBlur = (event, name, value, key) => {
    let o = {key: key, focus: false};
    let i = -1;
    if(itemFocusStates.length > 0) {
      i = itemFocusStates.findIndex(itemHasKey, {key:key});
    }
    if(i !== -1) {
      let newItemFocusStates = Array.from(itemFocusStates);
      newItemFocusStates[i] = o;
      setItemFocusStates(newItemFocusStates);
    }
    handleOkStateUpdate(name, value, key);
  };

  const handleFieldReady = (key, textFieldRef, inputRef) => {
    let o = {key: key, textFieldRef: textFieldRef, inputRef: inputRef};
    let i = -1;
    if(fieldRefs.current.length > 0) {
      i = fieldRefs.current.findIndex(itemHasKey, {key: key}); 
    }
    if(i !== -1) {
      fieldRefs.current[i] = o;
    } else {
      fieldRefs.current.push(o);
    }
  };

  const handleFieldsKeyDown = (event, name, value, key) => {
    if(event.key === 'Enter') {
        handleOkStateUpdate(name, value, key);
    }
  };

  return (
    <div hidden={hidden}>
      <Fade in={!hidden} timeout={500}>
        <Grid
          className={classes.root} 
          container justify='center' 
          alignItems='flex-start'
          spacing={0}
        > 
          {/* Attributes Form View */}
          <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
            <UserAttributesFormView
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
UserAttributesPage.propTypes = {
  item: PropTypes.object.isRequired,
  valueOkStates: PropTypes.array.isRequired,
  hidden: PropTypes.bool.isRequired,
  handleFieldChange: PropTypes.function.isRequired,
  handleOkStateUpdate: PropTypes.function.isRequired
};