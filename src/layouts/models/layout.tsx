import React, {
  PropsWithChildren,
  ReactElement,
  useEffect,
  useState,
} from 'react';
import clsx from 'clsx';
import dynamic from 'next/dynamic';

import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import { Box, Fab, useMediaQuery, Zoom } from '@material-ui/core';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@material-ui/icons';
import RestrictedResource from '@/components/placeholders/restricted-resource';

import appRoutes, { AppRoutes } from '@/build/routes';
import useAuth from '@/hooks/useAuth';
import Toolbar from './toolbar';
const Navigation = dynamic(() => import('./navigation'), { ssr: false });

export interface ModelsDesktopLayoutProps {
  brand?: string;
  routes?: AppRoutes;
}

export default function ModelsLayout({
  brand,
  routes,
  children,
}: PropsWithChildren<ModelsDesktopLayoutProps>): ReactElement {
  const { auth } = useAuth();
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();

  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  useEffect(() => setDrawerOpen(isLargeScreen), [isLargeScreen]);

  return (
    <div className={classes.root}>
      <Toolbar brand={brand ?? ''}>
        <Zoom in={true} timeout={500}>
          <Box>
            <Fab
              size={isLargeScreen ? 'medium' : 'small'}
              onClick={() => setDrawerOpen((state) => !state)}
            >
              {drawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </Fab>
          </Box>
        </Zoom>
      </Toolbar>

      <div className={classes.mainContainer}>
        <Navigation
          className={clsx(classes.drawer, {
            [classes.drawerClosed]: !drawerOpen,
          })}
          permissions={auth.user?.permissions}
          routes={routes ?? ((appRoutes as unknown) as AppRoutes)}
        />
        <main
          className={clsx(classes.mainContent, {
            [classes.mainContentShift]: drawerOpen,
          })}
        >
          <RestrictedResource>{children}</RestrictedResource>
        </main>
      </div>
    </div>
  );
}

const useStyles = makeStyles((theme) => {
  return createStyles({
    root: {
      height: '100%',
      overflowX: 'hidden',
    },
    mainContainer: {
      display: 'flex',
      height: `calc(100% - ${theme.spacing(18)})`,
    },
    drawer: {
      width: '100%',
      transition: theme.transitions.create(['width'], {
        duration: theme.transitions.duration.standard,
        easing: theme.transitions.easing.sharp,
      }),
      [theme.breakpoints.up('md')]: {
        width: theme.spacing(72),
      },
    },
    drawerClosed: {
      width: 0,
    },
    mainContent: {
      padding: theme.spacing(3),
      width: '100%',
      transition: theme.transitions.create(['width'], {
        duration: theme.transitions.duration.standard,
        easing: theme.transitions.easing.sharp,
      }),
    },
    mainContentShift: {
      width: 0,
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
