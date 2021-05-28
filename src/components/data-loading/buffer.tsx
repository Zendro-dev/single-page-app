import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';

import { createStyles, makeStyles } from '@material-ui/core';
import { theme } from '@/styles/theme';

interface LastUpdatedProps {
  isLoading?: boolean;
  color?: string;
  date: string;
}

export default function Buffer(props: LastUpdatedProps): React.ReactElement {
  const classes = useStyles(props);
  return (
    <div className={classes.root}>
      {props.isLoading && (
        <CircularProgress size={theme.spacing(5)} color="primary" />
      )}
      <span className={classes.updatedAt}>
        {props.isLoading ? 'fetching...' : `last updated at ${props.date}`}
      </span>
    </div>
  );
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing(2),
      whiteSpace: 'nowrap',
    },
    updatedAt: {
      marginLeft: theme.spacing(2),
      fontSize: theme.spacing(3),
      color: (props: LastUpdatedProps) =>
        props.isLoading ? theme.palette.warning.main : props.color,
    },
  })
);
