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
      marginTop: '1.75rem',
      marginRight: '0.5rem',
      color: theme.palette.grey[700],
    },
  })
);

export default function FloatField({ icon: Icon, value, ...props }) {
  const classes = useStyles();
  const floatValue = useRef(value ?? null);

  const handleOnChange = (event) => {
    floatValue.current = parseFloat(event.target.value);

    if (!isNaN(floatValue.current) && props.onChange) {
      props.onChange(props.label, floatValue.current);
    }
  };

  return (
    <div className={classes.root}>
      {Icon && <Icon className={classes.leftIcon} />}
      <TextField
        {...props}
        value={value !== undefined && value !== null ? value.toString() : ''}
        type={'number'}
        margin={'normal'}
        variant={'outlined'}
        onChange={handleOnChange}
      />
    </div>
  );
}
