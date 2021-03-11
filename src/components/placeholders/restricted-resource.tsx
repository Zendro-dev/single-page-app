import React, { PropsWithChildren, ReactElement } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
import { isNullorUndefined } from '@/utils/validation';

interface RestrictedResourceProps {
  title: string;
  timer?: number;
}

export default function RestrictedResource({
  title,
  timer,
  ...props
}: PropsWithChildren<RestrictedResourceProps>): ReactElement {
  const classes = useStyles();
  return (
    <Box
      className={classes.root}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      marginTop="10rem"
      paddingY="2rem"
      paddingX="2rem"
    >
      <Typography component="h1" variant="h1">
        {title}
      </Typography>
      <Typography variant="h4" component="p">
        Access to this resource is restricted.
        {!isNullorUndefined(timer)
          ? ` You will be redirected in ${timer} seconds`
          : ''}
      </Typography>
      {props.children}
    </Box>
  );
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid',
      borderColor: 'orangered',
      color: 'orangered',
      boxShadow: theme.shadows[1],
    },
  })
);
