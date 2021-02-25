import { useState, ReactElement } from 'react';
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
  InputProps,
  ...props
}: DateTimeFieldProps & InputContainerProps): ReactElement {
  const dateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
  const initialDate = moment(value ?? '', dateFormat);
  const [date, setDate] = useState(initialDate.isValid() ? initialDate : null);

  const handleOnChange = (value: Moment | null): void => {
    setDate(value);
    const _date = value?.isValid() ? value.format(dateFormat) : null;
    props.onChange(_date);
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
          value={date}
          margin="normal"
          variant="dialog"
          inputVariant="outlined"
          onChange={handleOnChange}
          clearable={true}
          disabled={InputProps.readOnly}
        />
      </MuiPickersUtilsProvider>
    </InputContainer>
  );
}
