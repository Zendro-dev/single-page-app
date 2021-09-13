import React, { ReactElement } from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import { SvgIconType } from '@/types/elements';

export type LoginFieldProps = TextFieldProps & {
  icon?: SvgIconType;
};

export default function LoginField({
  icon: Icon,
  ...textFieldProps
}: LoginFieldProps & TextFieldProps): ReactElement {
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
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
  })
);
