import React, { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  createStyles,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import LoginForm from '@/components/forms/login-form';
import useAuth from '@/hooks/useAuth';
import { IconButton, IconButtonProps } from '../buttons';

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
    function renderFeedbackAndText() {
      if (auth.status === 'failed') console.log('Login failed');

      if (
        auth.status === 'failed' ||
        auth.status === 'idle' ||
        auth.status === 'expired'
      ) {
        // t('toolBar.logout')
      } else if (auth.status === 'success') {
        setIsFormOpen(false);
        if (onLogin) onLogin();
      }
    },
    [auth.status, onLogin]
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
      <IconButton {...props} onClick={handleOnButtonClick}>
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
          <LoginForm onSubmit={handleOnLogin} />
        </DialogContent>
      </Dialog>
    </>
  );
}

const useStyles = makeStyles((theme) =>
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
