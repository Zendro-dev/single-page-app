import React, { useRef } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
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
  })
);

export default function IntField({
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  value,
  ...props
}) {
  const classes = useStyles();
  const intValue = useRef(value ?? null);

  const handleOnChange = (event) => {
    intValue.current = Math.round(parseFloat(event.target.value));

    if (!isNaN(intValue.current) && props.onChange) {
      props.onChange(intValue.current);
    }
  };

  return (
    <div className={classes.root}>
      {LeftIcon && <LeftIcon className={classes.leftIcon} />}
      <TextField
        {...props}
        value={value !== undefined && value !== null ? value.toString() : ''}
        type="number"
        margin="normal"
        variant={'outlined'}
        onChange={handleOnChange}
      />
      {RightIcon && <RightIcon className={classes.rightIcon} />}
    </div>
  );
}
