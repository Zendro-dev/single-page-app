import React, { ReactElement, useState } from 'react';

import { Theme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import { Button } from '@mui/material';

import EmailField from './login-field';
import PasswordField from './password-field';

import {
  AccountCircleOutlined as AccountCircleIcon,
  LockOutlined as LockIcon,
} from '@mui/icons-material';

import { useTranslation } from 'react-i18next';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  onCancel?: () => void;
}

interface LoginFormState {
  email: string;
  password: string;
}

export default function LoginForm(props: LoginFormProps): ReactElement {
  const classes = useStyles();
  const { t } = useTranslation();

  const [state, setState] = useState<LoginFormState>({
    email: '',
    password: '',
  });

  const onFieldChange =
    (prop: keyof LoginFormState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setState({ ...state, [prop]: event.target.value });
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    props.onSubmit(state.email, state.password);
  };

  const handleCancel = (event: React.FormEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    if (props.onCancel) props.onCancel();
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
        label={t('login-form.password')}
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
          {t('login-form.login')}
        </Button>
        {props.onCancel && (
          <Button
            className={classes.button}
            size="medium"
            variant="outlined"
            color="secondary"
            onClick={handleCancel}
          >
            {t('login-form.cancel')}
          </Button>
        )}
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
