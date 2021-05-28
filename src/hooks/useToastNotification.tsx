import ToastAlert from '@/components/toast-alert';
import { SnackbarMessage, useSnackbar, VariantType } from 'notistack';
import { useCallback } from 'react';

type showNotification = (
  message: SnackbarMessage,
  variant: VariantType,
  details?: unknown
) => void;

interface UseToastNotification {
  showSnackbar: showNotification;
}

export default function useToastNotification(): UseToastNotification {
  const { enqueueSnackbar } = useSnackbar();

  const showSnackbar: showNotification = useCallback(
    (message, variant, details): void => {
      enqueueSnackbar(message, {
        preventDuplicate: true,
        // eslint-disable-next-line react/display-name
        content: (key) => (
          <ToastAlert
            id={key}
            message={message}
            details={details}
            variant={variant}
          />
        ),
      });
    },
    [enqueueSnackbar]
  );

  return { showSnackbar };
}
