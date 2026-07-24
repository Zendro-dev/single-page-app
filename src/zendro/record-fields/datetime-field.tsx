import { useReducer } from 'react';
import { enUS as en, es, de } from 'date-fns/locale';
import { Overwrite } from 'utility-types';
import { InputBaseComponentProps, TextFieldProps } from '@mui/material';
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
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={localeMap['en']}
    >
      <MobileDateTimePicker
        ampm={false}
        format="yyyy/MM/dd HH:mm:ss.SSS" //https://date-fns.org/docs/format
        onChange={handleOnChange}
        disabled={props.disabled}
        onClose={toggleAdornment}
        onOpen={toggleAdornment}
        readOnly={props.readOnly || !onChange}
        value={value}
        slots={{
          textField: (textFieldProps: TextFieldProps) => {
            const inputProps = (
              textFieldProps as {
                inputProps?: Omit<InputBaseComponentProps, 'color'>;
              }
            ).inputProps;
            return (
              <TextInput
                {...inputProps}
                {...props}
                endAdornment={showAdornment ? props.endAdornment : undefined}
                fullWidth
              />
            );
          },
        }}
      />
    </LocalizationProvider>
  );
}
