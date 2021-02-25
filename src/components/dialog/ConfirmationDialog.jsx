import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';

export default function ConfirmationDialog(props) {
  const classes = useStyles();
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
        <DialogTitle className={props.warning ? classes.warning : undefined}>
          {props.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            className={props.warning ? classes.warning : undefined}
          >
            {props.text}
          </DialogContentText>
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

const useStyles = makeStyles((theme) =>
  createStyles({
    warning: {
      color: 'red',
    },
  })
);
