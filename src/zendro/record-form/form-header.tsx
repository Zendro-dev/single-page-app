import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Box, Tooltip, Typography } from '@material-ui/core';
import { Lock as LockIcon } from '@material-ui/icons';

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
}: FormHeaderProps): ReactElement {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Box
      component="legend"
      display="flex"
      justifyContent="space-between"
      marginX={9.5}
      mb={6}
    >
      <Box display="flex" alignItems="center">
        {locked && (
          <Tooltip title={t('record-form.read-only')}>
            <LockIcon color="secondary" className={classes.lockedFormIcon} />
          </Tooltip>
        )}

        <Typography variant="h6" component="h1">
          {prefix && <span className={classes.titlePrefix}>{prefix}</span>}
          <span className={classes.title}>{title}</span>
        </Typography>
      </Box>

      <Typography variant="subtitle1" color="textSecondary">
        {subtitle}
      </Typography>
    </Box>
  );
}

const useStyles = makeStyles((theme) =>
  createStyles({
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
    lockedFormIcon: {
      marginRight: theme.spacing(2),
    },
  })
);
