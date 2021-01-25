import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function UserConfirmationDialog(props) {

  const {
    open,
    title,
    text,
    acceptText,
    rejectText,
    handleAccept,
    handleReject,
  } = props

  let onAccept = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        if(handleAccept !== undefined) {
          handleAccept();
        }
        resolve("ok");
      }, ms);
    });
  };

  let onReject = async (event, ms) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        if(handleReject !== undefined) {
          handleReject();
        }
        resolve("ok");
      }, ms);
    });
  };

  return (
    <div>
      <Dialog id='UserConfirmationDialog-create'
        open={open}
        TransitionComponent={Transition}
        keepMounted
        fullWidth={true}
        maxWidth='sm'
        onClose={(event) => onReject(event, 400)}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          
          {/* Action: Accept */}
          {(acceptText !== '' && acceptText !== null && acceptText !== undefined) &&
            <Button
              id='UserConfirmationDialog-create-button-accept'
              color="primary"
              variant='contained'
              onClick={(event) => onAccept(event, 400)} 
            >
              {acceptText}
            </Button>
          }

          {/* Action: Reject */}
          {(rejectText !== '' && acceptText !== null && acceptText !== undefined) &&
            
            <Button
              id='UserConfirmationDialog-create-button-reject'
              color="primary" 
              onClick={(event) => onReject(event, 400)} 
            >
              {rejectText}
            </Button>
          }

        </DialogActions>
      </Dialog>
    </div>
  );
}
UserConfirmationDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  acceptText: PropTypes.string.isRequired,
  rejectText: PropTypes.string.isRequired,
  handleAccept: PropTypes.func.isRequired,
  handleReject: PropTypes.func.isRequired,
};