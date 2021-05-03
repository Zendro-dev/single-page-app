import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { PropsWithChildren, ReactElement, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { usePermissions, useCoundown } from '@/hooks';
import { hasValues } from '@/utils/validation';
import ModelInfo from './model-info';

interface RestrictedProps {
  info?: Record<string, string | undefined>;
  redirect?: {
    to: string;
    timer: number;
  };
}

export default function Restricted(
  props: PropsWithChildren<RestrictedProps>
): ReactElement {
  const router = useRouter();
  const model = usePermissions();
  const classes = useStyles();

  const { resetTimer, startTimer, timer } = useCoundown(10);

  useEffect(
    function initTimer() {
      if (!model.allowed) {
        startTimer();
      } else {
        resetTimer();
      }
    },
    [model, resetTimer, startTimer]
  );

  useEffect(
    function redirect() {
      if (timer === 0) {
        router.push('/models');
        resetTimer();
      }
    },
    [resetTimer, router, timer]
  );

  return (
    <>
      {model.allowed ? (
        props.children
      ) : (
        <div className={classes.root}>
          <h1 className={classes.header}>Access to this page is restricted.</h1>

          {hasValues({ ...model }) && <ModelInfo model={model} />}

          <p className={classes.text}>
            <span>You will be redirected to </span>
            <span className={classes.linkText}>
              <Link href="/models">
                <a>/models</a>
              </Link>
            </span>
            <span> in </span>
            <b className={classes.timer}>{timer}</b>
            <span> seconds</span>
          </p>
        </div>
      )}
    </>
  );
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: theme.spacing(40),
      padding: theme.spacing(8),
      backgroundColor: theme.palette.background.paper,
      border: '2px solid',
      borderColor: 'orangered',
      color: 'orangered',
      boxShadow: theme.shadows[1],
    },
    linkText: {
      color: 'rebeccapurple',
      textDecoration: 'underline',
    },
    header: {
      textAlign: 'center',
      ...theme.typography.h6,
      [theme.breakpoints.up('sm')]: {
        ...theme.typography.h4,
      },
      [theme.breakpoints.up('md')]: {
        ...theme.typography.h3,
      },
    },
    text: {
      color: theme.palette.text.primary,
      ...theme.typography.body1,
      [theme.breakpoints.up('sm')]: {
        ...theme.typography.h5,
      },
    },
    timer: {
      color: 'orangered',
      fontSize: theme.spacing(8),
    },
  })
);
