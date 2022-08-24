import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { Theme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import dataModels from '@/build/models.preval';
import useMuiIcon from '@/hooks/useMuiIcon';

import NavGroup from '@/components/nav-group';
import NavLink from '@/components/nav-link';
import { useModel } from '@/hooks';
import { AuthPermissions } from '@/types/auth';
import { AppRoutes, RouteLink } from '@/types/routes';

interface AppDrawerProps {
  className?: string;
  permissions?: AuthPermissions;
  routes: AppRoutes;
}

export default function Navigation({
  className,
  routes,
}: AppDrawerProps): ReactElement {
  const classes = useStyles();
  const router = useRouter();
  const getIcon = useMuiIcon();
  const getModel = useModel();
  const { t } = useTranslation();

  const canAccessGroup = (routes: RouteLink[]): boolean => {
    return routes.some(canAccessRoute);
  };

  const canAccessRoute = (route: RouteLink): boolean | undefined => {
    const isModel = Object.keys(dataModels).includes(route.name);
    return isModel ? getModel(route.name).permissions.read : true;
  };

  return (
    <nav aria-label="Models" className={clsx(classes.drawer, className ?? '')}>
      {routes.map((route) => {
        if (route.type === 'group' && canAccessGroup(route.routes))
          return (
            <NavGroup
              key={route.name}
              icon={route.icon ? getIcon(route.icon) : undefined}
              label={t(
                (`models-layout.${route.name.toLowerCase()}` as unknown as TemplateStringsArray) ??
                  route.name
              )}
            >
              {route.routes.map(({ name, href }) => (
                <NavLink
                  key={name}
                  href={href}
                  className={clsx({
                    active:
                      router.asPath === href ||
                      router.asPath.includes(href + '/'),
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
              icon={route.icon ? getIcon(route.icon) : undefined}
              href={route.href}
              className={clsx(classes.homeLink)}
              text={route.name}
            />
          );
      })}
    </nav>
  );
}

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    drawer: {
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      overflow: 'auto',
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
