import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles(theme => ({
  textField: {
    margin: 'auto',
  },
}));

export default function ArrayField(props) {
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
    arrayType,
  } = props;
  
  const defaultValue = useRef((text !== undefined && Array.isArray(text) ) ? text.join(",") : '');
  const textValue = useRef((text !== undefined && Array.isArray(text) ) ? text.join(",") : '');

  let parseValue = (input, arrayType) => {
    if (!input){
      return null
    } else {
      let array = input.split(",")
      let typeSet = ["String", "Date", "Time", "DateTime"]
      
      if (typeSet.includes(arrayType)){
        return array
      } else if (arrayType === 'Int'){
        return array.map(x => parseInt(x))
      } else if (arrayType === 'Float'){
        return array.map(x => parseFloat(x))
      } else if (arrayType === 'Boolean'){
        return array.map(x => x === 'true' )
      } else{
        console.log('No support for current type. Please check your input.')
        return null
      }
    }
  }

  return (
    <Grid container justify='flex-start' alignItems='center' spacing={0}>
      <Grid item xs={12}>
        <TextField
          id={'ArrayField-NoAssoc-'+name}
          error={(valueAjv !== undefined && valueAjv.errors.length > 0)}
          label={label}
          multiline
          rowsMax="4"
          defaultValue={defaultValue.current}
          className={classes.textField}
          margin="normal"
          variant="outlined"
          fullWidth
          autoFocus={autoFocus!==undefined&&autoFocus===true ? true : false}
          InputProps={{
            endAdornment:
              <InputAdornment position="end">
                {(valueOk!==undefined&&valueOk===1) 
                  ? 
                  <Tooltip title={ t('modelPanels.valueEntered', "Value entered") }>
                    <Typography id={'ArrayField-NoAssoc-exists-'+name} variant="caption" color="primary">
                      &#8707;
                    </Typography>
                  </Tooltip>
                  : 
                  <Tooltip title={ t('modelPanels.valueNotEntered', "Value not entered") }>
                    <Typography id={'ArrayField-NoAssoc-notExists-'+name} variant="caption" color="textSecondary">
                      &#8708;
                    </Typography>
                  </Tooltip>
                }
              </InputAdornment>
          }}
          onChange={(event) => {
            textValue.current = parseValue(event.target.value, arrayType);
            
            if(!textValue.current || !Array.isArray(textValue.current)) {
              handleSetValue(null, 0, itemKey);
            } else {
              //status is set to 1 only on blur or ctrl+Enter
              handleSetValue(textValue.current, 0, itemKey);
            }
          }}
          onBlur={(event) => {
            if(!textValue.current || !Array.isArray(textValue.current)) {
              handleSetValue(null, 0, itemKey);
            } else {
              handleSetValue(textValue.current, 1, itemKey);
            }
          }}
          onKeyDown={(event) => {
            if(event.ctrlKey && event.key === 'Enter') {
              if(!textValue.current || !Array.isArray(textValue.current)) {
                handleSetValue(null, 0, itemKey);
              } else {
                handleSetValue(textValue.current, 1, itemKey);
              }
            }
          }}
        />
      </Grid>
      {(valueAjv !== undefined && valueAjv.errors.length > 0) && (
        <Grid item id={'ArrayField-NoAssoc-ajvError-'+name} xs={12}>
          <Typography variant="caption" color='error'>
            {valueAjv.errors.join(' & ')}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}
ArrayField.propTypes = {
  itemKey: PropTypes.string.isRequired,
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  text: PropTypes.array,
  valueOk: PropTypes.number.isRequired,
  valueAjv: PropTypes.object.isRequired,
  autoFocus: PropTypes.bool,
  handleSetValue: PropTypes.func.isRequired,
  arrayType: PropTypes.string,
};