import { useState, useRef } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import LinearProgress from '@material-ui/core/LinearProgress';

import useSWR from 'swr';
import { fetcherUpload } from '../../utils/fetcher';

export default function UploadDialog(props) {
  let dummyToken = localStorage.getItem('token');
  let model_name = '';
  let query = `mutation {bulkAdd${model_name} }`;
  const file = useRef(null);
  const [open, setOpen] = useState(true);
  const [fileChosen, setFileChosen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onUploadSucces = (data_d) => {
    setLoading(false);
    setOpen(false);
    file.current = null;
    props.handleDone();
  };

  const { error } = useSWR(
    loading && query ? [query, dummyToken, file] : null,
    fetcherUpload,
    { onSuccess: onUploadSucces }
  );

  const handleOnChange = (event) => {
    if (event.target.files.length > 0) {
      setFileChosen(true);
      file.current = event.target.files[0];
    }
  };

  const handleCancel = () => {};

  const handleSubmit = (event) => {
    setLoading(true);
  };

  const handleOnClose = () => {
    setOpen(false);
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
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            disabled={!fileChosen}
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
