import Link from 'next/link';
import React, { PropsWithChildren, ReactElement, ReactNode } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import LanguageSwitcher from '@/components/toolbar/lang-switcher';
import LogoutButton from '@/components/toolbar/logout-button';

export interface AppLayoutProps {
  brand?: string;
  action?: ReactNode;
}

export default function ModelsLayout({
  brand,
  ...props
}: PropsWithChildren<AppLayoutProps>): ReactElement {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <header className={classes.header}>
        {props.action}

        <Link href="/" passHref>
          <a className={classes.brand}>{brand ?? 'Zendro'}</a>
        </Link>

        <div className={classes.menus}>
          <LanguageSwitcher className={classes.langButton} />
          <LogoutButton color="inherit" disableElevation />
        </div>
      </header>

      {props.children}
    </div>
  );
}

const useStyles = makeStyles((theme) => {
  return createStyles({
    root: {
      height: '100%',
      overflowX: 'hidden',
    },
    brand: {
      marginLeft: theme.spacing(4),
      ...theme.typography.h5,
      [theme.breakpoints.up('sm')]: {
        ...theme.typography.h4,
      },
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      height: theme.spacing(18),
      padding: theme.spacing(4, 6),
      color: theme.palette.getContrastText(theme.palette.primary.main),
      backgroundColor: theme.palette.primary.main,
      boxShadow: theme.shadows[3],
    },
    langButton: {
      marginRight: theme.spacing(3),
    },
    menus: {
      marginLeft: 'auto',
    },
  });
});
