import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles(theme => ({
  textField: {
    margin: 'auto',
    width: '100%',
    maxWidth: 300,
    minWidth: 200,
  },
}));

export default function FloatField(props) {
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
    handleSetValue,
  } = props;

  const [value, setValue] = useState(getInitialValue());
  const [errorText, setErrorText] = useState(null);
  const [helperText, setHelperText] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const floatValue = useRef(getInitialFloatValue());
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
        return text;
      
      } else if(typeof text === 'number') {
        return text.toString();
      
      } else {
        return '';
      
      }
    } else {
      return  '';

    }
  }

  function getInitialFloatValue() {
    if(text !== undefined && text !== null) {
      
      if(typeof text === 'string' && text.trim() !== '') {
        return parseFloat(text);
      
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
            id={'FloatField-User-'+name}
            value={value}
            label={label}
            type="number"
            className={classes.textField}
            margin="normal"
            variant="filled"
            placeholder={ t('modelPanels.number') }
            helperText={errorText!==null ? errorText : (helperText!==null ? helperText : "")}
            error={errorText!== null || (valueAjv !== undefined && valueAjv.errors.length > 0)}
            autoFocus={autoFocus!==undefined&&autoFocus===true ? true : false}
            InputProps={{
              endAdornment:
                <InputAdornment position="end">
                  {(valueOk!==undefined&&valueOk===1) 
                    ? 
                    <Tooltip title={ t('modelPanels.valueEntered', "Value entered") }>
                      <Typography id={'FloatField-User-exists-'+name} variant="caption" color="primary">
                        &#8707;
                      </Typography>
                    </Tooltip>
                    : 
                    <Tooltip title={ t('modelPanels.valueNotEntered', "Value not entered") }>
                      <Typography id={'FloatField-User-notExists-'+name} variant="caption" color="textSecondary">
                        &#8708;
                      </Typography>
                    </Tooltip>
                  }
                </InputAdornment>
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
              floatValue.current = parseFloat(event.target.value);

              if(textValue.current !== null && textValue.current !== '' && !(isNaN(textValue.current)) && !(isNaN(floatValue.current))) {
                error.current = false;
                setErrorText(null);
                handleSetValue(floatValue.current, 0, itemKey);
                rvalueOk.current = 0;

                //check max float number
                if(floatValue.current > 1.79769313486231e+308) {
                  error.current = true;
                  setErrorText( t('modelPanels.floatMaxErr', 'This is a Float field, the maximum valid positive number is 1.79769313486231e+308. Entered value: ') + `${floatValue.current}` );
                  setHelperText(null);
                  handleSetValue(null, -1, itemKey);
                  rvalueOk.current = -1;
                  return;
                }

                //check min float number
                if(floatValue.current < -1.79769313486231e+308) {
                  error.current = true;
                  setErrorText( t('modelPanels.floatMinErr', 'This is a Float field, the minimum valid negative number is -1.79769313486231e+308. Entered value: ') + `${floatValue.current}` );
                  setHelperText(null);
                  handleSetValue(null, -1, itemKey);
                  rvalueOk.current = -1;
                  return;
                }

                //check e-notation
                if(event.target.value.includes("e")) {
                  setHelperText( t('modelPanels.valueTaken', 'Value taken: ')+ `${floatValue.current}` );
                } else {
                  setHelperText(null);
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
              if(!error.current) {
                setErrorText(null);
                if(textValue.current !== null && textValue.current !== '' && !(isNaN(textValue.current)) && !(isNaN(floatValue.current))) {
                  //set completed ok
                  handleSetValue(floatValue.current, 1, itemKey);
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

              if(event.key === 'Enter') {
                if(!error.current) {
                  if(textValue.current !== null && textValue.current !== '' && !(isNaN(textValue.current)) && !(isNaN(floatValue.current))) {
                    handleSetValue(floatValue.current, 1, itemKey);
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
      {(valueAjv !== undefined && valueAjv.errors.length > 0) && (
        <Grid item id={'FloatField-User-ajvError-'+name} xs={12}>
          <Typography variant="caption" color='error'>
            {valueAjv.errors.join(' & ')}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}
FloatField.propTypes = {
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
  handleSetValue: PropTypes.func.isRequired,
};