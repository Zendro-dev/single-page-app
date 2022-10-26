import { useReducer } from 'react';
import { enUS as en, es, de } from 'date-fns/locale';
import { Overwrite } from 'utility-types';
import { InputBaseComponentProps } from '@mui/material';
import {
  MobileDateTimePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextInput, { TextInputProps } from '@/components/text-input';

type DateTimeFieldProps = Overwrite<
  TextInputProps,
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
        mask="____/__/__ __:__:__.___"
        inputFormat="yyyy/MM/dd HH:mm:ss.SSS" //https://date-fns.org/v2.19.0/docs/format
        onChange={handleOnChange}
        disabled={props.disabled}
        onClose={toggleAdornment}
        onOpen={toggleAdornment}
        readOnly={props.readOnly || !onChange}
        renderInput={(textFieldProps: {
          inputProps?: Omit<InputBaseComponentProps, 'color'>;
        }) => {
          const inputProps = textFieldProps.inputProps;
          return (
            <TextInput
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
