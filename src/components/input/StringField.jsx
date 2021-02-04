/**
 * Use Cases:
 * - component receives value => string | null
 * - user types in the input => string (maybe empty)
 * - user clicks on the reset button => null
 *
 * Notes: useRef might not be needed here, as long as value={value ?? ''} does
 * not trigger an onChange event.
 */

import React, { useRef } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'start',
    },
    leftIcon: {
      width: '2rem',
      height: '2rem',
      marginTop: theme.spacing(7),
      marginRight: theme.spacing(2),
      color: theme.palette.grey[700],
    },
  })
);

export default function StringField({ icon: Icon, value, ...props }) {
  const computedValue = useRef(value);

  const classes = useStyles();
  const handleOnChange = (event) => {
    computedValue.current = event.target.value;

    if (props.onChange) {
      props.onChange(props.label, computedValue.current);
    }
  };

  return (
    <div className={classes.root}>
      {Icon && <Icon className={classes.leftIcon} />}
      <TextField
        {...props}
        fullWidth
        margin="normal"
        variant="outlined"
        value={value ?? ''}
        onChange={handleOnChange}
      />
    </div>
  );
}
