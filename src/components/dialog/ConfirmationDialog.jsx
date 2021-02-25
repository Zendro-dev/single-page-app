import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';

export default function ConfirmationDialog(props) {
  let handleOnAccept = () => {
    props.onAccept();
  };

  let handleOnReject = () => {
    props.onReject();
  };

  const handleOnClose = () => {
    props.onClose();
  };

  return (
    <div>
      <Dialog
        id="ConfirmationDialog"
        open={props.open}
        fullWidth={true}
        maxWidth="sm"
        onClose={handleOnClose}
      >
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.text}</DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* Action: Accept */}
          {props.acceptText !== null && props.acceptText !== undefined && (
            <Button
              color="primary"
              variant="contained"
              onClick={handleOnAccept}
            >
              {props.acceptText}
            </Button>
          )}

          {/* Action: Reject */}
          {props.rejectText !== null && props.rejectText !== undefined && (
            <Button
              color="secondary"
              variant="contained"
              onClick={handleOnReject}
            >
              {props.rejectText}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
