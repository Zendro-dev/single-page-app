import { useContext } from 'react';
import { DialogContext } from '@/components/dialog/dialog-context';

export const useDialog = (): DialogContext => {
  return useContext(DialogContext);
};
