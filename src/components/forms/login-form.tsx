import React, { ReactElement, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { Button, Typography } from '@material-ui/core';

import EmailField from '../input/login-field';
import PasswordField from '../input/password-field';

import {
  AccountCircleOutlined as AccountCircleIcon,
  LockOutlined as LockIcon,
} from '@material-ui/icons';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
}

interface LoginFormState {
  email: string;
  password: string;
}

export default function LoginForm({ onSubmit }: LoginFormProps): ReactElement {
  const classes = useStyles();
  const [state, setState] = useState<LoginFormState>({
    email: '',
    password: '',
  });

  const onFieldChange = (prop: keyof LoginFormState) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState({ ...state, [prop]: event.target.value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (onSubmit) onSubmit(state.email, state.password);
  };

  return (
    <form onSubmit={handleSubmit} noValidate autoComplete="off">
      <EmailField
        autoComplete="email"
        icon={AccountCircleIcon}
        label="Email"
        onChange={onFieldChange('email')}
        type="email"
        value={state?.email}
      />

      <PasswordField
        icon={LockIcon}
        label="Password"
        onChange={onFieldChange('password')}
        value={state?.password}
      />

      <div className={classes.buttonContainer}>
        <Button
          className={classes.button}
          size="medium"
          variant="contained"
          color="primary"
          type="submit"
        >
          <Typography className={classes.buttonText}>Login</Typography>
        </Button>
      </div>
    </form>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: theme.spacing(6),
    },
    button: {
      padding: theme.spacing(2, 0),
      width: theme.spacing(32),
    },
    buttonText: {
      fontWeight: theme.typography.fontWeightMedium,
      fontSize: theme.spacing(5),
    },
  })
);
