import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import 'moment/locale/es.js';
import 'moment/locale/de.js';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    leftIcon: {
      width: '2rem',
      height: '2rem',
      marginTop: '1.75rem',
      marginRight: '0.5rem',
      color: theme.palette.grey[700],
    },
    rightIcon: {
      marginLeft: '0rem',
      color: theme.palette.grey[700],
    },
  })
);
export default function DateTimeField({
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  value,
  error,
  helperText,
  InputProps,
  ...props
}) {
  const classes = useStyles();
  const { i18n } = useTranslation();

  useEffect(() => {
    moment.locale(i18n.language);
  }, [i18n.language]);
  const initialDate = moment(value ?? '', 'YYYY-MM-DDTHH:mm:ss.SSSZ');

  const [selectedDate, setSelectedDate] = useState(
    initialDate.isValid() ? initialDate : null
  );
  const mdate = useRef(initialDate.isValid() ? initialDate : moment.invalid());

  const handleOnChange = (date) => {
    if (date && date._i && date._i.includes('_')) {
      return;
    } else {
      setSelectedDate(date);
      if (date !== null) {
        mdate.current = date;

        if (mdate.current.isValid()) {
          if (props.onChange) {
            props.onChange(mdate.current.format('YYYY-MM-DDTHH:mm:ss.SSSZ'));
          }
        } else {
          if (props.onChange) {
            props.onChange(null);
          }
        }
      } else {
        mdate.current = moment.invalid();
        if (props.onChange) {
          props.onChange(null);
        }
      }
    }
  };

  return (
    <div className={classes.root}>
      {LeftIcon && <LeftIcon className={classes.leftIcon} />}
      <MuiPickersUtilsProvider
        libInstance={moment}
        utils={MomentUtils}
        locale={i18n.language}
      >
        <KeyboardDateTimePicker
          {...props}
          format={'YYYY-MM-DD HH:mm:ss.SSS'}
          value={selectedDate}
          margin={'normal'}
          variant={'dialog'}
          inputVariant={'outlined'}
          invalidDateMessage={helperText ?? 'Invalid date format'}
          InputAdornmentProps={{
            id: 'DateTimeField-input-inputAdornment-' + props.label,
          }}
          KeyboardButtonProps={{
            id: 'DateTimeField-input-inputAdornment-button-' + props.label,
          }}
          onChange={handleOnChange}
          clearable={true}
          disabled={InputProps.readOnly ? true : false}
        />
      </MuiPickersUtilsProvider>
      {RightIcon && <RightIcon className={classes.rightIcon} />}
    </div>
  );
}
