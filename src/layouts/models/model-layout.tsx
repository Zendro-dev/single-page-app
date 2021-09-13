import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, {
  PropsWithChildren,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Fab, useMediaQuery, Zoom } from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { Theme } from '@mui/material/styles';
import { createStyles, makeStyles, useTheme } from '@mui/styles';

import appRoutes from '@/build/routes.preval';
import { AppRoutes } from '@/types/routes';

import AppLayout from '../app/app-layout';
const Models = dynamic(() => import('./model-main'), { ssr: false });

export interface ModelLayoutProps {
  brand?: string;
  routes?: AppRoutes;
}

export default function ModelLayout(
  props: PropsWithChildren<ModelLayoutProps>
): ReactElement {
  const classes = useStyles();
  const router = useRouter();
  const routePath = useRef(router.asPath);
  const [showNav, setShowNav] = useState(true);
  const theme = useTheme<Theme>();
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      width: theme.spacing(9),
      height: theme.spacing(3),
    },
  })
);
