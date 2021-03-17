import { PropsWithChildren, ReactElement } from 'react';
import Link from 'next/link';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
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
        <Typography marginLeft="1rem" variant="h4" component="a" noWrap>
          {brand}
        </Typography>
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
    menus: {
      marginLeft: 'auto',
    },
  });
});
