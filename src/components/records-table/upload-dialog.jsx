import { useMemo, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
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
import { authSelector } from '@/store/auth-slice';
import useSWR from 'swr';
import { requestOne } from '@/utils/requests';
import { queryBulkCreate } from '@/utils/queries';

export default function UploadDialog(props) {
  const file = useRef(null);
  const auth = useSelector(authSelector);
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
    console.log('DATA: ', data);
    handleOnClose();
  };

  const onUploadError = (error) => {
    //send error message to user
    console.log('ERROR: ', error);
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
          request,
          undefined,
          {
            csv_file: file.current,
          },
        ]
      : null,
    requestOne,
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
