// Ported from model-main.tsx. Next-specific plumbing swapped:
//   - useRouter() -> useRouteQuery() (src/hooks/useRouteQuery.ts)
//   - useSession() (next-auth) -> useAuth() (src/auth/AuthProvider.tsx)
// One real behavior change, not just plumbing: the original showed a
// separate "your session expired" card when `session.accessTokenExpires`
// had passed, because the client held the token and could see its expiry.
// Under the new gqs-owned auth model, token refresh happens entirely
// server-side (attachAuthFromSession) - the client only ever sees
// authenticated true/false, so that intermediate state doesn't exist
// anymore; there's just "logged in" or "not logged in".
import clsx from 'clsx';
import { PropsWithChildren, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { Divider } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import {
  AddCircle as NewIcon,
  BubbleChart as ModelIcon,
  Edit as EditIcon,
  VisibilityTwoTone as DetailsIcon,
} from '@mui/icons-material';

import AlertCard from '@/components/alert-card';
import Breadcrumbs, { Breadcrumb } from '@/components/breadcrumbs';
import { AppRoutes } from '@/types/routes';
import { parseRoute } from '@/utils/router';
import { useRouteQuery } from '@/hooks';
import { useAuth } from '@/auth/AuthProvider';

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
  const { authenticated, permissions } = useAuth();
  const classes = useStyles({});
  const router = useRouteQuery();
  const { t } = useTranslation();

  const route = parseRoute(router.asPath);
  const crumbs: Breadcrumb[] = route.path
    .split('/')
    .slice(1)
    .map((chunk, index, chunks) => {
      const crumb = {
        text: t(`models-layout.${chunk}` as unknown as TemplateStringsArray, {
          defaultValue: chunk,
        }),
        href:
          index === 1 // model
            ? `/${chunks[0]}/${chunk}`
            : index === 3 // association
            ? router.asPath
            : undefined,
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
      return crumb;
    });

  if (router.query.id) {
    if (crumbs.length > 3) {
      const last = crumbs.pop() as Breadcrumb;
      crumbs.push(
        {
          text: router.query.id,
          href:
            '/' +
            crumbs.map((crumb) => crumb.text.toLowerCase()).join('/') +
            (route.query ?? ''),
        },
        last
      );
    } else {
      crumbs.push({
        text: router.query.id,
        href: router.asPath,
      });
    }
  }

  return (
    <div className={classes.container}>
      <Navigation
        className={clsx(classes.navDrawer, {
          [classes.navDrawerClosed]: !showNav,
        })}
        permissions={permissions}
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
        {!authenticated ? (
          <AlertCard
            title={t('restricted.not-logged-header')}
            body={t('restricted.not-logged-info')}
            type="info"
          />
        ) : (
          props.children
        )}
      </main>
    </div>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  })
);
