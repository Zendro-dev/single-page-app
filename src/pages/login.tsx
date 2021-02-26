import React, { ReactElement } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Box, Fade, Typography } from '@material-ui/core';
import LoginForm from '../components/forms/login-form';
import useAuth from '../hooks/useAuth';

export default function LoginPage(): ReactElement {
  const classes = useStyles();
  const { login } = useAuth({
    redirectTo: '/home',
    redirectIfFound: true,
  });

  const onLoginFormSubmit = (email: string, password: string): void => {
    if (email && password) login(email, password);
  };

  return (
    <div className={classes.root}>
      <Fade in={true} timeout={500}>
        <Box className={classes.box}>
          <Typography variant="h4" component="h2" className={classes.brand}>
            Zendro
          </Typography>
          <LoginForm onSubmit={onLoginFormSubmit} />
        </Box>
      </Fade>
    </div>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
    },
    box: {
      boxShadow: theme.shadows[10],
      margin: theme.spacing(40, 4, 0, 4),
      padding: theme.spacing(5, 5, 15, 5),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        maxWidth: theme.spacing(128),
      },
    },
    brand: {
      marginTop: theme.spacing(3),
      textAlign: 'center',
    },
  })
);
