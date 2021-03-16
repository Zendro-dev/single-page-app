import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
} from '@material-ui/core';
import {
  DEFAULT_DIALOG_OPTIONS,
  DialogOptions,
  AlertOptions,
  MessageOptions,
} from '@/types/dialog';
import { DialogContext } from '@/components/dialog/dialog-context';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const DEFAULT_OK_COLOR = 'primary';
const DEFAULT_CANCEL_COLOR = 'secondary';
const DEFAULT_OK_TEXT = 'OK';
const DEFAULT_CANCEL_TEXT = 'CANCEL';
const DEFAULT_FULL_SCREEN = false;
const DEFAULT_FULL_WIDTH = true;
const DEFAULT_MAX_WIDTH = 'xs';

interface DialogProviderProps {
  context?: (context: DialogContext) => void;
}

export const DialogProvider: React.FunctionComponent<DialogProviderProps> = ({
  context,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState(DEFAULT_DIALOG_OPTIONS);
  const {
    className,
    title,
    message,
    element,
    okColor,
    cancelColor,
    hideOk,
    hideCancel,
    okText,
    cancelText,
    onOk,
    onCancel,
    fullScreen,
    fullWidth,
    maxWidth,
  } = options;

  const classes = useStyles(options);
  const showActions = !(hideOk && hideCancel);

  const confirmHandler = (options: DialogOptions): void => {
    setOptions(options);
    setOpen(true);
  };

  const alertHandler = (options: AlertOptions): void => {
    setOptions({
      ...options,
      okColor: options.color,
      hideOk: true,
      hideCancel: true,
    });
    setOpen(true);
  };

  const messageHandler = (options: MessageOptions): void => {
    setOptions({
      ...options,
      okColor: options.color,
      hideCancel: true,
    });
    setOpen(true);
  };

  const okHandler = (): void => {
    setOpen(false);
    if (onOk) {
      onOk();
    }
  };

  const closeHandler = (): void => {
    setOpen(false);
    if (onCancel) {
      onCancel();
    }
  };

  const provider: DialogContext = {
    openConfirm: confirmHandler,
    openAlert: alertHandler,
    openMessage: messageHandler,
    close: closeHandler,
  };

  if (context) {
    context(provider);
  }

  return (
    <DialogContext.Provider value={provider}>
      {children}

      <Dialog
        fullWidth={fullWidth || DEFAULT_FULL_WIDTH}
        fullScreen={fullScreen || DEFAULT_FULL_SCREEN}
        maxWidth={maxWidth || DEFAULT_MAX_WIDTH}
        open={open}
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
        {showActions && (
          <DialogActions>
            {!hideCancel && (
              <Button
                color={cancelColor || DEFAULT_CANCEL_COLOR}
                onClick={closeHandler}
              >
                {cancelText || DEFAULT_CANCEL_TEXT}
              </Button>
            )}
            {!hideOk && (
              <Button
                color={okColor || DEFAULT_OK_COLOR}
                onClick={okHandler}
                variant="contained"
              >
                {okText || DEFAULT_OK_TEXT}
              </Button>
            )}
          </DialogActions>
        )}
      </Dialog>
    </DialogContext.Provider>
  );
};

const useStyles = makeStyles((theme) => {
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
