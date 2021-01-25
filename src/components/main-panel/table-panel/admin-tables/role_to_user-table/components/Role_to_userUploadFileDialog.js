import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios'
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
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
  notiErrorActionText: {
    color: '#eba0a0',
  },
}));

export default function RoleToUserUploadFileDialog(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const {
    handleCancel,
    handleDone,
  } = props;
  const [open, setOpen] = useState(true);
  const [fileChosen, setFileChosen] = useState(false);
  const [maxSizeError, setMaxSizeError] = useState(false);
  const file = useRef(null);
  const graphqlServerUrl = useSelector(state => state.urls.graphqlServerUrl);
  const maxUploadSize = useSelector(state => state.limits.maxUploadSize);

  //debouncing & event contention
  const isUploading = useRef(false);
  const isCanceling = useRef(false);

  const actionText = useRef(null);
  const action = (key) => (
    <>
      <Button color='inherit' variant='text' size='small' className={classes.notiErrorActionText} onClick={() => { closeSnackbar(key) }}>
        {actionText.current}
      </Button>
    </>
  );

  const handleSubmit = (event) => {
    if(file.current !== undefined && file.current !== null) {

      let formData = new FormData();
      let query = 'mutation{ bulkAddRole_to_userCsv }'
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

          enqueueSnackbar( t('modelPanels.messages.msg1', "The data has been sent. A report with the status of the import process will be sent to your email."), {
            variant: 'default',
            preventDuplicate: false,
            persist: false,
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
          });
          return;

        } else {
          enqueueSnackbar( t('modelPanels.messages.msg2', "Null data received: GraphQL query returns no data."), {
            variant: 'warning',
            preventDuplicate: false,
            persist: false,
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
          });
          console.log("Warning: ", response);
          return;
        }
      })
      .catch(err => {

        //error
        actionText.current = t('modelPanels.gotIt', "Got it");
        enqueueSnackbar( t('modelPanels.errors.e1', "An error occurred while trying to execute the GraphQL query. Please contact your administrator."), {
          variant: 'error',
          preventDuplicate: false,
          persist: true,
          action,
        });
        console.log("Error: ", err);
        return;
      })
    }
  }

  return (
    <Dialog
      open={open}
      onClose={(event) => {
        if(!isCanceling.current){
          isCanceling.current = true;
          handleCancel(event);
        }
      }}
    >
      <DialogTitle>
      { t('modelPanels.uploading') + ' Role_to_users' }
        <div>
          <Typography variant="subtitle1" color='textSecondary' noWrap={true}>
          { t('modelPanels.uploadHelper') }
          </Typography>
        </div>
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
              if( (event.target.files[0].size / (1024*1024)) > maxUploadSize ) {
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
              {t('modelPanels.messages.msg3') + String(maxUploadSize) + ' MB'}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          className={classes.button}
          color="secondary"
          onClick={(event) => {
            if(!isCanceling.current){
              isCanceling.current = true;
              setOpen(false);
              handleCancel(event);
            }
          }}
        >
          { t('modelPanels.cancel') }
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          disabled={maxSizeError || !fileChosen}
          type="submit"
          onClick={(event) => {
            if(!isUploading.current){
              isUploading.current = true;
              handleSubmit(event);
            }
          }}
        >
          { t('modelPanels.upload') }
        </Button>
      </DialogActions>
    </Dialog>
  );
}
RoleToUserUploadFileDialog.propTypes = {
  handleCancel: PropTypes.func.isRequired,
  handleDone: PropTypes.func.isRequired,
};
