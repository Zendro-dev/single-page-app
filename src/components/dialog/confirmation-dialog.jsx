import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';

export default function ConfirmationDialog({ content, ...props }) {
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
        <DialogTitle>{content.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{content.text}</DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* Action: Accept */}
          {content.acceptText !== null && content.acceptText !== undefined && (
            <Button
              color="primary"
              variant="contained"
              onClick={handleOnAccept}
            >
              {content.acceptText}
            </Button>
          )}

          {/* Action: Reject */}
          {content.rejectText !== null && content.rejectText !== undefined && (
            <Button
              color="secondary"
              variant="contained"
              onClick={handleOnReject}
            >
              {content.rejectText}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
