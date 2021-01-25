import React from 'react';
import ErrorPage from './ErrorPage';
import { withStyles } from "@material-ui/core/styles";
import { metrics } from '../../configs';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
  belowToolbar: {
    paddingTop: metrics.appBar.height + 8,
  },
  noPadding: {
    padding: 0
  }
});

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error);
    console.error(errorInfo);
    this.setState({ hasError: true });
  }

  render() {
    const { classes } = this.props;
    if (this.state.hasError || this.props.test) {
      // You can render any custom fallback UI
      return <div hidden={Boolean(this.props.hidden)} className={this.props.belowToolbar ? classes.belowToolbar : classes.noPadding }>
        {(this.props.dialog) ? (
          <Dialog onClose={this.props.handleClose} open={this.props.open}>
            <ErrorPage showMessage={this.props.showMessage} />
              <DialogActions>
                <IconButton onClick={this.props.handleClose} color="primary" autoFocus>
                  <CloseIcon />
                </IconButton>
              </DialogActions>
          </Dialog> 
        ) : (
          <ErrorPage showMessage={this.props.showMessage} />
        )}
      </div>
    }

    return this.props.children; 
  }
}

export default withStyles(styles)(ErrorBoundary);