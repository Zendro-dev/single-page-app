import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { PropsWithChildren, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  InfoOutlined as InfoIcon,
  WarningAmber as WarningIcon,
} from '@material-ui/icons';
import { useAuth, useModel } from '@/hooks';
import { RecordUrlQuery } from '@/types/routes';

interface RestrictedProps {
  info?: Record<string, string | undefined>;
  redirect?: {
    to: string;
    timer: number;
  };
}

export default function Restricted(
  props: PropsWithChildren<RestrictedProps>
): ReactElement {
  const auth = useAuth();
  const router = useRouter();
  const urlQuery = router.query as Partial<RecordUrlQuery>;
  const getModel = useModel();
  const classes = useStyles();
  const { t } = useTranslation();

  const isNotLoggedIn = auth.user === undefined;
  const isNotAllowed =
    urlQuery.model && !getModel(urlQuery.model).permissions.read;

  const handleTerminateSession = (): void => {
    router.push('/');
    auth.logout();
  };

  if (isNotLoggedIn || isNotAllowed) {
    return (
      <Box
        display="flex"
        width="100%"
        height="100%"
        flexDirection="column"
        alignItems="center"
        padding={4}
      >
        <Box className={clsx(classes.card, classes.cardInfo)}>
          <InfoIcon />
          <Box>
            {isNotLoggedIn && (
              <>
                <h1>{t('restricted.not-logged-header')}</h1>
                <p>{t('restricted.not-logged-info')}</p>
              </>
            )}
            {!isNotLoggedIn && isNotAllowed && (
              <>
                <h1>{t('restricted.not-allowed-header')}</h1>
                <p>{t('restricted.not-allowed-info')}</p>
              </>
            )}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <>
      {auth.status === 'expired' && (
        <Box className={clsx(classes.card, classes.cardWarning)}>
          <WarningIcon />
          <Box className={classes.cardContent}>
            <h1>{t('restricted.token-exp-header')}</h1>
            <p>{t('restricted.token-exp-info')}</p>
            <Button size="small" onClick={handleTerminateSession}>
              {t('toolbar.logout')}
            </Button>
          </Box>
        </Box>
      )}
      {props.children}
    </>
  );
}

const useStyles = makeStyles((theme) =>
  createStyles({
    card: {
      // Layout
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',

      // Layout : larger viewport
      [theme.breakpoints.up('sm')]: {
        flexDirection: 'row',
        alignItems: 'unset',
      },

      // Spacing
      padding: theme.spacing(6),

      // Background & border styles
      border: '2px solid',
      borderRadius: 10,

      // Content container
      '& > div': {
        margin: theme.spacing(4, 0, 0, 0),
        [theme.breakpoints.up('sm')]: {
          margin: theme.spacing(0, 0, 0, 4),
        },
      },

      // Heading
      '& h1': {
        padding: 0,
        margin: 0,
        fontSize: theme.spacing(5),
        textAlign: 'center',
        [theme.breakpoints.up('sm')]: {
          textAlign: 'revert',
        },
      },

      // Message
      '& p': {
        margin: theme.spacing(2, 0, 0, 0),
        textAlign: 'center',
        [theme.breakpoints.up('sm')]: {
          textAlign: 'revert',
        },
      },

      // Icon
      '& svg': {
        width: theme.spacing(10),
        height: theme.spacing(10),
        [theme.breakpoints.up('sm')]: {
          margin: theme.spacing(0, 0, 0, 0),
          width: theme.spacing(8),
          height: theme.spacing(8),
        },
      },
    },
    cardContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      [theme.breakpoints.up('sm')]: {
        alignItems: 'start',
      },
    },
    cardInfo: {
      backgroundColor: theme.palette.primary.background,
      borderColor: theme.palette.primary.main,

      // Heading
      '& h1': {
        color: theme.palette.primary.dark,
      },

      // Message
      '& p': {
        color: theme.palette.primary.main,
      },

      // Icon
      '& svg': {
        color: theme.palette.primary.main,
      },
    },
    cardWarning: {
      backgroundColor: theme.palette.warning.background,
      borderColor: theme.palette.warning.main,
      borderRadius: 0,

      // Heading
      '& h1': {
        color: theme.palette.warning.dark,
      },

      // Message
      '& p': {
        color: theme.palette.warning.main,
      },

      // Icon
      '& svg': {
        color: theme.palette.warning.main,
      },

      // Logout button
      '& button': {
        marginTop: theme.spacing(4),

        fontWeight: 'bold',

        border: '1px solid',
        borderColor: theme.palette.warning.main,
        color: theme.palette.warning.dark,
      },
    },
  })
);
