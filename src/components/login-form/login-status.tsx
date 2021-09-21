import clsx from 'clsx';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  BoxProps,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  CheckCircleOutline as SuccessIcon,
  ErrorOutline as ErrorIcon,
  WarningAmber as WarningIcon,
} from '@mui/icons-material';
import { Theme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';

import useAuth from '@/hooks/useAuth';

export default function LoginStatus(props: BoxProps): ReactElement {
  const auth = useAuth();
  const classes = useStyles();
  const { t } = useTranslation();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      className={clsx(classes.card, {
        [classes.cardError]: auth.status === 'failed',
        [classes.cardSuccess]: auth.status === 'success',
        [classes.cardWarning]: auth.status === 'expired',
        [classes.cardLoading]: auth.status === 'loading',
      })}
      {...props}
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
      ) : auth.status === 'expired' ? (
        <>
          <WarningIcon />
          <h1>{t('login-dialog.login-expired')}</h1>
        </>
      ) : (
        <>
          <CircularProgress size={mobile ? 20 : 22} />
          <h1>{t('login-dialog.login-loading')}</h1>
        </>
      )}
    </Box>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
      '& > svg': {
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
    cardLoading: {
      backgroundColor: theme.palette.primary.background,
      borderColor: theme.palette.primary.main,
      '& h1': {
        color: theme.palette.primary.dark,
      },
      '& svg': {
        color: theme.palette.primary.main,
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
