import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar, SnackbarContent } from 'notistack';
import {
  Collapse,
  Paper,
  Typography,
  Card,
  CardActions,
  IconButton,
} from '@material-ui/core';
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
} from '@material-ui/icons';
import { green, red, blue, orange } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
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
}));

const Snackbar = React.forwardRef((props, ref) => {
  const classes = useStyles();
  const { closeSnackbar } = useSnackbar();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleDismiss = () => {
    closeSnackbar(props.id);
  };

  const backgroundColor = clsx(
    classes.card,
    { [classes.successBackgroundColor]: props.variant === 'success' },
    { [classes.errorBackgroundColor]: props.variant === 'error' },
    { [classes.warningBackgroundColor]: props.variant === 'warning' },
    { [classes.infoBackgroundColor]: props.variant === 'info' }
  );

  const textColor = clsx(
    { [classes.successContrastColor]: props.variant === 'success' },
    { [classes.errorContrastColor]: props.variant === 'error' },
    { [classes.warningContrastColor]: props.variant === 'warning' },
    { [classes.infoContrastColor]: props.variant === 'info' }
  );

  return (
    <SnackbarContent ref={ref} className={classes.root}>
      <Card className={backgroundColor}>
        <CardActions classes={{ root: classes.actionRoot }}>
          <Typography variant="h6" className={textColor}>
            {props.message}
          </Typography>
          <div>
            {props.errors.length > 0 && (
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
            <IconButton className={classes.expand} onClick={handleDismiss}>
              <CloseIcon className={textColor} />
            </IconButton>
          </div>
        </CardActions>
        {props.errors.length > 0 && (
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Paper className={classes.collapse}>
              <Typography variant="subtitle1" gutterBottom>
                Error details:
              </Typography>
              <Typography component="pre" variant="subtitle2" gutterBottom>
                {JSON.stringify(props.errors, null, 5)}
              </Typography>
            </Paper>
          </Collapse>
        )}
      </Card>
    </SnackbarContent>
  );
});

export default Snackbar;
