import * as React from 'react';
import { DialogOptions, AlertOptions, MessageOptions } from '@/types/dialog';

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

export const DialogContext = React.createContext(DEFAULT_CONTEXT);
