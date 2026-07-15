// Ported from single-page-app/src/pages/index.tsx - the MUI component tree,
// makeStyles block, and copy are unmodified from the original; only the
// Next.js/next-auth-specific plumbing changed:
//   - next/image -> plain <img> (with the same wrapping <div>/sizing)
//   - ClientOnly -> removed (was only for Next SSR hydration)
//   - useSession/signIn (next-auth) -> useAuth() (src/auth/AuthProvider.tsx)
//   - react-i18next's t() -> hardcoded English strings (i18n wiring is out
//     of scope for this spike, see src/i18n/en.json for the originals)
import type { Theme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import { Button } from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';

import { useAuth } from '@/auth/AuthProvider';

export default function Home() {
  const { authenticated, login } = useAuth();
  const classes = useStyles({});

  return (
    <main className={classes.main}>
      <div
        style={{
          marginTop: '2rem',
          position: 'relative',
          height: '200px',
          width: '100%',
        }}
      >
        <img
          src="/banner.png"
          alt="zendro banner"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>

      {authenticated === false && (
        <Button size="large" variant="outlined" color="success" endIcon={<LoginIcon />} onClick={login}>
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
          <h1>Documentation &rarr;</h1>
          <p>Find in-depth information about Zendro features and API.</p>
        </a>

        <a
          className={classes.card}
          href="https://github.com/Zendro-dev"
          target="_blank"
          rel="noopener noreferrer"
          data-cy="github"
        >
          <h1>Github &rarr;</h1>
          <p>Contribute with pull requests, issues, and feedback.</p>
        </a>
      </div>
    </main>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    main: {
      display: 'flex',
      flexGrow: 1,
      flexDirection: 'column',
      alignItems: 'center',

      padding: theme.spacing(4, 8),
      [theme.breakpoints.up('sm')]: {
        justifyContent: 'space-evenly',
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
      width: '100%',

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
