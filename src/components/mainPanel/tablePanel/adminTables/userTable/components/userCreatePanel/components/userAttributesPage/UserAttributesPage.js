import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import UserAttributesFormView from './userAttributesFormView/UserAttributesFormView'
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
    valueOkStates,
    hidden,
    handleFieldChange,
    handleOkStateUpdate,
  } = props;
  
  const fieldRefs = useRef([]);

  function itemHasKey(item, index) {
    if(item !== undefined) {
      return item.key === this.key;
    } else {
      return false;
    }
  }

  const handleFieldBlur = (event, name, value, key) => {
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
  valueOkStates: PropTypes.array.isRequired,
  hidden: PropTypes.bool.isRequired,
  handleFieldChange: PropTypes.func.isRequired,
  handleOkStateUpdate: PropTypes.func.isRequired
};