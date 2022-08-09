import { createContext, useContext, useState } from 'react';
import ConfirmationDialog, {
  ConfirmationDialogProps,
  Color,
} from './dialog-popup';

/* CONTEXT */

export interface DialogContext {
  openConfirm: (options: DialogOptions) => void;
  openAlert: (options: AlertOptions) => void;
  openMessage: (options: MessageOptions) => void;
  close: () => void;
}

const DEFAULT_CONTEXT: DialogContext = {
  openConfirm: () => null,
  openAlert: () => null,
  openMessage: () => null,
  close: () => null,
};

const DialogContext = createContext(DEFAULT_CONTEXT);

/* PROVIDER */

export type AlertOptions = Pick<
  DialogOptions,
  | 'className'
  | 'color'
  | 'element'
  | 'message'
  | 'fullScreen'
  | 'fullWidth'
  | 'maxWidth'
  | 'title'
>;

export type MessageOptions = Pick<
  DialogOptions,
  | 'className'
  | 'color'
  | 'element'
  | 'message'
  | 'fullWidth'
  | 'fullScreen'
  | 'maxWidth'
  | 'okText'
  | 'onOk'
  | 'title'
>;

export interface DialogOptions extends ConfirmationDialogProps {
  color?: Color;
}

interface DialogProviderProps {
  context?: (context: DialogContext) => void;
  children?: React.ReactNode;
}

export const DialogProvider: React.FunctionComponent<DialogProviderProps> = ({
  context,
  children,
}) => {
  const [options, setOptions] = useState<DialogOptions>({});

  const close = (onClose?: () => void) => (): void => {
    setOptions({ ...options, open: false });
    if (onClose) onClose();
  };

  const openAlert = (alertOptions: AlertOptions): void => {
    setOptions({
      ...alertOptions,
      hideOk: true,
      hideCancel: true,
      open: true,
    });
  };

  const openConfirm = ({ onClose, onOk, ...rest }: DialogOptions): void => {
    setOptions({
      ...rest,
      onOk: close(onOk),
      onClose: close(onClose),
      open: true,
    });
  };

  const openMessage = ({ onOk, ...rest }: MessageOptions): void => {
    setOptions({
      ...rest,
      hideCancel: true,
      open: true,
      onOk: close(onOk),
    });
  };

  const provider: DialogContext = {
    openConfirm,
    openAlert,
    openMessage,
    close: options.onClose ?? close(),
  };

  if (context) {
    context(provider);
  }

  return (
    <DialogContext.Provider value={provider}>
      {children}
      <ConfirmationDialog {...options} />
    </DialogContext.Provider>
  );
};

/* HOOK */

export default function useDialog(): DialogContext {
  return useContext(DialogContext);
}
