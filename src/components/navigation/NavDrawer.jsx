import React from 'react';
import {
  List,
  Divider,
  Drawer,
  Typography,
  Box,
  Zoom,
  Fab,
} from '@material-ui/core';
import { ChevronLeft as ChevronLeftIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import NavGroup from './NavGroup';
import NavItem from './NavItem';

const useStyles = (drawerWidth) =>
  makeStyles((theme) => ({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 3),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
  }))();

export default function NavDrawer({
  routes,
  isDrawerOpen,
  handleDrawerClose,
  drawerWidth,
}) {
  const classes = useStyles(drawerWidth);

  return (
    <div>
      {isDrawerOpen && (
        <Box position="fixed" top={8} left={256} zIndex="modal">
          <Zoom in={true} timeout={500}>
            <Fab
              id="MainPanel-fab-closeMenu"
              size="medium"
              color="primary"
              onClick={handleDrawerClose}
            >
              <ChevronLeftIcon />
            </Fab>
          </Zoom>
        </Box>
      )}
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={isDrawerOpen}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <Typography variant="h5">Zendro</Typography>
        </div>
        <Divider />
        <List>
          {routes.map(({ label, icon: Icon, children, to }, i) => (
            <NavGroup
              key={`${label}-${i}`}
              label={label}
              icon={<Icon />}
              to={to}
            >
              {children?.map((item, ii) => (
                <NavItem
                  key={`${item.label}-${ii}`}
                  label={item.label}
                  to={item.to}
                />
              ))}
            </NavGroup>
          ))}
        </List>
      </Drawer>
    </div>
  );
}
