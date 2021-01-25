import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useSelector , useDispatch } from 'react-redux';
import { modelChange, changesCompleted } from '../../../../../../../../../../../store/actions'
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../../../../../snackbar/Snackbar';
import { loadApi } from '../../../../../../../../../../../requests/requests.index'
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const useStyles = makeStyles(theme => ({
  textField: {
    margin: 'auto',
  },
  actionButton: {
    margin: theme.spacing(1),
  },
}));

export default function PasswordField(props) {
  const classes = useStyles();
  const {
    itemId,
    itemKey,
    name,
    label,
    text,
    valueOk,
    autoFocus
  } = props;
  const { t } = useTranslation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const lastFetchTime = useRef(Date.now());

  const [value, setValue] = useState((text !== undefined && typeof text === 'string' ) ? text : '');
  const [showPassword, setShowPassword] = useState(false);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);

  //dialog state & refs
  const [newPasswordHelper, setNewPasswordHelper] = useState('');
  const [newPasswordHelper2, setNewPasswordHelper2] = useState('');
  const [newPasswordWarningText, setNewPasswordWarningText] = useState('');
  const newPasswordText = useRef('');
  const newPasswordText2 = useRef('');
  const isChangingPassword = useRef(false);

  //selectors
  const graphqlServerUrl = useSelector(state => state.urls.graphqlServerUrl);
  const lastModelChanged = useSelector(state => state.changes.lastModelChanged);
  const lastChangeTimestamp = useSelector(state => state.changes.lastChangeTimestamp);

  //snackbar
  const variant = useRef('info');
  const errors = useRef([]);
  const content = useRef((key, message) => (
    <Snackbar id={key} message={message} errors={errors.current}
    variant={variant.current} />
  ));
  const actionText = useRef(t('modelPanels.gotIt', "Got it"));
  const action = useRef((key) => (
    <>
      <Button color='inherit' variant='text' size='small' 
      onClick={() => { closeSnackbar(key) }}>
        {actionText.current}
      </Button>
    </> 
  ));

  /**
    * Callbacks:
    *  showMessage
    */

   /**
    * showMessage
    * 
    * Show the given message in a notistack snackbar.
    * 
    */
   const showMessage = useCallback((message, withDetail) => {
    enqueueSnackbar( message, {
      variant: variant.current,
      preventDuplicate: false,
      persist: true,
      action: !withDetail ? action.current : undefined,
      content: withDetail ? content.current : undefined,
    });
  },[enqueueSnackbar]);

  /**
   * Effects
   */
  useEffect(() => {
    /*
     * Handle changes 
     */
    
    /*
     * Checks
     */
    if(!lastModelChanged) {
      return;
    }
    if(!lastChangeTimestamp || !lastFetchTime.current) {
      return;
    }
    let isNewChange = (lastFetchTime.current<lastChangeTimestamp);
    if(!isNewChange) {
      return;
    }

    /*
     * Update timestamps
     */
    lastFetchTime.current = Date.now();
    
    /*
     * Case 1: 
     * This item's password was updated, either here or somewhere else. 
     */

    //check if this.item changed
    if(lastModelChanged&&
      lastModelChanged['role']&&
      lastModelChanged['role'][String(itemId['id'])]) {

        //updated password
        if(lastModelChanged['role'][String(itemId['id'])].op === "updatePassword"&&
            lastModelChanged['role'][String(itemId['id'])].newItem) {
              //update password value
              setValue(lastModelChanged['role'][String(itemId['id'])].newItem[itemKey]);
        }
    }//end: Case 1
  }, [lastModelChanged, lastChangeTimestamp, itemId, itemKey]);

  /**
   * Handlers
   */
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickOnChangePassword = (event) => {
    event.preventDefault();
    //reset
    resetChangePasswordDialog();
    //open
    setChangePasswordDialogOpen(true);
  }

  const handleOnChangeNewPassword = (event) => {
    //save
    newPasswordText.current = event.target.value;
    //reset warnings
    resetDialogWarnings();
  }

  const handleOnChangeNewPassword2 = (event) => {
    //save
    newPasswordText2.current = event.target.value;
    //reset warnings
    resetDialogWarnings();
  }

  const handleClickOnChangePasswordCancel = () => {
    if(!isChangingPassword.current)
    {
      //reset
      resetChangePasswordDialog();
      //close
      setChangePasswordDialogOpen(false);
    }
  }

  const handleClickOnChangeThePassword = async () => {
    if(!isChangingPassword.current) {
      //set lock
      isChangingPassword.current = true;

      //validate 
      if(isValidNewPassword()) {
        let response = await doSave()
        if(response) {
          //ok
          onPasswordChanged(response);
        } else {
          //error
          onPasswordNotChanged();
        }
        //free lock
        isChangingPassword.current = false;
      }else {
        //free lock
        isChangingPassword.current = false;
      }
    }//else: done
  }

  const onPasswordChanged = (newItem) => {
    let oldItem = {...newItem};
    oldItem[itemKey] = value;

    //set new value
    setValue(newItem[itemKey]);
    //dispatch change
    dispatch(modelChange('user', 'updatePassword', oldItem, newItem, null));
    dispatch(changesCompleted());

    //reset
    resetChangePasswordDialog();
    //close
    setChangePasswordDialogOpen(false);
  }

  const onPasswordNotChanged = () => {
    //reset flag
    isChangingPassword.current = false;
  }

  /**
   * Utils
   */
  function isValidNewPassword() {
    //check: non empty: newPassword
    if(!newPasswordText.current) {
      setNewPasswordHelper( t('modelPanels.emptyPasswordWarning', 'Please enter a new password') );
      return false;
    }

    //check: non empty: newPassword2
    if(!newPasswordText2.current) {
      setNewPasswordHelper2( t('modelPanels.emptyPasswordWarning2', 'Please re-enter the new password') );
      return false;
    }

    //check: different passwords
    if(newPasswordText.current !== newPasswordText2.current) {
      setNewPasswordWarningText( t('modelPanels.passwordsDoNotMatch', 'Passwords do not match') );
      return false;
    }

    //ok
    return true;
  }

  function resetChangePasswordDialog() {
    //reset
    isChangingPassword.current = false;
    newPasswordText.current = '';
    newPasswordText2.current = '';
    resetDialogWarnings();
  }

  function resetDialogWarnings() {
    setNewPasswordHelper('');
    setNewPasswordHelper2('');
    setNewPasswordWarningText('');
  }

  /**
   * Requests
   */

  /**
    * doSave
    * 
    * Update new @item using GrahpQL Server mutation.
    */
   async function doSave() {
    errors.current = [];

    //variables
    let variables = {...itemId};
    //password
    variables.password = newPasswordText.current;

    /*
      API Request: api.role.updateItem
    */
    let api = await loadApi("role");
    if(!api) {
      let newError = {};
      let withDetails=true;
      variant.current='error';
      newError.message = t('modelPanels.messages.apiCouldNotLoaded', "API could not be loaded");
      newError.details = t('modelPanels.messages.seeConsoleError', "Please see console log for more details on this error");
      errors.current.push(newError);
      showMessage(newError.message, withDetails);
      return;
    }
    
    return await api.role.updateItem(graphqlServerUrl, variables)
      .then(
      //resolved
      (response) => {
        //check: response
        if(response.message === 'ok') {
          //check: graphql errors
          if(response.graphqlErrors) {
            let newError = {};
            let withDetails=true;
            variant.current='info';
            newError.message = t('modelPanels.errors.data.e3', 'fetched with errors.');
            newError.locations=[{model: 'role', method: 'doSave()', request: 'api.role.updateItem'}];
            newError.path=['Roles', itemId, 'update', 'change password'];
            newError.extensions = {graphQL:{data:response.data, errors:response.graphqlErrors}};
            errors.current.push(newError);
            console.log("Error: ", newError);

            showMessage(newError.message, withDetails);
          }
        } else { //not ok
          //show error
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t(`modelPanels.errors.data.${response.message}`, 'Error: '+response.message);
          newError.locations=[{model: 'role', method: 'doSave()', request: 'api.role.updateItem'}];
          newError.path=['Roles', itemId, 'update', 'change password'];
          newError.extensions = {graphqlResponse:{data:response.data, errors:response.graphqlErrors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          return false;
        }

        //ok
        enqueueSnackbar( t('modelPanels.messages.msg5', "Record updated successfully."), {
          variant: 'success',
          preventDuplicate: false,
          persist: false,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
        });
        return response.value;
      },
      //rejected
      (err) => {
        throw err;
      })
      //error
      .catch((err) => { //error: on api.role.updateItem
        if(err.isCanceled) {
          return
        } else {
          //set ajv errors
          setAjvErrors(err);

          //show error
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'role', method: 'doSave()', request: 'api.role.updateItem'}];
          newError.path=['Roles', itemId, 'update', 'change password'];
          newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          return false;
        }
      });
  }

  function setAjvErrors(err) {
    let ajvErrors = [];
    //check
    if(err&&err.response&&err.response.data&&Array.isArray(err.response.data.errors)) {
      let errors = err.response.data.errors;
 
      //for each error
      for(let i=0; i<errors.length; ++i) {
        let e=errors[i];
        //check
        if(e && typeof e === 'object'
        && e.extensions && typeof e.extensions === 'object' 
        && Array.isArray(e.extensions.validationErrors)){
          let validationErrors = e.extensions.validationErrors;
          
          for(let j=0; j<validationErrors.length; ++j) {
            let validationError = validationErrors[j];

            //check
            if(validationError && typeof validationError === 'object' 
            && validationError.dataPath && validationError.message) {
              /**
               * In this point, the error is considered as an AJV error.
               * 
               * It will be set in a ajvStatus reference and at the end of this function 
               * the ajvStatus state will be updated.
               */
              ajvErrors.push(validationError.message);
            }
          }
        }
      }
      //update state
      if(ajvErrors.length > 0) {setNewPasswordHelper(ajvErrors.join(' & '))}
      else {setNewPasswordHelper('')}
    }
  }

  return (
    <div>
      <Grid container justify='flex-start' alignItems='center' spacing={0}>
        <Grid item xs={12}>
          <form noValidate autoComplete="off">
            <TextField
              id={'PasswordField-Role-'+name}
              label={label}
              value={value}
              className={classes.textField}
              margin="normal"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              autoComplete="off"
              fullWidth
              autoFocus={autoFocus!==undefined&&autoFocus===true ? true : false}
              InputProps={{
                endAdornment:
                  <InputAdornment position="end">
                    <Tooltip title={ t('modelPanels.showPassword', 'Show password') }>
                      <IconButton
                        id={'PasswordField-Role-button-showPassword'+name}
                        onClick={handleClickShowPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </Tooltip>
                    {(valueOk!==undefined&&valueOk===1) 
                      ? 
                      <Tooltip title={ t('modelPanels.valueEntered', "Value entered") }>
                        <Typography id={'PasswordField-Role-exists-'+name} variant="caption" color="primary">
                          &#8707;
                        </Typography>
                      </Tooltip>
                      : 
                      <Tooltip title={ t('modelPanels.valueNotEntered', "Value not entered") }>
                        <Typography id={'PasswordField-Role-notExists-'+name} variant="caption" color="textSecondary">
                          &#8708;
                        </Typography>
                      </Tooltip>
                    }
                  </InputAdornment>
              }}
            />
          </form>
        </Grid>

        {/* 
          * Change password button
          */}
        <Grid item xs={12}>
          <Grid container justify='flex-end' alignItems='center'>
            <Grid item>
              <Link onClick={handleClickOnChangePassword} color="primary">
                { t('modelPanels.changePassword', 'Change password') }
              </Link>
            </Grid>
          </Grid>
        </Grid>

      </Grid>

      {/* Dialog: Change password */}
      {(changePasswordDialogOpen) && (
        <Dialog 
          id={'PasswordField-Role-ChangePasswordDialog-'+name} 
          open={changePasswordDialogOpen}
          disableBackdropClick
          disableEscapeKeyDown
        >
          <DialogTitle>{ t('modelsPanels.newPassword', 'New password') }</DialogTitle>
          <DialogContent>
            <DialogContentText>
              { t('modelsPanels.enterNewPassword', 'Please enter the new password.') }
            </DialogContentText>
            <form noValidate autoComplete="off">
              <Grid container justify='center' alignItems='center' spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    id={'PasswordField-Role-ChangePasswordDialog-textField-newPassword-'+name}
                    label={ t('modelsPanels.newPasswordLabel', 'New password') }
                    error={newPasswordHelper ? true : false}
                    helperText={newPasswordHelper}
                    type="password"
                    variant='outlined'
                    fullWidth
                    autoFocus
                    onChange={handleOnChangeNewPassword}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id={'PasswordField-Role-ChangePasswordDialog-textField-newPassword2-'+name}
                    label={ t('modelsPanels.newPasswordLabel2', 'Confirm the new password') }
                    error={newPasswordHelper2 ? true : false}
                    helperText={newPasswordHelper2}
                    type="password"
                    variant='outlined'
                    fullWidth
                    onChange={handleOnChangeNewPassword2}
                  />
                </Grid>
              </Grid>
            </form>
            <Typography variant="caption" color='error'>
              {newPasswordWarningText}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button className={classes.button} color="secondary"
            onClick={handleClickOnChangePasswordCancel}
            >
              { t('modelPanels.cancel', "Cancel") }
            </Button>
            <Button className={classes.button} variant='contained' color="primary"
            onClick={handleClickOnChangeThePassword}
            >
              { t('modelPanels.changeThePassword', "Change password") }
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
    
  );
}
PasswordField.propTypes = {
  itemKey: PropTypes.string.isRequired,
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  text: PropTypes.string,
  valueOk: PropTypes.number.isRequired,
  autoFocus: PropTypes.bool,
};