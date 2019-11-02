import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
  textField: {
    margin: 'auto',
    width: '100%',
    maxWidth: 600,
    minWidth: 200,
  },
}));

export default function StringField(props) {
  /*
    Properties
  */
  const classes = useStyles();
  const {
    itemKey,
    label,
    text,
    handleChange,
    handleFocus,
    handleBlur,
    handleReady,
  } = props;
  
  /*
    State
  */
  const [value, setValue] = React.useState('');

  /*
    Refs
  */
  const inputRef = useRef(null);

  /*
    Hooks
  */
  useEffect(() => {
    console.log("!!- init ftxt: ", label, " txt: ", text);

    if(text !== undefined && text !== null && text !== '') {
      //update state
      setValue(text);
    }

    //run callback
    if(handleReady !== undefined) {
      handleReady(itemKey, inputRef);
    }

  }, []);

  return (
        <TextField
          id={"string-field-"+itemKey+'-'+label}
          label={label}
          inputRef={inputRef}
          multiline
          rowsMax="4"
          value={value}
          className={classes.textField}
          margin="normal"
          variant="standard"
          onChange={(event) => {
            //update state
            setValue(event.target.value);

            //run callback
            if(handleChange !== undefined) {
              handleChange(event, event.target.value, itemKey);
            }
          }}
          onFocus={(event) => {
            //run callback
            if(handleFocus !== undefined) {
              handleFocus(event, event.target.value, itemKey);
            }
          }}
          onBlur={(event) => {
            //run callback
            if(handleBlur !== undefined) {
              handleBlur(event, event.target.value, itemKey);
            }
          }}
        />
  );
}