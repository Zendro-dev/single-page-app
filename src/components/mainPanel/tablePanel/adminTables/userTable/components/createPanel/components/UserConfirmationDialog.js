import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

/*
Transition
*/
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ConfirmationDialog(props) {

  /*
    Properties
  */
  const {
    open,
    title,
    text,
    acceptText,
    rejectText,
    handleAccept,
    handleReject,
  } = props

  /*
    Methods
  */
  let onAccept = async (event, ms) => {
    await new Promise(resolve => {
      //set timeout
      window.setTimeout(function() {
        if(handleAccept !== undefined) {
          handleAccept();
        }
        //resolve
        resolve("ok");
      }, ms);
    });
  };

  let onReject = async (event, ms) => {
    await new Promise(resolve => {
      //set timeout
      window.setTimeout(function() {
        if(handleReject !== undefined) {
          handleReject();
        }
        //resolve
        resolve("ok");
      }, ms);
    });
  };

  /*
    Render
  */
  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={(event) => {
          if(handleReject !== undefined) {
            handleReject(event);
          }
        }}
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
              color="primary" 
              onClick={(event) => onAccept(event, 400)} 
            >
              {acceptText}
            </Button>
          }

          {/* Action: Reject */}
          {(rejectText !== '' && acceptText !== null && acceptText !== undefined) &&
            
            <Button
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