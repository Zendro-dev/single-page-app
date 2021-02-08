import React, { ReactElement } from 'react';
import {
  createStyles,
  makeStyles,
  TextField,
  TextFieldProps,
  Theme,
} from '@material-ui/core';

import { SvgIconType } from '../../types/user-interface';

export type StringFieldProps = TextFieldProps & {
  icon?: SvgIconType;
};

export default function StringField({
  icon: Icon,
  ...textFieldProps
}: StringFieldProps & TextFieldProps): ReactElement {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {Icon && <Icon className={classes.leftIcon} />}
      <TextField
        {...textFieldProps}
        fullWidth
        margin="normal"
        variant="outlined"
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
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
  })
);
