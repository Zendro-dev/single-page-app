import { enUS as en, es, de } from 'date-fns/locale';
import { Overwrite } from 'utility-types';
import { IconButtonProps } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextInputProps } from '@/components/text-input';

type DateTimeFieldProps = Overwrite<
  TextInputProps,
  {
    onChange?: (value: Date | null) => void;
    value: Date | null;
  }
>;

const localeMap = { en, es, de };

export default function DateTimeField({
  onChange,
  value,
  label,
  error,
  disabled,
  readOnly,
  className,
  helperText,
}: DateTimeFieldProps): React.ReactElement {
  const handleOnChange = (date: Date | null): void => {
    if (onChange) onChange(date);
  };

  const editable = Boolean(onChange) && !readOnly;

  return (
    // `locale` was renamed `adapterLocale`; `mask` was removed entirely (the
    // masked single-string input it constrained no longer exists - MUI X v6+
    // renders a segmented, keyboard-navigable field instead) and
    // `inputFormat` was renamed `format`.
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={localeMap['en']}
    >
      {/* Responsive DateTimePicker: on a pointer device it opens the desktop
          calendar/clock popover via the built-in calendar button in the input's
          end adornment; on touch it opens the full-screen modal. The previous
          MobileDateTimePicker only ever opened a modal on field click and
          rendered no calendar affordance, so on desktop it looked like a plain
          text input - which is what users reported. */}
      <DateTimePicker
        ampm={false}
        // No milliseconds section: the segmented field (unlike the old masked
        // single-string input) requires every section to have a value before
        // it reports a complete Date via onChange, and .SSS isn't needed since
        // the backend doesn't store sub-second precision anyway.
        format="yyyy/MM/dd HH:mm:ss" //https://date-fns.org/v2.19.0/docs/format
        onChange={handleOnChange}
        disabled={disabled}
        readOnly={readOnly || !onChange}
        // The app used to inject its own "unset" (clear) button as the input's
        // endAdornment. On the desktop picker the calendar open-button lives in
        // that same adornment, so overriding it wholesale (as before) stripped
        // the calendar affordance. Use the picker's built-in clear button
        // instead (a field-slot prop in MUI X v9), and keep the
        // `record-fields-unset` data-cy hook the other fields expose so shared
        // e2e selectors still resolve.
        slotProps={{
          field: {
            clearable: editable,
            onClear: () => onChange?.(null),
          },
          // data-* attributes are valid on the IconButton at runtime; MUI's
          // slot prop type just doesn't declare them, hence the cast.
          clearButton: {
            'data-cy': 'record-fields-unset',
          } as unknown as IconButtonProps,
          textField: {
            label,
            error,
            className,
            // TextInputProps' helperText is { component?, node } (this app's
            // own convention); the picker's text field expects a plain
            // ReactNode, so only the content carries over here.
            helperText: helperText?.node,
            fullWidth: true,
          },
        }}
        // `value` can genuinely be `undefined` on first render (record data
        // hasn't loaded yet), then `null`/a real Date once it has. MUI's picker
        // decides controlled-vs-uncontrolled from whether `value` is
        // `undefined` on its first render, so mask that transition here.
        value={value ?? null}
      />
    </LocalizationProvider>
  );
}
