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
import { AppRoutes2 } from '@/types/routes';

import AppLayout from '../app/app-layout';
const Models = dynamic(() => import('./model-main'), { ssr: false });

export interface ModelLayoutProps {
  brand?: string;
  routes?: AppRoutes2;
}

export default function ModelLayout(
  props: PropsWithChildren<ModelLayoutProps>
): ReactElement {
  const classes = useStyles();
  const router = useRouter();
  const routePath = useRef(router.asPath);
  const [showNav, setShowNav] = useState(true);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  useEffect(
    function showNavInLargeScreen() {
      if (isLargeScreen) setShowNav(true);
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
      brand={props.brand}
      footer={false}
    >
      <Models showNav={showNav} routes={props.routes ?? appRoutes}>
        {props.children}
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
