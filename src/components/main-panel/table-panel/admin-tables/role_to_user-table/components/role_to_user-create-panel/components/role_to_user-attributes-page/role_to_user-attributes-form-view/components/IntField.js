import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles(theme => ({
  textField: {
    margin: 'auto',
    width: '100%',
    maxWidth: 300,
    minWidth: 200,
  },
}));

export default function IntField(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const {
    itemKey,
    name,
    label,
    text,
    valueOk,
    valueAjv,
    autoFocus,
    foreignKey,
    handleSetValue,
  } = props;

  const [value, setValue] = useState(getInitialValue());
  const [errorText, setErrorText] = useState(null);
  const [helperText, setHelperText] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const intValue = useRef(getInitialIntValue());
  const textValue = useRef(getInitialTextValue());
  const rvalueOk = useRef(valueOk);
  const error = useRef(false);

  useEffect(() => {
    if(refresh) {
      setRefresh(false);
    }
  }, [refresh]);

  function getInitialValue() {
    if(text !== undefined && text !== null) {
      
      if(typeof text === 'string' && text.trim() !== '') {
        return Math.round(parseFloat(text));
      
      } else if(typeof text === 'number') {
        return text;
      
      } else {
        return '';
      
      }
    } else {
      return  '';

    }
  }

  function getInitialIntValue() {
    if(text !== undefined && text !== null) {
      
      if(typeof text === 'string' && text.trim() !== '') {
        return Math.round(parseFloat(text));
      
      } else if(typeof text === 'number') {
        return text;
      
      } else {
        return null;
      
      }
    } else {
      return  null;

    }
  }

  function getInitialTextValue() {
    if(text !== undefined && text !== null) {
      
      if(typeof text === 'string' && text.trim() !== '') {
        return text;
      
      } else if(typeof text === 'number') {
        return text.toString();
      
      } else {
        return null;
      
      }
    } else {
      return  null;

    }
  }

  return (
    <Grid container justify='flex-start' alignItems='center' spacing={0}>
      <Grid item>
        {(!refresh) && (
          <TextField
            id={'IntField-RoleToUser-'+name}
            value={value}
            label={label}
            type="number"
            className={classes.textField}
            margin="normal"
            variant="filled"
            placeholder={ (foreignKey !== undefined) ? "" : t('modelPanels.integer') }
            helperText={errorText!==null ? errorText : (helperText!==null ? helperText : "")}
            error={errorText!== null || (valueAjv !== undefined && valueAjv.errors.length > 0)}
            autoFocus={autoFocus!==undefined&&autoFocus===true ? true : false}
            InputProps={{
              endAdornment:
                <InputAdornment position="end">
                  {(valueOk!==undefined&&valueOk===1) 
                    ? 
                    <Tooltip title={ t('modelPanels.valueEntered', "Value entered") }>
                      <Typography id={'IntField-RoleToUser-exists-'+name} variant="caption" color="primary">
                        &#8707;
                      </Typography>
                    </Tooltip>
                    : 
                    <Tooltip title={ t('modelPanels.valueNotEntered', "Value not entered") }>
                      <Typography id={'IntField-RoleToUser-notExists-'+name} variant="caption" color="textSecondary">
                        &#8708;
                      </Typography>
                    </Tooltip>
                  }
                </InputAdornment>,
                readOnly: (foreignKey !== undefined)
            }}
            InputLabelProps={{ 
              shrink: true
            }}
            inputProps={{ 
              spellCheck: 'false'
            }}
            
            onChange={(event) => {
              setValue(event.target.value);
              textValue.current = event.target.value;
              intValue.current = Math.round(parseFloat(event.target.value));

              if(textValue.current !== null && textValue.current !== '' && !(isNaN(textValue.current)) && !(isNaN(intValue.current))) {
                error.current = false;
                setErrorText(null);
                handleSetValue(intValue.current, 0, itemKey);
                rvalueOk.current = 0;

                //check max int32-bit value
                if(intValue.current > 2147483647) {
                  error.current = true;
                  setErrorText( t('modelPanels.intMaxErr', 'This is an Int field, the maximum valid positive number is 2147483647. Entered value: ') + `${intValue.current}` );
                  setHelperText(null);
                  handleSetValue(null, -1, itemKey);
                  rvalueOk.current = -1;
                  return;
                }

                //check min int32-bit value
                if(intValue.current < -2147483647) {
                  error.current = true;
                  setErrorText( t('modelPanels.intMinErr', 'This is an Int field, the minimum valid negative number is -2147483647. Entered value: ') + `${intValue.current}` );
                  setHelperText(null);
                  handleSetValue(null, -1, itemKey);
                  rvalueOk.current = -1;
                  return;
                }

                //check decimal-notation
                if(event.target.value.includes(".")) {
                  setHelperText( t('modelPanels.intRoundedWarning', 'This is an Int field, the decimals will be rounded. Value taken: ')+ `${intValue.current}` );
                } else {
                  //check e-notation
                  if(event.target.value.includes("e")) {
                    setHelperText( t('modelPanels.valueTaken', 'Value taken: ')+ `${intValue.current}` );
                  } else {
                    setHelperText(null);
                  }
                }
                
              } else {
                error.current = true;
                setHelperText(null);
                if(textValue.current === null || textValue.current === '') {
                  setErrorText( t('modelPanels.undefinedNumber', 'Undefined number, no value will be sent for modification on this field') );
                  handleSetValue(null, 0, itemKey);
                  rvalueOk.current = 0;
                } else {
                  setErrorText( t('modelPanels.invalidNumber', 'Invalid number') );
                  handleSetValue(null, -1, itemKey);
                  rvalueOk.current = -1;
                }
              }
            }}

            onBlur={(event) => {
              if(foreignKey !== undefined) { return; }

              if(!error.current) {
                setErrorText(null);
                if(textValue.current !== null && textValue.current !== '' && !(isNaN(textValue.current)) && !(isNaN(intValue.current))) {
                  //set completed ok
                  handleSetValue(intValue.current, 1, itemKey);
                  rvalueOk.current = 1;
                } else {
                  //refresh
                  setErrorText(null);
                  setHelperText(null);
                  setValue('');
                  setRefresh(true);
                }
              } else {
                if(rvalueOk.current === 0) {
                   //refresh
                   error.current = false;
                   setErrorText(null);
                   setHelperText(null);
                   setValue('');
                   setRefresh(true);
                }
              }
            }}

            onKeyDown={(event) => {
              if(foreignKey !== undefined) { 
                event.preventDefault();
                return; 
              }

              if(event.key === 'Enter') {
                if(!error.current) {
                  if(textValue.current !== null && textValue.current !== '' && !(isNaN(textValue.current)) && !(isNaN(intValue.current))) {
                    handleSetValue(intValue.current, 1, itemKey);
                    rvalueOk.current = 1;
                  } else {
                    error.current = true;
                    setHelperText(null);
                    if(textValue.current === null || textValue.current === '') {
                      setErrorText( t('modelPanels.undefinedNumber', 'Undefined number, no value will be sent for modification on this field') );
                      handleSetValue(null, 0, itemKey);
                      rvalueOk.current = 0;
                    } else {
                      setErrorText( t('modelPanels.invalidNumber', 'Invalid number') );
                      handleSetValue(null, -1, itemKey);
                      rvalueOk.current = -1;
                    }
                  }
                }
                return;
              }

              if(event.ctrlKey) {
                return;
              }
              
              if(/^[+\-.e]{1}$/.test(event.key)) {
                return;
              }
              
              if(/^\D{1}$/.test(event.key)) {
                event.preventDefault();
                return;
              }

            }}
          />
        )}
      </Grid>
      {(foreignKey !== undefined) && (
        <Grid item>
          <Typography variant="caption" color='textSecondary'>
            Foreing key
          </Typography>
      </Grid>
      )}
      {(valueAjv !== undefined && valueAjv.errors.length > 0) && (
        <Grid item id={'IntField-RoleToUser-ajvError-'+name} xs={12}>
          <Typography variant="caption" color='error'>
            {valueAjv.errors.join(' & ')}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}
IntField.propTypes = {
  itemKey: PropTypes.string.isRequired,
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  valueOk: PropTypes.number.isRequired,
  valueAjv: PropTypes.object.isRequired,
  autoFocus: PropTypes.bool,
  foreignKey: PropTypes.bool,
  handleSetValue: PropTypes.func.isRequired,
};