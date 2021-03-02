import { enUS as en, es, de } from 'date-fns/locale';
import { MobileDateTimePicker, LocalizationProvider } from '@material-ui/lab';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import BaseField, { BaseFieldProps } from './base-field';

export interface DateTimeFieldProps {
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
  InputProps,
  onChange,
  value,
  ...baseProps
}: BaseFieldProps<DateTimeFieldProps>): React.ReactElement {
  const handleOnChange = (date: Date | null): void => {
    if (onChange) onChange(date);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap['en']}>
      <MobileDateTimePicker
        ampm={false}
        clearable
        mask={mask['en']}
        onChange={handleOnChange}
        readOnly={InputProps?.readOnly}
        renderInput={(props) => (
          <BaseField
            {...props}
            {...baseProps}
            fullWidth
            InputProps={InputProps}
            margin="normal"
            variant="outlined"
          />
        )}
        value={value}
      />
    </LocalizationProvider>
  );
}
