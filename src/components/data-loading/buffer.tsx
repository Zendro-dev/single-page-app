import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

import { createStyles, makeStyles } from '@material-ui/core';
import { theme } from '@/styles/theme';

interface BufferProps {
  isLoading?: boolean;
  color?: 'red' | 'green';
  date: string;
}

export default function Buffer({
  isLoading,
  color,
  date,
}: BufferProps): React.ReactElement {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {isLoading && <CircularProgress size={theme.spacing(5)} />}
      <span className={classes.updatedAt}>{`last updated at ${date}`}</span>
    </div>
  );
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    updatedAt: {
      marginLeft: theme.spacing(2),
      fontSize: theme.spacing(3),
      color: 'green',
    },
  })
);
