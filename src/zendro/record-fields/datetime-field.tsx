import { useReducer } from 'react';
import { enUS as en, es, de } from 'date-fns/locale';
import { Overwrite } from 'utility-types';
import {
  MobileDateTimePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers';
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

export default function DateTimePicker({
  onChange,
  value,
  label,
  error,
  disabled,
  readOnly,
  className,
  endAdornment,
  helperText,
}: DateTimeFieldProps): React.ReactElement {
  const handleOnChange = (date: Date | null): void => {
    if (onChange) onChange(date);
  };

  const [showAdornment, toggleAdornment] = useReducer((state) => !state, true);

  return (
    // `locale` was renamed `adapterLocale`; `mask` was removed entirely (the
    // masked single-string input it constrained no longer exists - MUI X v6+
    // renders a segmented, keyboard-navigable field instead) and
    // `inputFormat` was renamed `format`.
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={localeMap['en']}
    >
      <MobileDateTimePicker
        ampm={false}
        // No milliseconds section: the new segmented field (unlike the old
        // masked single-string input) requires every section to have a
        // value before it reports a complete Date via onChange, and .SSS
        // isn't independently settable/needed since the backend doesn't
        // store sub-second precision anyway.
        format="yyyy/MM/dd HH:mm:ss" //https://date-fns.org/v2.19.0/docs/format
        onChange={handleOnChange}
        disabled={disabled}
        onClose={toggleAdornment}
        onOpen={toggleAdornment}
        readOnly={readOnly || !onChange}
        // `renderInput` (a callback returning a fully custom input element)
        // was removed along with the old single-string masked input it fed -
        // the field itself is no longer a plain <input> we can substitute
        // wholesale, it's a segmented, div-based contentEditable element.
        // `slotProps.textField` is the supported way to style/configure
        // MUI's own field rendering instead - listing only the field-level
        // props this component actually cares about (rather than spreading
        // the full OutlinedInputProps-shaped rest object) avoids passing
        // through generic HTML attributes (onKeyDown, contentEditable, ...)
        // that are typed for the old plain-<input> shape and no longer fit.
        slotProps={{
          textField: {
            label,
            error,
            className,
            // TextInputProps' helperText is { component?, node } (this
            // app's own convention); PickersTextFieldProps expects a plain
            // ReactNode, so only the content carries over here.
            helperText: helperText?.node,
            fullWidth: true,
            slotProps: {
              input: {
                endAdornment: showAdornment ? endAdornment : undefined,
              },
            },
          },
        }}
        // `value` can genuinely be `undefined` on first render (record data
        // hasn't loaded yet - the initial state object has no key for this
        // field at all), then `null`/a real Date once it has. MUI's picker
        // decides controlled-vs-uncontrolled from whether `value` is
        // `undefined` on its first render, so that transition needs to be
        // masked here rather than passed through.
        value={value ?? null}
      />
    </LocalizationProvider>
  );
}
