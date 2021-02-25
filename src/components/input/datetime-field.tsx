import { enUS as en, es, de } from 'date-fns/locale';
import { MobileDateTimePicker, LocalizationProvider } from '@material-ui/lab';
import { InputProps, TextField } from '@material-ui/core';

import AdapterDateFns from '@material-ui/lab/AdapterDateFns';

import InputContainer, { InputContainerProps } from './input-container';

interface DateTimePickerProps {
  error: boolean;
  helperText?: string;
  InputProps?: InputProps;
  label?: string;
  onChange?: (value: Date | null) => void;
  value: Date | null;
}

const localeMap = { en, es, de };
const mask = {
  en: '__/__/____ __:__',
  es: '__/__/____ __:__',
  de: '__/__/____ __:__',
};

export default function DateTimePicker({
  error,
  helperText,
  InputProps,
  label,
  leftIcon,
  rightIcon,
  onChange,
  value,
}: DateTimePickerProps & InputContainerProps): React.ReactElement {
  const handleOnChange = (date: Date | null): void => {
    if (onChange) onChange(date);
  };

  return (
    <InputContainer leftIcon={leftIcon} rightIcon={rightIcon}>
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        locale={localeMap['en']}
      >
        <MobileDateTimePicker
          ampm={false}
          clearable
          mask={mask['en']}
          disabled={InputProps?.readOnly}
          onChange={handleOnChange}
          renderInput={(props) => (
            <TextField
              {...props}
              error={error}
              fullWidth
              helperText={helperText}
              margin="normal"
              label={label}
              variant="outlined"
              InputProps={InputProps}
            />
          )}
          value={value}
        />
      </LocalizationProvider>
    </InputContainer>
  );
}
