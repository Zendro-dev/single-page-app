import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
  },
}));

export default function IntField(props) {
  /*
    Properties
  */
  const classes = useStyles();
  const { 
    label,
    text,
    handleChange,
  } = props;
  
  /*
    State
  */
  const [value, setValue] = React.useState('');

  /*
    Hooks
  */
  useEffect(() => {
    if(text !== undefined && text !== null && text !== '') {
      //update state
      setValue(text);
    }
  }, []);

  return (
        <TextField
          id="int-field"
          label={label}
          type="number"
          // multiline
          // rowsMax="4"
          value={value}
          className={classes.textField}
          margin="normal"
          variant="standard"
          onChange={(event) => {
            //update state
            setValue(event.target.value);

            //run callback
            if(handleChange !== undefined) {
              handleChange(event, event.target.value);
            }
          }}
        />
  );
}