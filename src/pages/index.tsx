import Head from 'next/head';
import { makeStyles, createStyles, Theme } from '@material-ui/core';
import { AppLayout, PageWithLayout } from '@/layouts';
import { useTranslation } from 'react-i18next';
import { ClientOnly } from '@/components/wrappers';

const Home: PageWithLayout = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.container}>
      <Head>
        <title>Zendro App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={classes.main}>
        <img className={classes.banner} src="/banner.png" alt="zendro banner" />

        <ClientOnly>
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
            >
              <h1>Github &rarr;</h1>
              <p>{t('home.github-info')}</p>
            </a>
          </div>
        </ClientOnly>
      </main>
    </div>
  );
};

Home.layout = AppLayout;
export default Home;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing(0, 4),
    },
    main: {
      padding: theme.spacing(20, 0),
      display: 'flex',
      flexGrow: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
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
      maxWidth: theme.breakpoints.values.md,
    },
    card: {
      // Dimensions
      width: '100%',

      // Spacing & Layout
      margin: theme.spacing(2, 0),
      padding: theme.spacing(2, 8),

      [theme.breakpoints.up('sm')]: {
        flexBasis: '45%',
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
