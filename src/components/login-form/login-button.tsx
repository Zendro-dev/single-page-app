import React, { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Theme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';

import IconButton, { IconButtonProps } from '@/components/icon-button';
import useAuth from '@/hooks/useAuth';
import LoginForm from './login-form';
import LoginStatus from './login-status';

interface LogoutButtonProps extends IconButtonProps {
  onLogin?: () => void;
  onLogout?: () => void;
}

export default function LoginButton({
  onLogin,
  onLogout,
  ...props
}: LogoutButtonProps): ReactElement {
  const auth = useAuth();
  const classes = useStyles();
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [isFormOpen, setIsFormOpen] = React.useState(false);

  useEffect(
    function closeFormAndRedirect() {
      if (auth.status === 'success' && isFormOpen) {
        setTimeout(() => {
          setIsFormOpen(false);
          if (onLogin) onLogin();
        }, 700);
      }
    },
    [auth.status, isFormOpen, onLogin]
  );

  /* TOOLBAR EVENTS */

  const handleOnButtonClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (auth.user && auth.status === 'success') {
      auth.logout();
      if (onLogout) onLogout();
    } else {
      setIsFormOpen(true);
    }
  };

  /* FORM EVENTS */

  const handleOnCancel = (): void => {
    setIsFormOpen(false);
  };

  const handleOnLogin = (email: string, password: string): void => {
    if (email && password) auth.login(email, password);
  };

  return (
    <>
      <IconButton
        tooltip={t('toolbar.login')}
        onClick={handleOnButtonClick}
        {...props}
      >
        {props.children}
      </IconButton>
      <Dialog
        aria-labelledby="login-form-dialog"
        aria-describedby="login-form-dialog-description"
        className={classes.dialog}
        fullScreen={fullScreen}
        open={isFormOpen}
        onClose={handleOnCancel}
      >
        <DialogTitle id="login-form-dialog">
          <Typography component="span" variant="h6" fontWeight="bold">
            {t('login-dialog.title')}
          </Typography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleOnCancel}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="login-form-dialog-description">
            {t('login-dialog.content')}
          </DialogContentText>

          {auth.status !== 'idle' && <LoginStatus />}

          <LoginForm onSubmit={handleOnLogin} />
        </DialogContent>
      </Dialog>
    </>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialog: {
      '& .MuiDialog-paper': {
        padding: theme.spacing(2, 0, 4, 0),
      },
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
      '&:hover': {
        color: theme.palette.secondary.main,
      },
    },
  })
);
