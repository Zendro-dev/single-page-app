import React, { PropsWithChildren, ReactElement, ReactNode } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  BubbleChart as ModelsIcon,
  Home as HomeIcon,
  PowerSettingsNew as LoginIcon,
} from '@material-ui/icons';

import { SiteLink } from '@/components/links';
import { LanguageSwitcher, LoginButton } from '@/components/toolbar';
import { ClientOnly } from '@/components/wrappers';
import { useAuth } from '@/hooks';

export interface AppLayoutProps {
  brand?: string;
  action?: ReactNode;
}

export default function ModelsLayout({
  brand,
  ...props
}: PropsWithChildren<AppLayoutProps>): ReactElement {
  const classes = useStyles();
  const { auth } = useAuth();

  return (
    <div className={classes.root}>
      <header className={classes.header}>
        {/* NAVIGATION LINKS */}
        <div className={classes.navLinks}>
          {props.action}

          <SiteLink href="/" className={classes.navlink}>
            <HomeIcon />
            <span>{brand ?? 'Zendro'}</span>
          </SiteLink>

          <ClientOnly>
            {auth.user && (
              <SiteLink href="/models" className={classes.navlink}>
                <ModelsIcon />
                <span>Models</span>
              </SiteLink>
            )}
          </ClientOnly>
        </div>

        {/* ACTION BUTTONS */}
        <div className={classes.actionButtons}>
          <LanguageSwitcher color="inherit" size="small" />
          <ClientOnly>
            <LoginButton
              className={
                auth.status === 'success' ? 'login-normal' : 'login-warning'
              }
              color="inherit"
              size="small"
            >
              <LoginIcon />
            </LoginButton>
          </ClientOnly>
        </div>
      </header>

      {props.children}
    </div>
  );
}

const useStyles = makeStyles((theme) => {
  return createStyles({
    root: {
      height: '100%',
      overflowX: 'hidden',
    },
    header: {
      // Layout
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',

      // Size
      width: '100%',
      height: theme.spacing(18),
      padding: theme.spacing(4, 2),
      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4, 4),
      },

      // Colors
      color: theme.palette.getContrastText(theme.palette.primary.main),
      backgroundColor: theme.palette.primary.main,
      boxShadow: theme.shadows[3],
    },
    actionButtons: {
      display: 'flex',
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
      [theme.breakpoints.up('sm')]: {
        flexGrow: 0,
        width: theme.spacing(30),
      },
      '& button.login-normal': {
        backgroundColor: theme.palette.success.background,
        color: theme.palette.success.main,
      },
      '& button.login-normal:hover': {
        backgroundColor: theme.palette.secondary.background,
        color: theme.palette.secondary.main,
      },
      '& button.login-warning': {
        backgroundColor: theme.palette.secondary.background,
        color: theme.palette.secondary.main,
      },
      '& button.login-warning:hover': {
        backgroundColor: theme.palette.primary.background,
        color: theme.palette.primary.main,
      },
    },
    loginButtonWarning: {
      backgroundColor: theme.palette.secondary.background,
      color: theme.palette.secondary.main,
    },
    navLinks: {
      display: 'flex',
      flexGrow: 1,
      justifyContent: 'space-around',
      alignItems: 'center',
      [theme.breakpoints.up('sm')]: {
        flexGrow: 0,
        width: theme.spacing(80),
        justifyContent: 'flex-start',
      },
    },
    navlink: {
      display: 'flex',
      alignItems: 'center',
      color: theme.palette.getContrastText(theme.palette.primary.main),
      '&:not(:first-child)': {
        marginLeft: theme.spacing(6),
        [theme.breakpoints.down('sm')]: {
          marginLeft: theme.spacing(3),
        },
      },
      '&:hover': {
        color: theme.palette.primary.light,
        textDecoration: 'none',
      },
      '& span': {
        marginLeft: theme.spacing(2),
        ...theme.typography.h6,
        [theme.breakpoints.down('sm')]: {
          display: 'none',
        },
      },
      '& svg': {
        [theme.breakpoints.down('sm')]: {
          fontSize: theme.spacing(6),
          [theme.breakpoints.down('sm')]: {
            fontSize: theme.spacing(6),
          },
        },
      },
    },
  });
});
