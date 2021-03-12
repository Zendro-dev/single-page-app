import Snackbar from '@/components/alert/snackbar';
import { SnackbarMessage, useSnackbar, VariantType } from 'notistack';

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

  const showSnackbar: showSnackbar = (message, variant, details): void => {
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
  };

  return { showSnackbar };
}
