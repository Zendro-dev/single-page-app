import React, {
  PropsWithChildren,
  ReactElement,
  useEffect,
  useState,
} from 'react';
import Link from 'next/link';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/router';
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
  const info = parseUrlQuery(router.query as PathParams);

  const { isAllowed, redirectTimer } = useAuth({
    redirectTo: `/${info.model}`,
    redirectIfNotAllowed: true,
    redirectTimeout: 5,
  });

  const [allow, setAllow] = useState(false);
  useEffect(() => setAllow(isAllowed), [isAllowed, setAllow]);

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
          <Typography component="h1" variant="h2">
            Access to this resource is restricted.
          </Typography>

          {info &&
            Object.entries(info).map(([key, value]) => (
              <Typography component="span" key={key}>
                {value}
              </Typography>
            ))}

          <Typography component="div" variant="h5">
            <p>
              <span>You will be redirected to </span>
              <span className={classes.linkText}>
                <Link href="/home">
                  <a>home</a>
                </Link>
              </span>
              <span> in {redirectTimer} seconds</span>
            </p>
          </Typography>
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
      textDecoration: 'underline',
    },
  })
);
