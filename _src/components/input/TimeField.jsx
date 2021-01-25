import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useTranslation } from 'react-i18next';
import moment from "moment";
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider, KeyboardTimePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
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
  ajvError: {
    color: "red"
  },
}));

export default function TimeField(props) {
  const classes = useStyles();
  const { t, i18n } = useTranslation();
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
  
  const [selectedDate, setSelectedDate] = useState(getInitialSelectedDate());
  const mdate = useRef(getInitialMdate());

  function getInitialSelectedDate() {
    moment.locale(i18n.language);
    
    if(text !== undefined && text !== null && typeof text === 'string' && text.trim() !== '') {
      
      let m = moment(text, "HH:mm:ss.SSSZ");
      if(m.isValid()) {
        return m;
        
      } else {
        return null;

      }
    } else {
      return null;
      
    }
  }

  function getInitialMdate() {
    moment.locale(i18n.language);
    
    if(text !== undefined && text !== null && typeof text === 'string' && text.trim() !== '') {
      
      let m = moment(text, "HH:mm:ss.SSSZ");
      if(m.isValid()) {
        return m;
        
      } else {
        return moment.invalid();;

      }
    } else {
      return moment.invalid();;

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
            <KeyboardTimePicker
              id={'TimeField-NoAssoc-'+name}
              className={classes.input}
              label={label}
              format="HH:mm:ss.SSS"
              ampm={true}
              value={selectedDate}
              views={['hours', 'minutes', 'seconds']}
              margin="normal"
              inputVariant="filled"
              autoFocus={autoFocus!==undefined&&autoFocus===true ? true : false}
              invalidDateMessage={ t('modelPanels.invalidDate', 'Invalid date format') }
              InputProps={{
                className: classnames({[classes.ajvError]: (valueAjv !== undefined && valueAjv.errors.length > 0)}),
              }}
              InputAdornmentProps={{
                id: 'TimeField-NoAssoc-input-inputAdornment-'+name,
              }}
              KeyboardButtonProps={{
                id: 'TimeField-NoAssoc-input-inputAdornment-button-'+name,
              }}
              onChange={(date, value) => {
                setSelectedDate(date);

                if(date !== null) {
                  mdate.current = date;

                  if(mdate.current.isValid()) {
                    handleSetValue(mdate.current.format("HH:mm:ss.SSSZ"), 1, itemKey);
                  } else {
                    handleSetValue(null, -1, itemKey);
                  }
                } else {
                  mdate.current = moment.invalid();
                  handleSetValue(null, 0, itemKey);
                }
              }}

              onBlur={(event) => {
                if(mdate.current.isValid()) {
                  handleSetValue(mdate.current.format("HH:mm:ss.SSSZ"), 1, itemKey);
                }
              }}

              onKeyDown={(event) => {
                if(event.key === 'Enter') {
                  if(mdate.current.isValid()) {
                    handleSetValue(mdate.current.format("HH:mm:ss.SSSZ"), 1, itemKey);
                  }
                }
              }}
            />
          </FormControl>
        </MuiPickersUtilsProvider>
      </Grid>
      <Grid item>
        {(valueOk!==undefined&&valueOk===1) 
          ? 
          <Tooltip title={ t('modelPanels.valueEntered', "Value entered") }>
            <Typography id={'TimeField-NoAssoc-exists-'+name} variant="caption" color="primary">
              &#8707;
            </Typography>
          </Tooltip>
          : 
          <Tooltip title={ t('modelPanels.valueNotEntered', "Value not entered") }>
            <Typography id={'TimeField-NoAssoc-notExists-'+name} variant="caption" color="textSecondary">
              &#8708;
            </Typography>
          </Tooltip>
        }
      </Grid>
      {(valueAjv !== undefined && valueAjv.errors.length > 0) && (
        <Grid item id={'TimeField-NoAssoc-ajvError-'+name} xs={12}>
          <Typography variant="caption" color='error'>
            {valueAjv.errors.join(' & ')}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}
TimeField.propTypes = {
  itemKey: PropTypes.string.isRequired,
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  text: PropTypes.string,
  valueOk: PropTypes.number.isRequired,
  valueAjv: PropTypes.object.isRequired,
  autoFocus: PropTypes.bool,
  handleSetValue: PropTypes.func.isRequired,
};