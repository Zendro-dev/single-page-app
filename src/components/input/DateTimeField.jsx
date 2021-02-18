import { useState, useRef } from 'react';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import 'moment/locale/es.js';
import 'moment/locale/de.js';
import InputContainer from './InputContainer';

export default function DateTimeField({
  leftIcon,
  rightIcon,
  value,
  error,
  helperText,
  InputProps,
  ...props
}) {
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
    <InputContainer leftIcon={leftIcon} rightIcon={rightIcon}>
      <MuiPickersUtilsProvider
        libInstance={moment}
        utils={MomentUtils}
        locale="en"
      >
        <KeyboardDateTimePicker
          {...props}
          fullWidth
          format={'YYYY-MM-DD HH:mm:ss.SSS'}
          value={selectedDate}
          margin={'normal'}
          variant={'dialog'}
          inputVariant={'outlined'}
          invalidDateMessage={helperText ?? 'Invalid date format'}
          onChange={handleOnChange}
          clearable={true}
          disabled={InputProps.readOnly ? true : false}
        />
      </MuiPickersUtilsProvider>
    </InputContainer>
  );
}
