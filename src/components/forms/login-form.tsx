import React, { ReactElement, useState } from 'react';
import { useRouter } from 'next/router';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

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
  const router = useRouter();
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

  const handleCancel = (event: React.FormEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    router.back();
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
        data-cy="login-form-email"
      />

      <PasswordField
        icon={LockIcon}
        label="Password"
        onChange={onFieldChange('password')}
        value={state?.password}
        data-cy="login-form-password"
      />

      <div className={classes.buttonContainer}>
        <Button
          className={classes.button}
          size="medium"
          variant="contained"
          color="primary"
          type="submit"
          data-cy="login-form-login"
        >
          Login
        </Button>
        <Button
          className={classes.button}
          size="medium"
          variant="outlined"
          color="secondary"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      marginTop: theme.spacing(6),
      [theme.breakpoints.up('sm')]: {
        flexDirection: 'row',
      },
    },
    button: {
      ...theme.typography.body1,
      padding: theme.spacing(2, 0),
      width: '100%',
      [theme.breakpoints.down('sm')]: {
        '&:nth-child(1)': {
          marginBottom: theme.spacing(2),
        },
      },
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(32),
      },
    },
  })
);
