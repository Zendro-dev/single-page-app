import { ReactElement } from 'react';
import clsx from 'clsx';
import { Theme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import {
  Box,
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  Divider,
} from '@mui/material';

const DEFAULT_OK_COLOR = 'primary';
const DEFAULT_CANCEL_COLOR = 'secondary';
const DEFAULT_OK_TEXT = 'OK';
const DEFAULT_CANCEL_TEXT = 'CANCEL';
const DEFAULT_FULL_SCREEN = false;
const DEFAULT_FULL_WIDTH = true;
const DEFAULT_MAX_WIDTH = 'xs';

export type Color = ButtonProps['color'];

export interface ConfirmationDialogProps {
  className?: string;
  cancelColor?: Color;
  cancelText?: string;
  element?: ReactElement;
  hideOk?: boolean;
  hideCancel?: boolean;
  fullWidth?: boolean;
  fullScreen?: boolean;
  maxWidth?: DialogProps['maxWidth'];
  message?: string;
  okColor?: Color;
  okText?: string;
  onClose?: () => void;
  onOk?: () => void;
  open?: boolean;
  title?: string;
}

export default function ConfirmationDialog({
  cancelColor,
  cancelText,
  className,
  element,
  fullScreen,
  fullWidth,
  hideOk,
  hideCancel,
  maxWidth,
  message,
  okText,
  okColor,
  onClose,
  onOk,
  open,
  title,
}: ConfirmationDialogProps): ReactElement {
  const classes = useStyles();

  return (
    <Dialog
      fullWidth={fullWidth || DEFAULT_FULL_WIDTH}
      fullScreen={fullScreen || DEFAULT_FULL_SCREEN}
      maxWidth={maxWidth || DEFAULT_MAX_WIDTH}
      open={open ?? false}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      {title && (
        <DialogTitle
          id="dialog-title"
          className={
            okColor === 'primary'
              ? classes.titleBackgroundPrimary
              : okColor === 'secondary'
              ? classes.titleBackgroundSecondary
              : classes.titleBackgroundPrimary
          }
        >
          {title}
        </DialogTitle>
      )}
      {message && (
        <DialogContent className={clsx(classes.content, className)}>
          <DialogContentText id="confirm-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
      )}
      {element && (
        <Box className={clsx(classes.content, className)}>{element}</Box>
      )}
      <Divider />
      {!(hideOk && hideCancel) && (
        <DialogActions>
          {!hideCancel && (
            <Button
              color={cancelColor || DEFAULT_CANCEL_COLOR}
              onClick={onClose}
              data-cy="dialog-cancel"
            >
              {cancelText || DEFAULT_CANCEL_TEXT}
            </Button>
          )}
          {!hideOk && (
            <Button
              color={okColor || DEFAULT_OK_COLOR}
              onClick={onOk}
              variant="contained"
              data-cy="dialog-ok"
            >
              {okText || DEFAULT_OK_TEXT}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
}

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    content: {
      minHeight: theme.spacing(30),
    },
    titleBackgroundPrimary: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.getContrastText(theme.palette.primary.main),
    },
    titleBackgroundSecondary: {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.getContrastText(theme.palette.secondary.main),
    },
  });
});
