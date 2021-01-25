import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  textField: {
    margin: 'auto',
  },
}));

export default function ArrayField(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const {
    name,
    label,
    text,
    valueOk,
    autoFocus,
  } = props;
  
  return (
    <Grid container justify='flex-start' alignItems='center' spacing={2}>
      <Grid item xs={12}>
        <TextField
          id={'ArrayField-User-'+name}
          label={label}
          multiline
          rowsMax="4"
          value={(text !== undefined && text !== null && Array.isArray(text)) ? text.join(",") : ''}
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
                    <Typography id={'ArrayField-User-exists-'+name} variant="caption" color="primary">
                      &#8707;
                    </Typography>
                  </Tooltip>
                  : 
                  <Tooltip title={ t('modelPanels.valueNotEntered', "Value not entered") }>
                    <Typography id={'ArrayField-User-notExists-'+name} variant="caption" color="textSecondary">
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
      </Grid>
    </Grid>
  );
}
ArrayField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  text: PropTypes.array,
  valueOk: PropTypes.number.isRequired,
  autoFocus: PropTypes.bool,
};