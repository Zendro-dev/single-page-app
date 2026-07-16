// Ported from model-layout.tsx. next/dynamic (SSR-disabled lazy import) is
// dropped for a plain static import - the whole point of that dynamic()
// call was avoiding SSR for a component that isn't SSR-safe, which no
// longer applies to a pure CSR app. useRouter() -> react-router's
// useLocation().
import { useLocation } from 'react-router-dom';
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

import appRoutes from '@/generated/routes';
import { AppRoutes } from '@/types/routes';

import AppLayout from '../app/app-layout';
import Models from './model-main';

export interface ModelLayoutProps {
  brand?: string;
  routes?: AppRoutes;
}

export default function ModelLayout(
  props: PropsWithChildren<ModelLayoutProps>
): ReactElement {
  const classes = useStyles({});
  const location = useLocation();
  const asPath = location.pathname + location.search;
  const routePath = useRef(asPath);
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
      const routeHasChanged = routePath.current !== asPath;
      if (routeHasChanged && !isLargeScreen) {
        routePath.current = asPath;
        setShowNav(false);
      }
    },
    [routePath, isLargeScreen, asPath]
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
