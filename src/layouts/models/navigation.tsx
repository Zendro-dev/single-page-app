import React, { ReactElement } from 'react';

import { Box, createStyles, makeStyles } from '@material-ui/core';
import {
  BubbleChart as ModelsIcon,
  Home as HomeIcon,
  SupervisorAccountRounded as AdminIcon,
} from '@material-ui/icons';

import { NavGroup, NavLink } from '@/components/navigation';
import { AuthPermissions } from '@/types/auth';
import { AppRoutes } from '@/types/routes';
import clsx from 'clsx';

interface AppDrawerProps {
  className?: string;
  component?: React.ElementType;
  permissions?: AuthPermissions;
  routes: AppRoutes;
}

export default function Navigation({
  className,
  component,
  permissions,
  routes,
}: AppDrawerProps): ReactElement {
  const classes = useStyles();

  const canAccessAdminRoutes = routes.admin.some(
    (route) =>
      permissions &&
      permissions[route.name]?.find((x) => x === 'read' || x === '*')
  );

  const canAccessRoute = (name: string): boolean | undefined => {
    return (
      permissions &&
      permissions[name]?.some(
        (permission) => permission === 'read' || permission === '*'
      )
    );
  };

  return (
    <Box
      component={component}
      className={clsx(classes.drawer, className ?? '')}
    >
      <NavLink
        className={classes.homeLink}
        href="/home"
        icon={HomeIcon}
        text="Home"
        textProps={{
          fontWeight: 'bold',
        }}
      />

      {routes && (
        <NavGroup icon={ModelsIcon} label="Models">
          {routes.models.map(
            ({ name, href }) =>
              canAccessRoute(name) && (
                <NavLink
                  key={name}
                  href={href}
                  className={classes.linkText}
                  text={name}
                />
              )
          )}
        </NavGroup>
      )}

      {canAccessAdminRoutes && (
        <NavGroup icon={AdminIcon} label="Admin">
          {routes.admin.map(
            ({ name, href }) =>
              canAccessRoute(name) && (
                <NavLink
                  key={name}
                  className={classes.linkText}
                  href={href}
                  text={name}
                />
              )
          )}
        </NavGroup>
      )}
    </Box>
  );
}

const useStyles = makeStyles((theme) => {
  return createStyles({
    drawer: {
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      overflow: 'hidden',
      borderRight: '1px solid',
      borderRightColor: theme.palette.grey[300],
      transition: theme.transitions.create(['width'], {
        duration: theme.transitions.duration.standard,
        easing: theme.transitions.easing.sharp,
      }),
    },
    homeLink: {
      display: 'flex',
      alignItems: 'center',
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
    },
    linkText: {
      paddingLeft: theme.spacing(8),
    },
  });
});
