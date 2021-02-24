import { useState, useRef, ReactElement } from 'react';
import moment, { Moment } from 'moment';
import MomentUtils from '@date-io/moment';
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from '@material-ui/pickers';
import 'moment/locale/es.js';
import 'moment/locale/de.js';

import { InputProps } from '@material-ui/core';
import InputContainer, { InputContainerProps } from './input-container';

interface DateTimeFieldProps {
  helperText?: string;
  InputProps: InputProps;
  onChange: (date: string | null) => void;
  value: string | null;
}

export default function DateTimeField({
  leftIcon,
  rightIcon,
  value,
  // error,
  helperText,
  InputProps,
  ...props
}: DateTimeFieldProps & InputContainerProps): ReactElement {
  const initialDate = moment(value ?? '', 'YYYY-MM-DDTHH:mm:ss.SSSZ');

  const [selectedDate, setSelectedDate] = useState(
    initialDate.isValid() ? initialDate : null
  );

  const mdate = useRef(initialDate.isValid() ? initialDate : moment.invalid());

  const handleOnChange = (date: Moment | null): void => {
    if (date === undefined || !date?.isValid()) return;

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
          format="YYYY-MM-DD HH:mm:ss.SSS"
          value={selectedDate}
          margin="normal"
          variant="dialog"
          inputVariant="outlined"
          invalidDateMessage={helperText ?? 'Invalid date format'}
          onChange={handleOnChange}
          clearable={true}
          disabled={InputProps.readOnly ? true : false}
        />
      </MuiPickersUtilsProvider>
    </InputContainer>
  );
}
