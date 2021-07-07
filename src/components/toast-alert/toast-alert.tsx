import React, { useState, forwardRef } from 'react';
import clsx from 'clsx';
import { Theme } from '@material-ui/core/styles';
import { createStyles, makeStyles } from '@material-ui/styles';
import {
  useSnackbar,
  SnackbarContent,
  SnackbarKey,
  VariantType,
  SnackbarMessage,
} from 'notistack5';
import {
  Collapse,
  Paper,
  Typography,
  Card,
  CardActions,
  IconButton,
  Box,
} from '@material-ui/core';
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
} from '@material-ui/icons';
import { green, red, blue, orange } from '@material-ui/core/colors';

export interface AlertToastProps {
  id: SnackbarKey;
  variant: VariantType;
  message: SnackbarMessage;
  details?: unknown;
}

const toast = forwardRef<HTMLDivElement, AlertToastProps>(
  ({ id, variant, message, details }, ref) => {
    const classes = useStyles();
    const { closeSnackbar } = useSnackbar();
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = (): void => {
      setExpanded(!expanded);
    };

    const handleDismiss = (): void => {
      closeSnackbar(id);
    };

    const backgroundColor = clsx(
      classes.card,
      { [classes.successBackgroundColor]: variant === 'success' },
      { [classes.errorBackgroundColor]: variant === 'error' },
      { [classes.warningBackgroundColor]: variant === 'warning' },
      { [classes.infoBackgroundColor]: variant === 'info' }
    );

    const textColor = clsx(
      { [classes.successContrastColor]: variant === 'success' },
      { [classes.errorContrastColor]: variant === 'error' },
      { [classes.warningContrastColor]: variant === 'warning' },
      { [classes.infoContrastColor]: variant === 'info' }
    );

    return (
      <SnackbarContent ref={ref} className={classes.root}>
        <Card className={backgroundColor}>
          <CardActions classes={{ root: classes.actionRoot }}>
            <Box display="flex" alignItems="center">
              {details && (
                <IconButton
                  aria-label="Show more"
                  className={clsx(classes.expand, {
                    [classes.expandOpen]: expanded,
                  })}
                  onClick={handleExpandClick}
                >
                  <ExpandMoreIcon className={textColor} />
                </IconButton>
              )}
              <Typography
                fontWeight="bold"
                className={textColor}
                component="span"
              >
                {message}
              </Typography>
            </Box>
            <IconButton className={classes.expand} onClick={handleDismiss}>
              <CloseIcon className={textColor} />
            </IconButton>
          </CardActions>
          {details && (
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <Paper className={classes.collapse}>
                <Typography variant="subtitle1" gutterBottom>
                  Error details:
                </Typography>
                <Typography component="pre" variant="subtitle2" gutterBottom>
                  {JSON.stringify(details, null, 5)}
                </Typography>
              </Paper>
            </Collapse>
          )}
        </Card>
      </SnackbarContent>
    );
  }
);

export default toast;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      [theme.breakpoints.up('sm')]: {
        minWidth: '344px !important',
      },
    },
    card: {
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
      flexGrow: 1,
    },
    actionRoot: {
      padding: '8px 8px 8px 16px',
      justifyContent: 'space-between',
      display: 'flex',
      width: '100%',
    },
    expand: {
      padding: '8px 8px',
      transform: 'rotate(0deg)',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    collapse: {
      padding: 16,
      maxWidth: '80vw',
      minWidth: 344,
      maxHeight: '80vh',
      minHeight: 344,
      overflow: 'auto',
    },
    successBackgroundColor: {
      backgroundColor: green[600],
    },
    errorBackgroundColor: {
      backgroundColor: red[700],
    },
    warningBackgroundColor: {
      backgroundColor: orange[500],
    },
    infoBackgroundColor: {
      backgroundColor: blue[500],
    },
    successContrastColor: {
      color: theme.palette.getContrastText(green[600]),
    },
    errorContrastColor: {
      color: theme.palette.getContrastText(red[700]),
    },
    warningContrastColor: {
      color: theme.palette.getContrastText(orange[500]),
    },
    infoContrastColor: {
      color: theme.palette.getContrastText(blue[500]),
    },
  })
);
