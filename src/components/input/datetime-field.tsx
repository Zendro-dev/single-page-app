import { useReducer } from 'react';
import { enUS as en, es, de } from 'date-fns/locale';
import { Overwrite } from 'utility-types';
import { MobileDateTimePicker, LocalizationProvider } from '@material-ui/lab';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import TextField, { TextFieldProps } from './text-field';
import { InputBaseComponentProps } from '@material-ui/core';

type DateTimeFieldProps = Overwrite<
  TextFieldProps,
  {
    onChange?: (value: Date | null) => void;
    value: Date | null;
  }
>;

const localeMap = { en, es, de };

export default function DateTimePicker({
  onChange,
  value,
  ...props
}: DateTimeFieldProps): React.ReactElement {
  const handleOnChange = (date: Date | null): void => {
    if (onChange) onChange(date);
  };

  const [showAdornment, toggleAdornment] = useReducer((state) => !state, true);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap['en']}>
      <MobileDateTimePicker
        ampm={false}
        clearable
        mask="____/__/__ __:__:__:___"
        inputFormat="yyyy/MM/dd HH:mm:ss:sss"
        onChange={handleOnChange}
        disabled={props.disabled}
        onClose={toggleAdornment}
        onOpen={toggleAdornment}
        readOnly={props.readOnly || !onChange}
        renderInput={(textFieldProps) => {
          const inputProps = textFieldProps.inputProps as Omit<
            InputBaseComponentProps,
            'color'
          >;
          return (
            <TextField
              {...inputProps}
              {...props}
              endAdornment={showAdornment ? props.endAdornment : undefined}
              // readOnly={textFieldProps.InputProps?.readOnly}
              fullWidth
            />
          );
        }}
        value={value}
      />
    </LocalizationProvider>
  );
}
