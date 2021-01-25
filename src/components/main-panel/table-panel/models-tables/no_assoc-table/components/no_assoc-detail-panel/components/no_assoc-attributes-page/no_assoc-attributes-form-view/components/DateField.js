import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import moment from "moment";
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import "moment/locale/es.js";
import "moment/locale/de.js";

const useStyles = makeStyles(theme => ({
  input: {
    margin: theme.spacing(0),
  },
  formControl: {
    marginRight: theme.spacing(1),
  },
}));

export default function DateField(props) {
  const classes = useStyles();
  const { i18n, t } = useTranslation();
  const {
    name,
    label,
    text,
    valueOk,
    autoFocus,
  } = props;

  function getInitialSelectedDate() {
    moment.locale(i18n.language);
    
    if(text !== undefined && text !== null && typeof text === 'string' && text.trim() !== '') {
      
      let m = moment(text);
      if(m.isValid()) {
        return m;
        
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  useEffect(() => {
    moment.locale(i18n.language);
  }, [i18n.language]);

  return (
    <Grid container justify='flex-start' alignItems='center' spacing={0}>
      <Grid item>
        <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale={i18n.language}>
         <FormControl className={classes.formControl}>
            <KeyboardDatePicker
              className={classes.input}
              id={'DateField-NoAssoc-'+name}
              label={label}
              format="YYYY-MM-DD"
              value={getInitialSelectedDate()}
              margin="normal"
              variant="inline"
              inputVariant="outlined"
              autoFocus={autoFocus!==undefined&&autoFocus===true ? true : false}
              autoOk={true}
              InputProps={{
                readOnly: true,
              }}
              InputAdornmentProps={{
                id: 'DateField-NoAssoc-input-inputAdornment-'+name,
              }}
              KeyboardButtonProps={{
                id: 'DateField-NoAssoc-input-inputAdornment-button-'+name,
              }}
              onChange={()=>{/** do nothing */}}
            />
          </FormControl>
        </MuiPickersUtilsProvider>
      </Grid>
      <Grid item>
        {(valueOk!==undefined&&valueOk===1) 
          ? 
          <Tooltip title={ t('modelPanels.valueEntered', "Value entered") }>
            <Typography id={'DateField-NoAssoc-exists-'+name} variant="caption" color="primary">
              &#8707;
            </Typography>
          </Tooltip>
          : 
          <Tooltip title={ t('modelPanels.valueNotEntered', "Value not entered") }>
            <Typography id={'DateField-NoAssoc-notExists-'+name} variant="caption" color="textSecondary">
              &#8708;
            </Typography>
          </Tooltip>
        }
      </Grid>
    </Grid>
  );
}
DateField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  text: PropTypes.string,
  valueOk: PropTypes.number.isRequired,
  autoFocus: PropTypes.bool,
};