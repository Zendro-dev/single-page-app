import Snackbar from '@/components/alert/snackbar';
import { SnackbarMessage, useSnackbar, VariantType } from 'notistack';
import { useCallback } from 'react';

type showSnackbar = (
  message: SnackbarMessage,
  variant: VariantType,
  details?: unknown
) => void;

interface UseToastNotification {
  showSnackbar: showSnackbar;
}

export default function useToastNotification(): UseToastNotification {
  const { enqueueSnackbar } = useSnackbar();

  const showSnackbar: showSnackbar = useCallback(
    (message, variant, details): void => {
      enqueueSnackbar(message, {
        preventDuplicate: true,
        // eslint-disable-next-line react/display-name
        content: (key) => (
          <Snackbar
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
