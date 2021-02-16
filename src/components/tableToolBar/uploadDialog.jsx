import { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';

export default function UploadDialog() {
  const [open, setOpen] = useState(true);
  const [fileChosen, setFileChosen] = useState(false);

  const handleSubmit = (event) => {
    if (file.current !== undefined && file.current !== null) {
      let formData = new FormData();
      let query = 'mutation{ bulkAddNo_assocCsv }';
      formData.append('csv_file', file.current);
      formData.append('query', query);

      var token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;

      axios
        .post(graphqlServerUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/graphql',
          },
        })
        .then(function (response) {
          if (response.data && response.data.data) {
            setOpen(false);
            //handleDone(event);
            return;
          } else {
            console.log('Warning: ', response);
            return;
          }
        })
        .catch((err) => {
          console.log('Error: ', err);
          return;
        });
    }
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog}>
      <DialogTitle> Upload csv file </DialogTitle>
      <DialogContent>
        <Input
          type="file"
          inputPropos={{ accept: '.csv' }}
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
    </Dialog>
  );
}
