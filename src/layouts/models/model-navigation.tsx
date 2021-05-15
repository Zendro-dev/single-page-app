import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import MuiIcon from '@/components/dynamic/mui-icon';

import { NavGroup, NavLink } from '@/components/navigation';
import { useRoutePermissions } from '@/hooks';
import { AuthPermissions } from '@/types/auth';
import { AppRoutes2, RouteLink } from '@/types/routes';

interface AppDrawerProps {
  className?: string;
  permissions?: AuthPermissions;
  routes: AppRoutes2;
}

export default function Navigation({
  className,
  routes,
}: AppDrawerProps): ReactElement {
  const classes = useStyles();
  const router = useRouter();
  const getRoutePermissions = useRoutePermissions();
  const { t } = useTranslation();

  const canAccessGroup = (routes: RouteLink[]): boolean => {
    return routes.some(canAccessRoute);
  };

  const canAccessRoute = (route: RouteLink): boolean | undefined => {
    return getRoutePermissions(route.href).read;
  };

  return (
    <Box component="nav" className={clsx(classes.drawer, className ?? '')}>
      {routes.map((route) => {
        if (route.type === 'group' && canAccessGroup(route.routes))
          return (
            <NavGroup
              key={route.name}
              icon={route.icon ? MuiIcon(route.icon) : undefined}
              label={t(
                ((`models-layout.${route.name.toLocaleLowerCase()}` as unknown) as TemplateStringsArray) ??
                  route.name
              )}
            >
              {route.routes.map(({ name, href }) => (
                <NavLink
                  key={name}
                  href={href}
                  className={clsx({
                    active: href === router.asPath,
                  })}
                  text={name}
                />
              ))}
            </NavGroup>
          );

        if (route.type === 'link' && canAccessRoute(route))
          return (
            <NavLink
              key={route.name}
              icon={route.icon ? MuiIcon(route.icon) : undefined}
              href={route.href}
              className={clsx(classes.homeLink)}
              text={route.name}
            />
          );
      })}
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
      '& p': {
        fontWeight: 'bold',
      },
    },
  });
});
