import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
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
}));

export default function PasswordField(props) {
  const classes = useStyles();
  const {
    itemKey,
    name,
    label,
    text,
    valueOk,
    valueAjv,
    autoFocus,
    handleSetValue,
  } = props;
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  
  const defaultValue = useRef((text !== undefined && typeof text === 'string' ) ? text : '');
  const textValue = useRef((text !== undefined && typeof text === 'string' ) ? text : null);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Grid container justify='flex-start' alignItems='center' spacing={0}>
      <Grid item xs={12}>
        <form noValidate autoComplete="off">
          <TextField
            id={'PasswordField-Role-'+name}
            error={(valueAjv !== undefined && valueAjv.errors.length > 0)}
            label={label}
            defaultValue={defaultValue.current}
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
                  <Tooltip title={ t('login.showPassword', 'Show password') }>
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
            onChange={(event) => {
              textValue.current = event.target.value;
              
              if(!textValue.current || typeof textValue.current !== 'string') {
                handleSetValue(null, 0, itemKey);
              } else {
                //status is set to 1 only on blur or ctrl+Enter
                handleSetValue(textValue.current, 0, itemKey);
              }
            }}
            onBlur={(event) => {
              if(!textValue.current || typeof textValue.current !== 'string') {
                handleSetValue(null, 0, itemKey);
              } else {
                handleSetValue(textValue.current, 1, itemKey);
              }
            }}
            onKeyDown={(event) => {
              if(event.ctrlKey && event.key === 'Enter') {
                if(!textValue.current || typeof textValue.current !== 'string') {
                  handleSetValue(null, 0, itemKey);
                } else {
                  handleSetValue(textValue.current, 1, itemKey);
                }
              }
            }}
          />
        </form>
      </Grid>
      {(valueAjv !== undefined && valueAjv.errors.length > 0) && (
        <Grid item id={'PasswordField-Role-ajvError-'+name} xs={12}>
          <Typography variant="caption" color='error'>
            {valueAjv.errors.join(' & ')}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}
PasswordField.propTypes = {
  itemKey: PropTypes.string.isRequired,
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  text: PropTypes.string,
  valueOk: PropTypes.number.isRequired,
  valueAjv: PropTypes.object.isRequired,
  autoFocus: PropTypes.bool,
  handleSetValue: PropTypes.func.isRequired,
};