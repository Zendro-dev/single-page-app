import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { ReactElement } from 'react';

export interface Content {
  title: string | null;
  text?: string | null;
  acceptText: string | null;
  rejectText: string | null;
}

interface ConfirmationDialogProps {
  content: Content;
  onAccept: () => void;
  onReject: () => void;
  onClose: () => void;
  open: boolean;
}

export default function ConfirmationDialog({
  content,
  onAccept,
  onReject,
  onClose,
  open,
}: ConfirmationDialogProps): ReactElement {
  const handleOnAccept = (): void => {
    onAccept();
  };

  const handleOnReject = (): void => {
    onReject();
  };

  const handleOnClose = (): void => {
    onClose();
  };

  return (
    <div>
      <Dialog
        id="ConfirmationDialog"
        open={open}
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
