import Image from 'next/image';

import { Theme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import { AppLayout, PageWithLayout } from '@/layouts';
import { useTranslation } from 'react-i18next';
import ClientOnly from '@/components/client-only';
import { Button } from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';

import { useSession, signIn } from 'next-auth/react';

import { BASEPATH } from '@/config/globals';

const Home: PageWithLayout = () => {
  const { data: session } = useSession();
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <main className={classes.main}>
      <ClientOnly>
        <div
          style={{
            marginTop: '2rem',
            position: 'relative',
            height: '200px',
            width: '100%',
          }}
        >
          <Image
            src={`${BASEPATH}/banner.png`}
            alt="zendro banner"
            layout="fill"
            objectFit="contain"
          />
        </div>

        {!session && (
          <Button
            size="large"
            variant="outlined"
            color="success"
            endIcon={<LoginIcon />}
            onClick={() =>
              signIn('zendro', { callbackUrl: `${BASEPATH}/models` })
            }
          >
            LOGIN
          </Button>
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
      position: 'relative',
      height: 'unset',

      margin: theme.spacing(5, 0, 0, 0),
      [theme.breakpoints.up('sm')]: {
        margin: 0,
      },

      // '& img': {
      //   width: '100%',
      //   objectFit: 'contain',
      // },
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
