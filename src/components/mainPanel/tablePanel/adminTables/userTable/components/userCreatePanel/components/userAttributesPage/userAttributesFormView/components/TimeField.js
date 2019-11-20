import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import moment from "moment";
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider, KeyboardTimePicker } from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import CheckIcon from '@material-ui/icons/Check';

const useStyles = makeStyles(theme => ({
  input: {
    margin: theme.spacing(0),
  },
}));

export default function TimeField(props) {
  const classes = useStyles();
  const {
    itemKey,
    name,
    label,
    text,
    valueOk,
    autoFocus,
    handleChange,
    handleBlur,
    handleReady,
    handleKeyDown,
  } = props;
  
  const [selectedDate, setSelectedDate] = React.useState(null);
  const inputRef = useRef(null);
  const strDate = useRef('');

  useEffect(() => {
    if(text !== undefined && text !== null && text !== '') {
      setSelectedDate(moment(text));
    }

    if(handleReady !== undefined) {
      handleReady(itemKey, inputRef, inputRef);
    }
  }, []);

  return (
    <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
        <KeyboardTimePicker
          className={classes.input}
          id={"time-field-"+itemKey+'-'+label}
          label={label}
          inputRef={inputRef}
          format="HH:mm:ss.SSS"
          ampm={true}
          value={selectedDate}
          views={['hours', 'minutes', 'seconds']}
          margin="normal"
          inputVariant="filled"
          autoFocus={autoFocus!==undefined&&autoFocus===true ? true : false}
          InputProps={{
            startAdornment:
              <InputAdornment position="start">
                {(valueOk!==undefined&&valueOk===1) ? <CheckIcon color="primary" fontSize="small" /> : ''}
              </InputAdornment>
          }}
          onChange={(date, value) => {
            console.log("#- time.change: date: ", date, " value: ", value);
            strDate.current = value;
            setSelectedDate(date);
          }}
          onBlur={(event) => {
            console.log("#- time.blur: date: ", strDate.current);
            if(strDate.current === null) {
              if(handleBlur !== undefined) {
                handleBlur(event, '', itemKey);
              }
            } else {
              if(handleBlur !== undefined) {
                handleBlur(event, strDate.current, itemKey);
              }
            }
          }}
          onKeyDown={(event) => {
            console.log("#- time.keyDown: date: ", strDate.current);
            if(strDate.current === null) {
              if(handleKeyDown !== undefined) {
                handleKeyDown(event, '', itemKey);
              }
            } else {
              if(handleKeyDown !== undefined) {
                handleKeyDown(event, strDate.current, itemKey);
              }
            }
          }}
          onError={(error, value) => {
            console.log("#- time.error: error: ", error, " value: ", value, " date: ", strDate.current);
            //no error
            if(error === '') {
              //empty value
              if(value === null || value === '') {
                if(handleChange !== undefined) {
                  handleChange(error, '', itemKey);
                }
              } else {
                //no empty value
                if(handleChange !== undefined) {
                  handleChange(error, value, itemKey);
                }
              }
            } else {
              //error
              if(handleChange !== undefined) {
                handleChange(error, null, itemKey);
              }
            }
          }}
        />
    </MuiPickersUtilsProvider>
  );
}
TimeField.propTypes = {
  itemKey: PropTypes.string.isRequired,
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  text: PropTypes.string,
  valueOk: PropTypes.number.isRequired,
  autoFocus: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleReady: PropTypes.func.isRequired,
  handleKeyDown: PropTypes.func.isRequired
};