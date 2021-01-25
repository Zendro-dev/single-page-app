import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

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
    name,
    label,
    text,
    valueOk,
    autoFocus,
  } = props;

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

  return (
      <TextField
        id={'FloatField-User-'+name}
        label={label}
        type="number"
        value={getInitialValue()}
        className={classes.textField}
        margin="normal"
        variant="outlined"
        placeholder=""
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
            </InputAdornment>,
          readOnly: true
        }}
        InputLabelProps={{ 
          shrink: true
        }}
        inputProps={{ 
          spellCheck: 'false'
        }}
      />
  );
}
FloatField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  valueOk: PropTypes.number.isRequired,
  autoFocus: PropTypes.bool,
};