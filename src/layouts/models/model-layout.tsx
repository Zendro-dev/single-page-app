import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, {
  PropsWithChildren,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Fab, useMediaQuery, Zoom } from '@material-ui/core';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@material-ui/icons';
import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';

import appRoutes from '@/build/routes.preval';
import { AppRoutes } from '@/types/routes';

import AppLayout from '../app/app-layout';
const Models = dynamic(() => import('./model-main'), { ssr: false });

export interface ModelsDesktopLayoutProps {
  brand?: string;
  routes?: AppRoutes;
}

export default function ModelsLayout({
  routes,
  children,
}: PropsWithChildren<ModelsDesktopLayoutProps>): ReactElement {
  const classes = useStyles();
  const router = useRouter();
  const routePath = useRef(router.asPath);
  const [showNav, setShowNav] = useState(false);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  useEffect(
    function hideNavOnSmallScreen() {
      setShowNav(isLargeScreen);
    },
    [isLargeScreen, setShowNav]
  );

  useEffect(
    function hideNavOnRouteChange() {
      const routeHasChanged = routePath.current !== router.asPath;
      if (routeHasChanged && !isLargeScreen) {
        routePath.current = router.asPath;
        setShowNav(false);
      }
    },
    [routePath, isLargeScreen, router]
  );

  return (
    <AppLayout
      action={
        <Zoom in={true} timeout={500}>
          <Fab
            className={classes.fab}
            onClick={() => setShowNav((state) => !state)}
          >
            {showNav ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </Fab>
        </Zoom>
      }
    >
      <Models showNav={showNav} routes={routes ?? appRoutes}>
        {children}
      </Models>
    </AppLayout>
  );
}

const useStyles = makeStyles((theme) =>
  createStyles({
    fab: {
      width: theme.spacing(9),
      height: theme.spacing(3),
    },
  })
);
