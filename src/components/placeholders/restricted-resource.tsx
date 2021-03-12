import React, {
  PropsWithChildren,
  ReactElement,
  useEffect,
  useMemo,
  useState,
} from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';

import Accordion, { KeyValueMap } from '@/components/accordion';

import useAuth from '@/hooks/useAuth';
import { parseUrlQuery } from '@/utils/router';
import { PathParams } from '@/types/models';

interface RestrictedResourceProps {
  info?: Record<string, string | undefined>;
  redirect?: {
    to: string;
    timer: number;
  };
}

export default function RestrictedResource(
  props: PropsWithChildren<RestrictedResourceProps>
): ReactElement {
  const classes = useStyles();

  const router = useRouter();

  const { isAllowed, redirectTimer } = useAuth({
    redirectTo: `/home`,
    redirectIfNotAllowed: true,
    redirectTimeout: 5,
  });

  const [allow, setAllow] = useState(false);
  useEffect(() => setAllow(isAllowed), [isAllowed, setAllow]);

  const resourceInfo = useMemo<KeyValueMap>(() => {
    const info = parseUrlQuery(router.query as PathParams);
    return Object.entries(info).reduce((acc, [key, value]) => {
      return Object.assign(acc, { [key]: { value } });
    }, {} as KeyValueMap);
  }, [router.query]);

  return (
    <>
      {allow ? (
        props.children
      ) : (
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
          <h1 className={classes.header}>
            Access to this resource is restricted.
          </h1>

          <Accordion
            label="Resource Information"
            text="Click to expand"
            items={resourceInfo}
          />

          <p className={classes.text}>
            <span>You will be redirected to </span>
            <span className={classes.linkText}>
              <Link href="/home">
                <a>/home</a>
              </Link>
            </span>
            <span> in </span>
            <b className={classes.timer}>{redirectTimer}</b>
            <span> seconds</span>
          </p>
        </Box>
      )}
    </>
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
    linkText: {
      color: 'rebeccapurple',
      textDecoration: 'underline',
    },
    header: {
      ...theme.typography.h2,
    },
    text: {
      color: theme.palette.text.primary,
      ...theme.typography.h5,
    },
    timer: {
      color: 'orangered',
      fontSize: theme.spacing(8),
    },
  })
);
