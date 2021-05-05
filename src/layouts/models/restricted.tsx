import { useRouter } from 'next/router';
import React, {
  PropsWithChildren,
  ReactElement,
  useLayoutEffect,
  useState,
} from 'react';
import { Box } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { InfoOutlined as InfoIcon } from '@material-ui/icons';
import { useModel } from '@/hooks';
import { RecordUrlQuery } from '@/types/routes';

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
  const urlQuery = router.query as Partial<RecordUrlQuery>;
  const getModel = useModel();
  const classes = useStyles();

  const [allowed, setAllowed] = useState(false);

  useLayoutEffect(
    function checkResourcePermissions() {
      if (urlQuery.model) {
        const model = getModel(urlQuery.model);
        if (model.permissions.read) setAllowed(true);
      } else {
        setAllowed(true);
      }
    },
    [getModel, urlQuery]
  );

  return (
    <>
      {allowed ? (
        props.children
      ) : (
        <Box
          display="flex"
          width="100%"
          height="100%"
          flexDirection="column"
          alignItems="center"
          padding={4}
        >
          <Box className={classes.card}>
            <InfoIcon />
            <Box>
              <h1>Access to this page is restricted.</h1>
              <p>
                It appears you do not have sufficient permissions to access this
                page. If you think this is a mistake, please contact your
                administrator.
              </p>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}

const useStyles = makeStyles((theme) =>
  createStyles({
    card: {
      // Layout
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',

      // Layout : larger viewport
      [theme.breakpoints.up('sm')]: {
        flexDirection: 'row',
        alignItems: 'start',
      },

      // Spacing
      marginTop: theme.spacing(8),
      padding: theme.spacing(6),

      // Background & border styles
      backgroundColor: theme.color.blue[50],
      border: '2px solid',
      borderColor: theme.color.blue[500],
      borderRadius: 10,

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
        fontSize: theme.spacing(6),
        color: theme.palette.primary.dark,
      },

      // Message
      '& p': {
        color: theme.palette.primary.main,
        margin: theme.spacing(2, 0, 0, 0),
      },

      // Icon
      '& svg': {
        color: theme.palette.primary.main,
        width: theme.spacing(10),
        height: theme.spacing(10),
      },
    },
  })
);
