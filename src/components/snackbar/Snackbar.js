import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
import orange from '@material-ui/core/colors/orange';

const useStyles = makeStyles(theme => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    flexGrow: 1,
    [theme.breakpoints.up('sm')]: {
      flexGrow: 'initial',
      minWidth: 344,
    },
  },
  typography: {
    fontWeight: 'bold',
  },
  actionRoot: {
    padding: '8px 8px 8px 16px',
  },
  icons: {
    marginLeft: 'auto',
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
  collapseTypographyTitle: {
    fontWeight: 'bold',
  },
  actionIcon: {
    leftPadding: theme.spacing(1),
  },
  button: {
    padding: 0,
    textTransform: 'none',
  },
  successColor:{
    color: green[600],
  },
  errorColor:{
    color: red[700],
  },
  warningColor: {
    color: orange[500],
  },
  infoColor: {
    color: blue[500],
  },
  successBackgroundColor:{
    backgroundColor: green[600],
  },
  errorBackgroundColor:{
    backgroundColor: red[700],
  },
  warningBackgroundColor: {
    backgroundColor: orange[500],
  },
  infoBackgroundColor: {
    backgroundColor: blue[500],
  },
  successContrastColor:{
    color: theme.palette.getContrastText(green[600]),
  },
  errorContrastColor:{
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
  const {id, message, variant, errors} = props
  const { t } = useTranslation();
  const { closeSnackbar } = useSnackbar();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleDismiss = () => {
    closeSnackbar(id);
  };

  return (
    <Card ref={ref} className={classnames(classes.card, 
    {[classes.successBackgroundColor]: variant==='success'},
    {[classes.errorBackgroundColor]: variant==='error'},
    {[classes.warningBackgroundColor]: variant==='warning'},
    {[classes.infoBackgroundColor]: variant==='info'},
    )} >
      <CardActions classes={{ root: classes.actionRoot }}>
        <Typography variant="subtitle2" className={classnames(classes.typography,
        {[classes.successContrastColor]: variant==='success'},
        {[classes.errorContrastColor]: variant==='error'},
        {[classes.warningContrastColor]: variant==='warning'},
        {[classes.infoContrastColor]: variant==='info'},
        )}>{message}</Typography>
        <div className={classes.icons}>
          <IconButton
            aria-label="Show more"
            className={classnames(classes.expand, { [classes.expandOpen]: expanded })}
            onClick={handleExpandClick}
          >
            <ExpandMoreIcon className={classnames(classes.actionIcon,
            {[classes.successContrastColor]: variant==='success'},
            {[classes.errorContrastColor]: variant==='error'},
            {[classes.warningContrastColor]: variant==='warning'},
            {[classes.infoContrastColor]: variant==='info'},
            )}/>
          </IconButton>
          <IconButton className={classes.expand} onClick={handleDismiss}>
            <CloseIcon className={classnames(classes.actionIcon,
            {[classes.successContrastColor]: variant==='success'},
            {[classes.errorContrastColor]: variant==='error'},
            {[classes.warningContrastColor]: variant==='warning'},
            {[classes.infoContrastColor]: variant==='info'},
            )}/>
          </IconButton>
        </div>
      </CardActions>
      {(errors) ? (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Paper className={classes.collapse}>
            <Typography className={classes.collapseTypographyTitle} component='pre' 
            variant="caption" gutterBottom>{t('modelPanels.errors.details',"Error details:")}</Typography>
            <Typography component='pre' variant="caption" gutterBottom>
              {JSON.stringify(errors, null, 5)}</Typography>
          </Paper>
        </Collapse>
      ):(
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Paper className={classes.collapse}>
            <Typography gutterBottom>{t('modelPanels.errors.noDetails',"No details.")}</Typography>
          </Paper>
        </Collapse>
      )}
    </Card>
  );
});

Snackbar.propTypes = {
  id: PropTypes.number.isRequired,
};

export default Snackbar;