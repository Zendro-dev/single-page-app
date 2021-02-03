/**
 * Use Cases:
 * - component receives value => string | null
 * - user types in the input => string (maybe empty)
 * - user clicks on the reset button => null
 *
 * Notes: useRef might not be needed here, as long as value={value ?? ''} does
 * not trigger an onChange event.
 */

import React, { ReactElement, useRef } from 'react';
import {
  createStyles,
  makeStyles,
  TextField,
  TextFieldProps,
  Theme,
} from '@material-ui/core';

import { SvgIconType } from '../../types/user-interface';

export type StringFieldProps = Omit<TextFieldProps, 'onChange'> & {
  icon?: SvgIconType;
  onChange?: (value: string | null) => void;
  value: string | null;
};

export default function StringField({
  icon: Icon,
  value,
  ...textFieldProps
}: StringFieldProps): ReactElement {
  const classes = useStyles();
  const computedValue = useRef(value);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    computedValue.current = event.target.value;
    if (textFieldProps.onChange) textFieldProps.onChange(computedValue.current);
  };

  return (
    <div className={classes.root}>
      {Icon && <Icon className={classes.leftIcon} />}
      <TextField
        {...textFieldProps}
        value={value ?? ''}
        fullWidth
        margin="normal"
        variant="outlined"
        onChange={handleOnChange}
      />
    </div>
  );
}

const useStyles = makeStyles((theme: Theme) =>
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
