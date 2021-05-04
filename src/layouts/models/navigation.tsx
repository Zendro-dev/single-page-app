import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';

import { Box } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  BubbleChart as ModelsIcon,
  Home as HomeIcon,
  SupervisorAccountRounded as AdminIcon,
} from '@material-ui/icons';

import { NavGroup, NavLink } from '@/components/navigation';
import { AuthPermissions } from '@/types/auth';
import { AppRoutes, ModelUrlQuery } from '@/types/routes';

interface AppDrawerProps {
  className?: string;
  permissions?: AuthPermissions;
  routes: AppRoutes;
}

export default function Navigation({
  className,
  permissions,
  routes,
}: AppDrawerProps): ReactElement {
  const classes = useStyles();
  const router = useRouter();
  const urlQuery = router.query as ModelUrlQuery;

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
    <Box component="nav" className={clsx(classes.drawer, className ?? '')}>
      <NavLink
        className={classes.homeLink}
        href="/models"
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
                  className={clsx({
                    active: name === urlQuery.model,
                  })}
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
                  className={clsx({
                    active: name === urlQuery.model,
                  })}
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
      '& ul > a': {
        paddingLeft: theme.spacing(18),
      },
      '& a:hover:not(.active), ul > button:hover': {
        backgroundColor: theme.palette.primary.light,
      },
      '& a.active': {
        color: theme.palette.getContrastText(theme.palette.primary.main),
        backgroundColor: theme.palette.primary.main,
        '& .MuiTypography-root': {
          fontWeight: 'bold',
        },
      },
    },
    homeLink: {
      display: 'flex',
      alignItems: 'center',
      height: theme.spacing(14),
      padding: theme.spacing(3, 4),
    },
  });
});
