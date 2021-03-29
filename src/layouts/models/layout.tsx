import dynamic from 'next/dynamic';
import React, {
  PropsWithChildren,
  ReactElement,
  useEffect,
  useState,
} from 'react';

import { Box, Fab, useMediaQuery, Zoom } from '@material-ui/core';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@material-ui/icons';
import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';

import appRoutes, { AppRoutes } from '@/build/routes';
import Toolbar from './toolbar';
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
  const [showNav, setShowNav] = useState(false);
  const theme = useTheme();

  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  useEffect(() => setShowNav(isLargeScreen), [isLargeScreen]);

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

      <Models
        showNav={showNav}
        routes={routes ?? ((appRoutes as unknown) as AppRoutes)}
      >
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
