import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios'
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  input: {
    margin: theme.spacing(1),
    width: 500
  },
  text: {
    margin: theme.spacing(1),
    maxWidth: 500
  },
}));

export default function UserUploadFileDialog(props) {
  const classes = useStyles();
  const {
    handleCancel,
    handleDone,
  } = props;
  const [open, setOpen] = useState(true);
  const [fileChosen, setFileChosen] = useState(false);
  const [maxSizeError, setMaxSizeError] = useState(false);
  const file = useRef(null);
  const graphqlServerUrl = useSelector(state => state.urls.graphqlServerUrl);
  const appMaxUploadSize = useSelector(state => state.limits.appMaxUploadSize);

  const handleSubmit = (event) => {
    if(file.current !== undefined && file.current !== null) {
      
      let formData = new FormData();
      let query = 'mutation{ bulkAddUserCsv{ id } }'
      formData.append('csv_file', file.current);
      formData.append('query', query)

      var token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      
      axios.post(graphqlServerUrl, formData,  {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/graphql'
        }
      }).then(function(response) {
        if (
          response.data &&
          response.data.data
      ) {
          setOpen(false);
          handleDone(event);
          return;

        } else {
          
          //error
          console.log("error1");

          //done
          return;
        }
      })
      .catch(err => {

        //error
        console.log("error2");

        //done
        return;
      })
    }
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleCancel} 
    >
      <DialogTitle>
        Uploading Users
      </DialogTitle>

      <DialogContent dividers>
        <Input 
          className={classes.input} 
          type="file"
          inputProps={{
            accept: ".csv"
          }}
          onChange={(event) => {
            if(event.target.files.length > 0) {
              if( (event.target.files[0].size / (1024*1024)) > appMaxUploadSize ) {
                setMaxSizeError(true);
                setFileChosen(true);
                file.current = null;
              }else {
                setMaxSizeError(false);
                setFileChosen(true);
                file.current = event.target.files[0];
              }
            }
            else {
              setMaxSizeError(false);
              setFileChosen(false);
            }
          }}
        />

        {(maxSizeError) && (
          <Typography className={classes.text} color="secondary" variant="overline">
              {'File exceeds limit of ' + String(appMaxUploadSize) + ' MB'}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button 
          className={classes.button}
          onClick={handleCancel}
          color="secondary"
          onClick={(event) => {
            setOpen(false);
            handleCancel(event);
          }}
        >
          CANCEL
        </Button>
        <Button 
          className={classes.button}
          variant="contained" 
          color="primary"
          disabled={maxSizeError || !fileChosen}
          type="submit"
          onClick={(event) => {
            handleSubmit(event);
          }}
        >
          UPLOAD
        </Button>
      </DialogActions>
    </Dialog>
  );
}
UserUploadFileDialog.propTypes = {
  handleCancel: PropTypes.func.isRequired,
  handleDone: PropTypes.func.isRequired,
};
