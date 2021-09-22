import { Theme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import { AppLayout, PageWithLayout } from '@/layouts';
import { useTranslation } from 'react-i18next';
import ClientOnly from '@/components/client-only';
import LoginForm from '@/components/login-form';
import { useAuth } from '@/hooks';
import { useRouter } from 'next/router';
import { Box } from '@mui/material';
import LoginStatus from '@/components/login-form/login-status';
import { useEffect, useState } from 'react';

const Home: PageWithLayout = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  const auth = useAuth();
  const router = useRouter();

  const [redirect, setRedirect] = useState<boolean>(false);

  const handleOnLogin = (email: string, password: string): void => {
    if (email && password) auth.login(email, password);
    setRedirect(true);
  };

  useEffect(() => {
    if (redirect && auth.status === 'success')
      setTimeout(() => {
        if (router.asPath === '/') router.push('/models');
      }, 700);
  }, [redirect, auth.status, router]);

  return (
    <main className={classes.main}>
      <ClientOnly>
        <div className={classes.banner} style={{ marginTop: '2rem' }}>
          <img src="/banner.png" alt="zendro banner" />
        </div>

        {auth.status !== 'success' && (
          <Box className={classes.login}>
            {auth.status !== 'idle' && <LoginStatus />}
            <LoginForm onSubmit={handleOnLogin} />
          </Box>
        )}
        <div className={classes.cardContainer}>
          <a
            className={classes.card}
            href="https://zendro-dev.github.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h1>{t('home.documentation')} &rarr;</h1>
            <p>{t('home.documentation-info')}</p>
          </a>

          <a
            className={classes.card}
            href="https://github.com/Zendro-dev"
            target="_blank"
            rel="noopener noreferrer"
            data-cy="github"
          >
            <h1>Github &rarr;</h1>
            <p>{t('home.github-info')}</p>
          </a>
        </div>
      </ClientOnly>
    </main>
  );
};

Home.layout = AppLayout;
export default Home;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    main: {
      display: 'flex',
      flexGrow: 1,
      flexDirection: 'column',
      alignItems: 'center',

      // Spacing
      padding: theme.spacing(4, 8),
      [theme.breakpoints.up('sm')]: {
        justifyContent: 'space-evenly',
      },
    },

    login: {
      borderRadius: 5,
      boxShadow: theme.shadows[3],
      padding: '1rem',
    },

    banner: {
      width: '100%',
      maxWidth: theme.breakpoints.values.md,

      margin: theme.spacing(5, 0, 0, 0),
      [theme.breakpoints.up('sm')]: {
        margin: 0,
      },

      '& img': {
        width: '100%',
        objectFit: 'contain',
      },
    },

    cardContainer: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      maxWidth: theme.breakpoints.values.md,
      marginTop: theme.spacing(4),
    },

    card: {
      // Dimensions
      width: '100%',

      // Spacing & Layout
      margin: theme.spacing(2, 0),
      padding: theme.spacing(2, 0),

      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(2, 8),
        flexBasis: '40%',
        '&:nth-child(even)': {
          marginLeft: theme.spacing(2),
        },
      },

      [theme.breakpoints.up('md')]: {
        margin: theme.spacing(2, 7),
      },

      // Palette & Typography
      '&:hover': {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.background,
      },

      '& h1': {
        ...theme.typography.h6,
        color: theme.palette.primary.dark,
        fontWeight: 'bold',
        [theme.breakpoints.up('sm')]: {
          ...theme.typography.h5,
          color: theme.palette.primary.dark,
          fontWeight: 'bold',
        },
      },
    },
  })
);
