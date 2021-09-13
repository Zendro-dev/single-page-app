import React, { PropsWithChildren, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import { Lock as LockIcon } from '@mui/icons-material';

interface FormHeaderProps {
  locked?: boolean;
  prefix?: string;
  title: string;
  subtitle?: string;
}

export default function FormHeader({
  locked,
  prefix,
  subtitle,
  title,
  ...props
}: PropsWithChildren<FormHeaderProps>): ReactElement {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <legend className={classes.legend}>
      <div>
        <h1>
          {locked && (
            <Tooltip title={t('record-form.read-only') ?? ''}>
              <LockIcon color="secondary" />
            </Tooltip>
          )}
          <span>
            {prefix && <span className={classes.titlePrefix}>{prefix}</span>}
            <span className={classes.title}>{title}</span>
          </span>
        </h1>

        <h2>{subtitle}</h2>
      </div>

      <section aria-label="additional-form-info">{props.children}</section>
    </legend>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    legend: {
      // Layout
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',

      [theme.breakpoints.only('md')]: {
        flexDirection: 'row',
        alignItems: 'start',
        justifyContent: 'space-between',
      },

      [theme.breakpoints.up('lg')]: {
        alignItems: 'start',
      },

      // Spacing
      margin: theme.spacing(5, 0, 6, 0),
      [theme.breakpoints.up('md')]: {
        margin: theme.spacing(5, 9.5, 6, 9.5),
      },

      // Title
      '& > div': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        [theme.breakpoints.up('md')]: {
          alignItems: 'start',
        },

        '& > h1': {
          ...theme.typography.h6,
          margin: theme.spacing(0, 0, 2, 0),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',

          [theme.breakpoints.up('md')]: {
            flexDirection: 'row',
          },

          '& > svg': {
            marginRight: theme.spacing(2),
          },
        },

        '& > h2': {
          ...theme.typography.subtitle1,
          margin: theme.spacing(0, 0, 0, 0),
          color: theme.palette.text.secondary,
        },
      },

      // Custom info
      '& > section': {
        margin: theme.spacing(4, 0, 0, 0),
        [theme.breakpoints.up('lg')]: {
          margin: theme.spacing(4, 0, 0, 0),
        },
      },
    },
    titlePrefix: {
      ...theme.typography.h6,
      color: 'GrayText',
      fontWeight: 'bold',
      textTransform: 'capitalize',
      marginRight: theme.spacing(2),
    },
    title: {
      fontWeight: 'bold',
    },
  })
);
