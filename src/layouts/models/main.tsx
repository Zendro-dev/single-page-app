import clsx from 'clsx';
import React, { PropsWithChildren, ReactElement } from 'react';

import { createStyles, makeStyles } from '@material-ui/core/styles';

import { AppRoutes } from '@/build/routes';
import useAuth from '@/hooks/useAuth';
import Restricted from './restricted';
import Navigation from './navigation';

export interface ModelsProps {
  routes: AppRoutes;
  showNav: boolean;
}

export default function Models({
  routes,
  showNav,
  ...props
}: PropsWithChildren<ModelsProps>): ReactElement {
  const { auth } = useAuth();
  const classes = useStyles();

  return (
    <div className={classes.mainContainer}>
      <Navigation
        className={clsx(classes.navDrawer, {
          [classes.navDrawerClosed]: !showNav,
        })}
        permissions={auth.user?.permissions}
        routes={routes}
      />
      <main
        className={clsx(classes.mainContent, {
          [classes.mainContentShift]: showNav,
        })}
      >
        <Restricted>{props.children}</Restricted>
      </main>
    </div>
  );
}

const useStyles = makeStyles((theme) => {
  return createStyles({
    mainContainer: {
      display: 'flex',
      height: `calc(100% - ${theme.spacing(18)})`,
    },
    navDrawer: {
      width: '100%',
      transition: theme.transitions.create(['width'], {
        duration: theme.transitions.duration.standard,
        easing: theme.transitions.easing.sharp,
      }),
      [theme.breakpoints.up('md')]: {
        width: theme.spacing(72),
      },
    },
    navDrawerClosed: {
      width: 0,
    },
    mainContent: {
      padding: theme.spacing(3),
      width: '100%',
      transition: theme.transitions.create(['width'], {
        duration: theme.transitions.duration.standard,
        easing: theme.transitions.easing.sharp,
      }),
      [theme.breakpoints.down('md')]: {
        opacity: 100,
        transition: theme.transitions.create(['opacity'], {
          delay: theme.transitions.duration.standard,
          easing: theme.transitions.easing.sharp,
        }),
      },
    },
    mainContentShift: {
      [theme.breakpoints.down('md')]: {
        opacity: 0,
        transition: theme.transitions.create(['opacity'], {
          delay: -1000,
          easing: theme.transitions.easing.sharp,
        }),
      },
      [theme.breakpoints.up('md')]: {
        width: `calc(100% - ${theme.spacing(72)})`,
        transition: theme.transitions.create(['width'], {
          duration: theme.transitions.duration.standard,
          easing: theme.transitions.easing.sharp,
        }),
      },
    },
  });
});
