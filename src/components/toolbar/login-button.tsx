import React, { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
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
import {
  CheckCircleOutline as SuccessIcon,
  Close as CloseIcon,
  ErrorOutline as ErrorIcon,
  WarningAmber as WarningIcon,
} from '@material-ui/icons';
import { IconButton, IconButtonProps } from '@/components/buttons';
import LoginForm from '@/components/forms/login-form';
import useAuth from '@/hooks/useAuth';
import clsx from 'clsx';

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
      if (auth.status === 'success') {
        setTimeout(() => {
          setIsFormOpen(false);
          if (onLogin) onLogin();
        }, 700);
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

          {auth.status !== 'idle' && auth.status !== 'loading' && (
            <Box
              className={clsx(classes.card, {
                [classes.cardError]: auth.status === 'failed',
                [classes.cardSuccess]: auth.status === 'success',
                [classes.cardWarning]: auth.status === 'expired',
              })}
            >
              {auth.status === 'failed' ? (
                <>
                  <ErrorIcon />
                  <h1 data-cy="login-dialog-login-failed">
                    {t('login-dialog.login-failed')}
                  </h1>
                </>
              ) : auth.status === 'success' ? (
                <>
                  <SuccessIcon />
                  <h1>{t('login-dialog.login-successful')}</h1>
                </>
              ) : (
                <>
                  <WarningIcon />
                  <h1>{t('login-dialog.login-expired')}</h1>
                </>
              )}
            </Box>
          )}

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
    card: {
      // Layout
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',

      // Spacing
      margin: theme.spacing(6, 0, 4, 0),
      padding: theme.spacing(3),

      // Background & border styles
      border: '2px solid',
      borderRadius: 10,

      // Heading
      '& h1': {
        padding: 0,
        margin: theme.spacing(0, 0, 0, 2),
        fontSize: theme.spacing(4),
        textAlign: 'center',
        [theme.breakpoints.up('sm')]: {
          fontSize: theme.spacing(5),
        },
      },

      // Icon
      '& svg': {
        width: theme.spacing(6),
        height: theme.spacing(6),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(7),
          height: theme.spacing(7),
        },
      },
    },
    cardError: {
      backgroundColor: theme.palette.error.background,
      borderColor: theme.palette.error.main,
      '& h1': {
        color: theme.palette.error.dark,
      },
      '& svg': {
        color: theme.palette.error.main,
      },
    },
    cardSuccess: {
      backgroundColor: theme.palette.success.background,
      borderColor: theme.palette.success.main,
      '& h1': {
        color: theme.palette.success.dark,
      },
      '& svg': {
        color: theme.palette.success.main,
      },
    },
    cardWarning: {
      backgroundColor: theme.palette.warning.background,
      borderColor: theme.palette.warning.main,
      '& h1': {
        color: theme.palette.warning.dark,
      },
      '& svg': {
        color: theme.palette.warning.main,
      },
    },
  })
);
