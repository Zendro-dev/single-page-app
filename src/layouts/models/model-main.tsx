import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { PropsWithChildren, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { Divider } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  AddCircle as NewIcon,
  BubbleChart as ModelIcon,
  Edit as EditIcon,
  VisibilityTwoTone as DetailsIcon,
} from '@material-ui/icons';

import AlertCard from '@/components/alert-card';
import Breadcrumbs, { Breadcrumb } from '@/components/breadcrumbs';
import useAuth from '@/hooks/useAuth';
import { AppRoutes, RecordUrlQuery } from '@/types/routes';
import { getRoutePath } from '@/utils/router';

import Navigation from './model-navigation';

export interface ModelsProps {
  routes: AppRoutes;
  showNav: boolean;
}

export default function Models({
  routes,
  showNav,
  ...props
}: PropsWithChildren<ModelsProps>): ReactElement {
  const auth = useAuth();
  const classes = useStyles();
  const router = useRouter();
  const { t } = useTranslation();

  const routePath = getRoutePath(router.asPath);
  const crumbs: Breadcrumb[] = routePath
    .split('/')
    .slice(1)
    .reduce<Breadcrumb[]>((acc, chunk, index, chunks) => {
      const crumb = {
        text: t((`models-layout.${chunk}` as unknown) as TemplateStringsArray, {
          defaultValue: chunk,
        }),
        href: index === 1 ? `/${chunks[0]}/${chunk}` : undefined,
        icon:
          chunk === 'models'
            ? ModelIcon
            : chunk === 'details'
            ? DetailsIcon
            : chunk === 'edit'
            ? EditIcon
            : chunk === 'new'
            ? NewIcon
            : undefined,
      };
      return [...acc, crumb];
    }, []);

  const urlQuery = router.query as RecordUrlQuery;
  if (urlQuery.id)
    crumbs.push({
      text: urlQuery.id,
      href: router.asPath,
    });

  return (
    <div className={classes.container}>
      <Navigation
        className={clsx(classes.navDrawer, {
          [classes.navDrawerClosed]: !showNav,
        })}
        permissions={auth.user?.permissions}
        routes={routes}
      />
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: showNav,
        })}
      >
        <Breadcrumbs
          id="app-breadcrumbs"
          className={classes.breadcrumbs}
          crumbs={crumbs}
        />
        <Divider />
        {!auth.user ? (
          <AlertCard
            title={t('restricted.not-logged-header')}
            body={t('restricted.not-logged-info')}
            type="info"
          />
        ) : auth.status === 'expired' ? (
          <AlertCard
            title={t('restricted.token-exp-header')}
            body={t('restricted.token-exp-info')}
            type="warning"
          />
        ) : (
          props.children
        )}
      </main>
    </div>
  );
}

const useStyles = makeStyles((theme) => {
  return createStyles({
    breadcrumbs: {
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
      backgroundColor: theme.palette.action.hover,
      height: theme.spacing(14),
      padding: theme.spacing(0, 4),
    },
    container: {
      display: 'flex',
      flexGrow: 1,
      overflowY: 'hidden',
      maxHeight: `calc(100vh - ${theme.spacing(18)})`,
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      // maxHeight: `calc(100% - ${theme.spacing(32)})`,

      transition: theme.transitions.create(['width'], {
        duration: theme.transitions.duration.standard,
        easing: theme.transitions.easing.sharp,
      }),

      [theme.breakpoints.down('md')]: {
        opacity: 100,
        transition: theme.transitions.create(['opacity'], {
          delay: theme.transitions.duration.standard,
          easing: theme.transitions.easing.sharp,
        }),
      },
    },
    contentShift: {
      [theme.breakpoints.down('md')]: {
        opacity: 0,
        transition: theme.transitions.create(['opacity'], {
          delay: -1000,
          easing: theme.transitions.easing.sharp,
        }),
      },
      [theme.breakpoints.up('md')]: {
        width: `calc(100% - ${theme.spacing(62)})`,
        transition: theme.transitions.create(['width'], {
          duration: theme.transitions.duration.standard,
          easing: theme.transitions.easing.sharp,
        }),
      },
    },
    navDrawer: {
      backgroundColor: theme.palette.action.hover,
      borderRight: '1px solid',
      borderRightColor: theme.palette.divider,
      width: '100%',
      transition: theme.transitions.create(['width'], {
        duration: theme.transitions.duration.standard,
        easing: theme.transitions.easing.sharp,
      }),
      [theme.breakpoints.up('md')]: {
        width: theme.spacing(62),
      },
    },
    navDrawerClosed: {
      borderRight: 0,
      width: 0,
    },
  });
});
