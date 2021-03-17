import { useMemo, useState, useRef } from 'react';
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
import useSWR from 'swr';
import { graphqlRequest } from '@/utils/requests';
import { queryBulkCreate } from '@/utils/queries';
import useAuth from '@/hooks/useAuth';
import useToastNotification from '@/hooks/useToastNotification';
import { isNullorEmpty } from '@/utils/validation';

export default function UploadDialog(props) {
  const file = useRef(null);
  const { auth } = useAuth();
  const { showSnackbar } = useToastNotification();
  const [open, setOpen] = useState(true);
  const [fileChosen, setFileChosen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [limitExceeded, setLimitExceeded] = useState(false);

  const request = useMemo(() => {
    return queryBulkCreate(props.modelName);
  }, [props.modelName]);

  const handleOnClose = () => {
    file.current = null;
    setLoading(false);
    setOpen(false);
    props.handleDone();
  };

  const onUploadSucces = (data) => {
    //send message to user

    if (!isNullorEmpty(data)) {
      showSnackbar(
        'The data has been sent. A report with the status of the import process will be sent to your email.',
        'success'
      );
    } else {
      showSnackbar(
        'Null data received: GraphQL query returns no data.',
        'warning'
      );
    }

    handleOnClose();
  };

  const onUploadError = (error) => {
    //send error message to user
    console.error(error);
    showSnackbar(
      'An error occurred while trying to execute the GraphQL query. Please contact your administrator.',
      'error'
    );
    handleOnClose();
  };

  const handleOnChange = (event) => {
    setLimitExceeded(false);
    if (event.target.files.length > 0) {
      if (event.target.files[0].size / (1024 * 1024) > MAX_UPLOAD_SIZE) {
        setLimitExceeded(true);
      } else {
        setFileChosen(true);
        file.current = event.target.files[0];
      }
    }
  };

  const handleSubmit = () => {
    setLoading(true);
  };

  useSWR(
    loading
      ? [
          auth.user.token,
          request.query,
          null,
          {
            csv_file: file.current,
          },
        ]
      : null,
    graphqlRequest,
    { onSuccess: onUploadSucces, onError: onUploadError }
  );

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
