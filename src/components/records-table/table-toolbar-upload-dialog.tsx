import { useState, useRef, ReactElement, ChangeEventHandler } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Input,
  LinearProgress,
  Typography,
} from '@material-ui/core';
import { MAX_UPLOAD_SIZE } from '@/config/globals';
import { graphqlRequest } from '@/utils/requests';
import { queryBulkCreate } from '@/utils/queries';
import useAuth from '@/hooks/useAuth';
import useToastNotification from '@/hooks/useToastNotification';

interface UploadDialogProps {
  modelName: string;
  handleDone: () => void;
}

export default function UploadDialog({
  modelName,
  handleDone,
}: UploadDialogProps): ReactElement {
  const { auth } = useAuth();
  const { showSnackbar } = useToastNotification();
  const [open, setOpen] = useState(true);
  const [fileChosen, setFileChosen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [limitExceeded, setLimitExceeded] = useState(false);

  const file = useRef<File | null>(null);

  const handleOnClose = (): void => {
    file.current = null;
    setLoading(false);
    setOpen(false);
    handleDone();
  };

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ): void => {
    setLimitExceeded(false);
    if (event.target.files && event.target.files.length > 0) {
      if (event.target.files[0].size / (1024 * 1024) > MAX_UPLOAD_SIZE) {
        setLimitExceeded(true);
      } else {
        setFileChosen(true);
        file.current = event.target.files[0];
      }
    }
  };

  const handleSubmit = async (): Promise<void> => {
    setLoading(true);
    try {
      if (auth.user?.token) {
        await graphqlRequest(
          auth.user.token,
          queryBulkCreate(modelName).query,
          null,
          {
            csv_file: file.current,
          }
        );
        showSnackbar(
          'The data has been sent. A report with the status of the import process will be sent to your email.',
          'success'
        );
      }
      // ? Null data received ?
    } catch (error) {
      showSnackbar(
        'An error occurred while trying to execute the GraphQL query. Please contact your administrator.',
        'error',
        error
      );
    }
    handleOnClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleOnClose}>
        <DialogTitle> Upload csv file </DialogTitle>
        <DialogContent>
          <Input
            type="file"
            inputProps={{ accept: '.csv' }}
            onChange={handleOnChange}
          />
          {limitExceeded && (
            <Typography color="secondary" variant="overline">
              {'File exceeds ' + String(MAX_UPLOAD_SIZE) + ' MB'}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button color="secondary" disabled={loading} onClick={handleOnClose}>
            Cancel
          </Button>
          <Button
            disabled={!fileChosen || loading}
            type="submit"
            color="primary"
            onClick={handleSubmit}
          >
            Upload
          </Button>
        </DialogActions>
        {loading && <LinearProgress />}
      </Dialog>
    </>
  );
}
