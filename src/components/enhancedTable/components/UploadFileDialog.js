import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios'
import PropTypes from 'prop-types';
import DetailPanel from '../../detailPanel/DetailPanel'


/*
  Material-UI components
*/
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';



/*
  Styles
*/
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

export default function DeleteConfirmationDialog(props) {
  /*
    Styles
  */
  const classes = useStyles();

  /*
    Properties
  */
  const {
    modelNames,
    handleCancel,
    handleDone,
  } = props;
  
  /*
    State
  */
  const [open, setOpen] = useState(true);
  const [fileChosen, setFileChosen] = useState(false);
  const [maxSizeError, setMaxSizeError] = useState(false);

  /*
    Refs
  */
  const file = useRef(null);

  /*
    Store selectors
  */
  const graphqlServerUrl = useSelector(state => state.urls.graphqlServerUrl);
  const appMaxUploadSize = useSelector(state => state.limits.appMaxUploadSize);

  /*
    Handlers
  */

  const handleSubmit = (event) => {
    console.log('on submit: event: ', event);

    //if file selected
    if(file.current !== undefined && file.current !== null) {
      
      let formData = new FormData();
      let query = `mutation {bulkAdd${modelNames.nameCp}Csv{id}}`
      formData.append('csv_file', file.current);
      formData.append('query', query)

      /**
       * Debug
       */
      console.log("@@--##: formData: ", formData);

      //get token from local storage
      var token = localStorage.getItem('token');
      //set token on axios headers
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      //post
      axios.post(graphqlServerUrl, formData,  {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/graphql'
        }
      }).then(function(response) {
        //Check response
        if (
          response.data &&
          response.data.data
      ) {
          /**
           * Debug
           */
          console.log("@@--##: data.data: ", response.data.data);

          //update state
          setOpen(false);
          //callback
          handleDone(event);

          //done
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
    }//end: if file selected
  }//end: handleClick()

  /*
    Render
  */
  return (
    
    <Dialog 
      open={open}
      // fullWidth={true}
      // maxWidth='lg' 
      onClose={handleCancel} 
    >
      
      
      <DialogTitle>
        {'Uploading ' + modelNames.namePlCp} 
      </DialogTitle>

        <DialogContent dividers>
          <Input 
            className={classes.input} 
            type="file"
            inputProps={{
              accept: ".csv"
            }}
            onChange={(event) => {
              /*
                Debug
              */
              console.log("onChange: newValue", event.target.value);
              console.log("onChange: files", event.target.files);

              //if file chosen
              if(event.target.files.length > 0) {
                /**
                 * Debug
                 */
                console.log("onChange: maxUploadSize", appMaxUploadSize);
                console.log("onChange: files[0].size", event.target.files[0].size);

                /*
                  Check max-upload file size
                */
                if( (event.target.files[0].size / (1024*1024)) > appMaxUploadSize ) {
                  //update state
                  setMaxSizeError(true);
                  setFileChosen(true);
                  //update ref
                  file.current = null;
                }else {
                  //update state
                  setMaxSizeError(false);
                  setFileChosen(true);
                  //update ref
                  file.current = event.target.files[0];
                }
              }//end: if file chosen
              else { //file not chosen
                //update state
                setMaxSizeError(false);
                setFileChosen(false);
              }
            }}
          />

          {(maxSizeError) && (
            //error message
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
            //update state
            setOpen(false);
            //callback
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

/*
  PropTypes
*/