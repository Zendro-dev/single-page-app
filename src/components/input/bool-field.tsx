import { ReactElement, useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from '@material-ui/core';
import { BaseFieldProps } from './base-field';

export interface BoolFieldProps {
  onChange?: (value: boolean | null) => void;
  value: boolean | null;
}

export default function BoolField({
  error,
  helperText,
  InputProps,
  label,
  onChange,
  value,
}: BaseFieldProps<BoolFieldProps>): ReactElement {
  const classes = useStyles();

  const [checked, setChecked] = useState(value || false);
  const [indeterminate, setIndeterminate] = useState(value === null);

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.target.checked && !indeterminate) {
      setChecked(true);
      if (onChange) {
        onChange(true);
      }
    } else if (!event.target.checked && !indeterminate) {
      setChecked(false);
      setIndeterminate(true);
      if (onChange) {
        onChange(null);
      }
    } else if (event.target.checked && indeterminate) {
      setChecked(false);
      setIndeterminate(false);
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
            checked={checked}
            indeterminate={indeterminate}
            onChange={InputProps?.readOnly ? undefined : handleOnChange}
          />
        }
        label={label}
      />
      {helperText && (
        <FormHelperText className={classes.helperText}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
}

const useStyles = makeStyles((theme) =>
  createStyles({
    error: {
      color: 'red',
    },
    helperText: {
      marginLeft: theme.spacing(4),
    },
    root: {
      margin: theme.spacing(5, 0, 2, 0),
    },
  })
);
