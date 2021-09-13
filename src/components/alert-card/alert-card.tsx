import clsx from 'clsx';
import React, { PropsWithChildren, ReactElement } from 'react';
import { Box } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import {
  InfoOutlined as InfoIcon,
  WarningAmber as WarningIcon,
} from '@mui/icons-material';

interface ModelBouncerProps {
  title: string;
  body?: string;
  type: 'error' | 'info' | 'warning';
}

export default function AlertCard(
  props: PropsWithChildren<ModelBouncerProps>
): ReactElement {
  const classes = useStyles();

  return (
    <Box
      className={clsx(classes.card, {
        [classes.cardInfo]: props.type === 'info',
        [classes.cardWarning]: props.type === 'warning',
      })}
    >
      {props.type === 'info' ? (
        <InfoIcon />
      ) : props.type === 'warning' ? (
        <WarningIcon />
      ) : undefined}
      <Box>
        <h1>{props.title}</h1>
        <p>{props.body}</p>
      </Box>
    </Box>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      // Layout
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',

      // Layout : larger viewport
      [theme.breakpoints.up('sm')]: {
        flexDirection: 'row',
        alignItems: 'unset',
      },

      // Spacing
      padding: theme.spacing(6),

      // Border styles
      border: '2px solid',

      // Content container
      '& > div': {
        margin: theme.spacing(4, 0, 0, 0),
        [theme.breakpoints.up('sm')]: {
          margin: theme.spacing(0, 0, 0, 4),
        },
      },

      // Heading
      '& h1': {
        padding: 0,
        margin: 0,
        fontSize: theme.spacing(5),
        textAlign: 'center',
        [theme.breakpoints.up('sm')]: {
          textAlign: 'revert',
        },
      },

      // Message
      '& p': {
        margin: theme.spacing(2, 0, 0, 0),
        textAlign: 'center',
        [theme.breakpoints.up('sm')]: {
          textAlign: 'revert',
        },
      },

      // Icon
      '& svg': {
        width: theme.spacing(10),
        height: theme.spacing(10),
        [theme.breakpoints.up('sm')]: {
          margin: theme.spacing(0, 0, 0, 0),
          width: theme.spacing(8),
          height: theme.spacing(8),
        },
      },
    },
    cardInfo: {
      backgroundColor: theme.palette.primary.background,
      borderColor: theme.palette.primary.main,

      // Heading
      '& h1': {
        color: theme.palette.primary.dark,
      },

      // Message
      '& p': {
        color: theme.palette.primary.main,
      },

      // Icon
      '& svg': {
        color: theme.palette.primary.main,
      },
    },
    cardWarning: {
      backgroundColor: theme.palette.warning.background,
      borderColor: theme.palette.warning.main,

      // Heading
      '& h1': {
        color: theme.palette.warning.dark,
      },

      // Message
      '& p': {
        color: theme.palette.warning.main,
      },

      // Icon
      '& svg': {
        color: theme.palette.warning.main,
      },
    },
  })
);
