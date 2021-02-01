import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Fade } from '@material-ui/core';
import NavDrawer from '../components/navigation/NavDrawer';
import Topbar from '../components/toolbar/Topbar';
import {
  BubbleChart as ModelsIcon,
  HomeOutlined as HomeIcon,
  SupervisorAccountRounded as AdminIcon,
} from '@material-ui/icons';
import clsx from 'clsx';

const routes = [
  {
    label: 'Home',
    icon: HomeIcon,
  },
  {
    label: 'Models',
    icon: ModelsIcon,
    children: [
      {
        label: 'no_assoc',
      },
    ],
  },
  {
    label: 'Admin',
    icon: AdminIcon,
    children: [
      {
        label: 'Role',
      },
      {
        label: 'User',
      },
    ],
  },
];

const drawerWidth = 280;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  contentShift: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
    width: `calc(100% - ${drawerWidth}px)`,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
}));

export default function MainPanel(props) {
  const classes = useStyles();

  /* open Drawer */
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <Fade in={true} timeout={500}>
      <div className={classes.root}>
        <Topbar
          topBarMargin={drawerWidth}
          isDrawerOpen={isDrawerOpen}
          handleDrawerOpen={handleDrawerOpen}
        />
        <NavDrawer
          drawerWidth={drawerWidth}
          routes={routes}
          isDrawerOpen={isDrawerOpen}
          handleDrawerClose={handleDrawerClose}
        />
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: isDrawerOpen,
          })}
        >
          <div className={classes.drawerHeader} />
          {props.children}
        </main>
      </div>
    </Fade>
  );
}
