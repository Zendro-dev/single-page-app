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

export default function StringField(props) {
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
  
  const defaultValue = useRef((text !== undefined && typeof text === 'string' ) ? text : '');
  const textValue = useRef((text !== undefined && typeof text === 'string' ) ? text : null);

  return (
    <Grid container justify='flex-start' alignItems='center' spacing={0}>
      <Grid item xs={12}>
        <TextField
          id={'StringField-RoleToUser-'+name}
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
                    <Typography id={'StringField-RoleToUser-exists-'+name} variant="caption" color="primary">
                      &#8707;
                    </Typography>
                  </Tooltip>
                  : 
                  <Tooltip title={ t('modelPanels.valueNotEntered', "Value not entered") }>
                    <Typography id={'StringField-RoleToUser-notExists-'+name} variant="caption" color="textSecondary">
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
      </Grid>
      {(valueAjv !== undefined && valueAjv.errors.length > 0) && (
        <Grid item id={'StringField-RoleToUser-ajvError-'+name} xs={12}>
          <Typography variant="caption" color='error'>
            {valueAjv.errors.join(' & ')}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}
StringField.propTypes = {
  itemKey: PropTypes.string.isRequired,
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  text: PropTypes.string,
  valueOk: PropTypes.number.isRequired,
  valueAjv: PropTypes.object.isRequired,
  autoFocus: PropTypes.bool,
  handleSetValue: PropTypes.func.isRequired,
};