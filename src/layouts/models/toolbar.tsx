import { PropsWithChildren, ReactElement } from 'react';
import Link from 'next/link';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import LanguageSwitcher from '@/components/toolbar/lang-switcher';
import LogoutButton from '@/components/toolbar/logout-button';

export interface AppBarProps {
  brand: string;
}

export default function Toolbar({
  brand,
  ...props
}: PropsWithChildren<AppBarProps>): ReactElement {
  const classes = useStyles();

  return (
    <header className={classes.root}>
      {props.children}

      <Link href="/" passHref>
        <a className={classes.brand}>{brand}</a>
      </Link>

      <div className={classes.menus}>
        <LanguageSwitcher />
        <LogoutButton />
      </div>
    </header>
  );
}

const useStyles = makeStyles((theme) => {
  return createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      height: theme.spacing(18),
      padding: theme.spacing(4, 6),
      color: theme.palette.getContrastText(theme.palette.primary.main),
      backgroundColor: theme.palette.primary.main,
      boxShadow: theme.shadows[3],
    },
    brand: {
      marginLeft: theme.spacing(4),
      ...theme.typography.h5,
      [theme.breakpoints.up('sm')]: {
        ...theme.typography.h4,
      },
    },
    menus: {
      marginLeft: 'auto',
    },
  });
});
