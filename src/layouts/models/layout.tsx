import dynamic from 'next/dynamic';
import React, {
  PropsWithChildren,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Box, Fab, useMediaQuery, Zoom } from '@material-ui/core';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@material-ui/icons';
import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';

import appRoutes from '@/build/routes.preval';
import { AppRoutes } from '@/types/routes';
import Toolbar from './toolbar';
import { useRouter } from 'next/router';
const Models = dynamic(() => import('./main'), { ssr: false });

export interface ModelsDesktopLayoutProps {
  brand?: string;
  routes?: AppRoutes;
}

export default function ModelsLayout({
  brand,
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
    <div className={classes.root}>
      <Toolbar brand={brand ?? ''}>
        <Zoom in={true} timeout={500}>
          <Box>
            <Fab size="small" onClick={() => setShowNav((state) => !state)}>
              {showNav ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </Fab>
          </Box>
        </Zoom>
      </Toolbar>

      <Models showNav={showNav} routes={routes ?? appRoutes}>
        {children}
      </Models>
    </div>
  );
}

const useStyles = makeStyles(() => {
  return createStyles({
    root: {
      height: '100%',
      overflowX: 'hidden',
    },
  });
});
