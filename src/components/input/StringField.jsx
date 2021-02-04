import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

export default function StringField({ value, ...props }) {
  const { t } = useTranslation();
  const computedValue = useRef(value);
  const useStyles = makeStyles((theme) => ({
    textField: {
      margin: 'auto',
    },
  }));
  const classes = useStyles();
  const handleOnChange = (event) => {
    if (!props.readOnly) {
      computedValue.current = event.target.value;

      if (props.onChange) {
        props.onChange(props.label, computedValue.current);
      }
    }
  };

  return (
    <TextField
      {...props}
      fullWidth
      className={classes.textField}
      margin="normal"
      variant="outlined"
      value={value ? value : ''}
      onChange={handleOnChange}
    />
  );
}
