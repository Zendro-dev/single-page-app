import { ReactElement } from 'react';
import { Overwrite } from 'utility-types';
import { Theme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from '@mui/material';
import { TextInputProps } from '@/components/text-input';

type BoolFieldProps = Overwrite<
  TextInputProps,
  {
    onChange?: (value: boolean | null) => void;
    value: boolean | null;
  }
>;

export default function BoolField({
  error,
  helperText,
  label,
  onChange,
  readOnly,
  value,
}: BoolFieldProps): ReactElement {
  const classes = useStyles();

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const { checked } = event.target;

    /**
     * If the indeterminate prop is set to true, the component appears indeterminate.
     * This does not set the native input element to indeterminate due to inconsistent
     * behavior across browsers. However, a data-indeterminate attribute is set on the
     * input.
     *
     * Source: https://next.material-ui.com/api/checkbox/
     */
    const indeterminate = event.target.getAttribute('data-indeterminate') as
      | 'true'
      | 'false';

    if (checked && indeterminate === 'false') {
      if (onChange) {
        onChange(true);
      }
    } else if (!checked && indeterminate === 'false') {
      if (onChange) {
        onChange(null);
      }
    } else if (checked && indeterminate === 'true') {
      if (onChange) {
        onChange(false);
      }
    }
  };

  return (
    <FormControl className={classes.root} error={error}>
      <FormControlLabel
        className={error ? classes.error : ''}
        control={
          <Checkbox
            className={error ? classes.error : ''}
            color="default"
            checked={value ?? false}
            indeterminate={value === null}
            onChange={readOnly ? undefined : handleOnChange}
          />
        }
        label={label}
      />
      {helperText && (
        <FormHelperText
          component={helperText.component ?? 'p'}
          className={classes.helperText}
        >
          {helperText.node}
        </FormHelperText>
      )}
    </FormControl>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    error: {
      color: 'red',
    },
    helperText: {
      marginLeft: theme.spacing(4),
    },
    root: {
      margin: theme.spacing(1, 0, 2, 0),
    },
  })
);
