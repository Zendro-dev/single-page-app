import Snackbar from '@/components/alert/snackbar';
import { SnackbarMessage, useSnackbar, VariantType } from 'notistack';

type showSnackbar = (
  message: SnackbarMessage,
  variant: VariantType,
  errors?: unknown[]
) => void;

interface UseToastNotification {
  showSnackbar: showSnackbar;
}

export default function useToastNotification(): UseToastNotification {
  const { enqueueSnackbar } = useSnackbar();

  const showSnackbar: showSnackbar = (message, variant, errors): void => {
    enqueueSnackbar(message, {
      preventDuplicate: false,
      persist: true,
      // eslint-disable-next-line react/display-name
      content: (key) => (
        <Snackbar
          id={key}
          message={message}
          errors={errors}
          variant={variant}
        />
      ),
    });
  };

  return { showSnackbar };
}
