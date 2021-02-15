import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import React, { useState } from 'react';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: '5rem',
    },
    leftIcon: {
      width: '2rem',
      height: '2rem',
      marginTop: '1.75rem',
      marginRight: '0.5rem',
      color: theme.palette.grey[700],
    },
    rightIcon: {
      marginLeft: '0rem',
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
      marginTop: '4.5rem',
      marginLeft: '-3rem',
      color: 'red',
      fontSize: 13,
      fontFamily: 'sans-serif',
    },
    errMsgReadOnly: {
      marginTop: '4.5rem',
      marginLeft: '-9rem',
      color: 'red',
      fontSize: 13,
      fontFamily: 'sans-serif',
    },
  })
);

export default function BoolField({
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  value,
  error,
  helperText,
  InputProps,
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
        props.onChange(true);
      }
    } else if (!event.target.checked && !indeterminate) {
      setChecked(false);
      setIndeterminate(true);
      if (props.onChange) {
        props.onChange(null);
      }
    } else if (event.target.checked && indeterminate) {
      setChecked(false);
      setIndeterminate(false);
      if (props.onChange) {
        props.onChange(false);
      }
    }
  };

  return (
    <div className={classes.root}>
      {LeftIcon && <LeftIcon className={classes.leftIcon} />}
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
            disabled={InputProps.readOnly ? true : false}
          />
        }
        label={props.label}
        labelPlacement="top"
      />
      {RightIcon && <RightIcon className={classes.rightIcon} />}
      {error && (
        <div
          className={
            InputProps.readOnly ? classes.errMsgReadOnly : classes.errMsg
          }
        >
          {helperText}
        </div>
      )}
    </div>
  );
}
