import { useEffect, useState } from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import {
  AppBar,
  Toolbar,
  makeStyles,
  createStyles,
  Theme,
  Button,
} from '@material-ui/core';

import LanguageSwitcher from '@/components/toolbar/lang-switcher';

const Home: NextPage = () => {
  const classes = useStyles();
  const { auth } = useAuth();
  const [loginRoute, setLoginRoute] = useState('/login');

  useEffect(() => {
    if (auth.user?.isValid) setLoginRoute('/models');
  }, [auth]);

  return (
    <div className={classes.container}>
      <Head>
        <title>Zendro App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AppBar position="fixed">
        <Toolbar>
          <div className={classes.appBarRightButtonsContainer}>
            <LanguageSwitcher />
            <Link href={loginRoute} passHref>
              <Button className={classes.loginButton} component="a">
                Login
              </Button>
            </Link>
          </div>
        </Toolbar>
      </AppBar>

      <main className={classes.main}>
        <img className={classes.banner} src="/banner.png" alt="zendro banner" />

        <div className={classes.cardContainer}>
          <a
            className={classes.card}
            href="https://zendro-dev.github.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h3>Documentation &rarr;</h3>
            <p>Find in-depth information about Zendro features and API.</p>
          </a>

          <a
            className={classes.card}
            href="https://github.com/Zendro-dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h3>Github &rarr;</h3>
            <p>Contribute with pull requests, issues, and feedback</p>
          </a>
        </div>
      </main>

      <footer className={classes.footer}>
        <a
          className={classes.footerLink}
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Powered by</span>
          <img
            style={{
              paddingLeft: '.5rem',
            }}
            src="/nextjs.svg"
            alt="Next Logo"
            className={classes.logo}
          />
        </a>
      </footer>
    </div>
  );
};

export default Home;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: theme.spacing(0, 2),
    },
    appBarRightButtonsContainer: {
      marginLeft: 'auto',
    },
    main: {
      padding: theme.spacing(20, 0),
      display: 'flex',
      flexGrow: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loginButton: {
      color: 'white',
    },
    banner: {
      padding: theme.spacing(8),
      width: '100%',
      objectFit: 'contain',
    },
    cardContainer: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      maxWidth: theme.breakpoints.width('md'),
    },
    card: {
      padding: theme.spacing(8),
      width: '100%',
      border: '1px solid',
      borderColor: theme.palette.grey[300],
      transition: 'all',
      transitionDuration: '.15s',
      transitionTimingFunction: 'ease',
      '&:hover': {
        color: 'green',
      },
      [theme.breakpoints.down('sm')]: {
        marginBottom: theme.spacing(2),
      },
      [theme.breakpoints.up('sm')]: {
        flexBasis: '45%',
        '&:nth-child(even)': {
          marginLeft: theme.spacing(2),
        },
      },
      [theme.breakpoints.up('md')]: {
        margin: theme.spacing(2, 7),
      },
    },
    logo: {
      height: theme.spacing(6),
    },
    footer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: theme.spacing(20),
      borderTop: '1px solid',
      borderColor: theme.palette.grey[300],
    },
    footerLink: {
      display: 'flex',
      alignItems: 'center',
    },
  })
);
