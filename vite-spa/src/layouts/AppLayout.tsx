// Ported from single-page-app/src/layouts/app/app-layout.tsx - the MUI
// component tree and makeStyles block are unmodified from the original;
// only the Next.js/next-auth-specific plumbing changed:
//   - next/image -> plain <img>
//   - next/head -> not needed (index.html sets the title/favicon directly)
//   - ClientOnly -> removed (was only for Next SSR hydration, this is a
//     pure client-rendered SPA already)
//   - useSession/signIn/signOut (next-auth) -> useAuth() (src/auth/AuthProvider.tsx)
//   - SiteLink/IconButton/LanguageSwitcher (bespoke wrapper components) ->
//     removed, out of scope for this one-page spike
import { type PropsWithChildren, type ReactElement } from 'react';
import type { Theme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import { Home as HomeIcon, Login as LoginIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import { useAuth } from '@/auth/AuthProvider';

export interface AppLayoutProps {
  brand?: string;
}

export default function AppLayout({
  brand = 'Zendro',
  ...props
}: PropsWithChildren<AppLayoutProps>): ReactElement {
  const classes = useStyles({});
  const { authenticated, login, logout } = useAuth();

  return (
    <div className={classes.root}>
      <header className={classes.header}>
        <div className={classes.navLinks}>
          <a href="/" className={classes.navlink}>
            <HomeIcon />
            <span>{brand}</span>
          </a>
        </div>

        <div className={classes.actionButtons}>
          {authenticated === true && (
            <IconButton size="small" className="login-warning" color="inherit" onClick={logout}>
              <LogoutIcon />
            </IconButton>
          )}
          {authenticated === false && (
            <IconButton size="small" className="login-normal" color="inherit" onClick={login}>
              <LoginIcon />
            </IconButton>
          )}
        </div>
      </header>

      {props.children}
    </div>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      minHeight: '100vh',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',

      width: '100%',
      height: theme.spacing(18),
      padding: theme.spacing(4, 2),
      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4, 4),
      },

      color: theme.palette.getContrastText(theme.palette.primary.main),
      backgroundColor: theme.palette.primary.main,
      boxShadow: theme.shadows[3],
    },
    actionButtons: {
      display: 'flex',
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
      '& button.login-normal': {
        backgroundColor: theme.palette.success.background,
        color: theme.palette.success.main,
      },
      '& button.login-normal:hover': {
        backgroundColor: theme.palette.success.light,
      },
      '& button.login-warning': {
        backgroundColor: theme.palette.secondary.background,
        color: theme.palette.secondary.main,
      },
      '& button.login-warning:hover': {
        backgroundColor: theme.palette.secondary.light,
      },
    },
    navLinks: {
      display: 'flex',
      flexGrow: 1,
      alignItems: 'center',
    },
    navlink: {
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      color: theme.palette.getContrastText(theme.palette.primary.main),
      '&:hover': {
        color: theme.palette.primary.light,
        textDecoration: 'none',
      },
      '& span': {
        marginLeft: theme.spacing(2),
        ...theme.typography.h6,
      },
    },
  })
);
