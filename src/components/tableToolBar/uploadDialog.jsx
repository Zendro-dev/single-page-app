import { useEffect, useState, useRef, useCallback } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import LinearProgress from '@material-ui/core/LinearProgress';
import useUploadFile from '../../hooks/useUploadFile.jsx';

function UploadingFile(props) {
  let dummyToken = localStorage.getItem('token');
  const { data, error } = useUploadFile({
    model_name: props.model_name,
    token: dummyToken,
    file: props.file,
  });

  useEffect(() => {
    if (data) {
      props.handleFileUploaded();
    }
  }, [data]); //[data, error]);
  return <LinearProgress />;
}

export default function UploadDialog(props) {
  const [open, setOpen] = useState(true);
  const [fileChosen, setFileChosen] = useState(false);
  const [loading, setLoading] = useState(false);
  const file = useRef(null);

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

  const handleFileUploaded = () => {
    setLoading(false);
    file.current = null;
    setOpen(false);
    props.handleDone();
  };

  const handleOnClose = () => {
    setOpen(false);
  };
  const dummy_model_name = 'User';

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
        {loading && (
          <UploadingFile
            file={file.current}
            model_name={dummy_model_name}
            handleFileUploaded={handleFileUploaded}
          />
        )}
      </Dialog>
    </>
  );
}
