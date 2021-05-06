import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { PropsWithChildren, ReactElement } from 'react';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  AddCircle as NewIcon,
  BubbleChart as ModelIcon,
  Edit as EditIcon,
  VisibilityTwoTone as DetailsIcon,
} from '@material-ui/icons';

import { Breadcrumbs, Breadcrumb } from '@/components/navigation';
import useAuth from '@/hooks/useAuth';
import { AppRoutes, RecordUrlQuery } from '@/types/routes';
import { getPathRequest } from '@/utils/router';

import Restricted from './restricted';
import Navigation from './navigation';
import { Divider } from '@material-ui/core';

import '@/i18n';
import { useTranslation } from 'react-i18next';

export interface ModelsProps {
  routes: AppRoutes;
  showNav: boolean;
}

export default function Models({
  routes,
  showNav,
  ...props
}: PropsWithChildren<ModelsProps>): ReactElement {
  const { auth } = useAuth();
  const classes = useStyles();
  const router = useRouter();
  const { t } = useTranslation();

  const { group, model, id } = router.query as RecordUrlQuery;
  const request = getPathRequest(router.asPath, model);
  const crumbs: Breadcrumb[] = [];

  if (group) {
    crumbs.push({
      text: t((`models-layout.${group}` as unknown) as TemplateStringsArray),
      icon: ModelIcon,
    });
  }

  if (model)
    crumbs.push({
      text: model,
      href: `/${group}/${model}`,
    });

  if (request)
    crumbs.push({
      text:
        request === 'read'
          ? t('models-layout.read')
          : request === 'update'
          ? t('models-layout.update')
          : request === 'create'
          ? t('models-layout.create')
          : request,
      icon:
        request === 'read'
          ? DetailsIcon
          : request === 'update'
          ? EditIcon
          : request === 'create'
          ? NewIcon
          : undefined,
    });

  if (id)
    crumbs.push({
      text: id,
      href: `/${group}/${model}/edit/?id=${id}`,
    });

  return (
    <div className={classes.mainContainer}>
      <Navigation
        className={clsx(classes.navDrawer, {
          [classes.navDrawerClosed]: !showNav,
        })}
        permissions={auth.user?.permissions}
        routes={routes}
      />
      <main
        className={clsx(classes.mainContent, {
          [classes.mainContentShift]: showNav,
        })}
      >
        <Breadcrumbs
          id="app-breadcrumbs"
          className={classes.breadcrumbs}
          crumbs={crumbs}
        />
        <Divider />
        <Restricted>{props.children}</Restricted>
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
    mainContainer: {
      display: 'flex',
      height: `calc(100% - ${theme.spacing(18)})`,
    },
    mainContent: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
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
    mainContentShift: {
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
