import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import React, { useState } from 'react';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'start',
    },
    leftIcon: {
      width: '2rem',
      height: '2rem',
      marginTop: '1.75rem',
      marginRight: '0.5rem',
      color: theme.palette.grey[700],
    },
    checkbox: {
      padding: '1rem',
    },
    checkboxError: {
      padding: '1rem',
      color: 'red',
    },
    formControlLabel: {
      margin: '0rem',
    },
    formControlLabelError: {
      margin: '0rem',
      color: 'red',
    },
    errMsg: {
      marginLeft: '0.8rem',
      color: 'red',
      fontSize: 13,
      fontFamily: 'sans-serif',
    },
  })
);

export default function BoolField({
  icon: Icon,
  value,
  error,
  helperText,
  ...props
}) {
  const classes = useStyles();

  const [checked, setChecked] = useState(value || false);
  const [indeterminate, setIndeterminate] = useState(
    value !== undefined && value !== null ? false : true
  );

  const handleOnChange = (event) => {
    if (event.target.checked && !indeterminate) {
      setChecked(true);
      if (props.onChange) {
        props.onChange(props.label, true);
      }
    } else if (!event.target.checked && !indeterminate) {
      setChecked(false);
      setIndeterminate(true);
      if (props.onChange) {
        props.onChange(props.label, null);
      }
    } else if (event.target.checked && indeterminate) {
      setChecked(false);
      setIndeterminate(false);
      if (props.onChange) {
        props.onChange(props.label, false);
      }
    }
  };

  return (
    <div className={classes.root}>
      {Icon && <Icon className={classes.leftIcon} />}
      <FormControlLabel
        className={
          error ? classes.formControlLabelError : classes.formControlLabel
        }
        control={
          <Checkbox
            {...props}
            className={error ? classes.checkboxError : classes.checkbox}
            color="default"
            checked={checked}
            indeterminate={indeterminate}
            onChange={handleOnChange}
          />
        }
        label={props.label}
        labelPlacement="top"
      />
      {error && <div className={classes.errMsg}>{helperText}</div>}
    </div>
  );
}
