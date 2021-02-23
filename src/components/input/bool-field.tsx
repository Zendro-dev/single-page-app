import { ReactElement, useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  Checkbox,
  CheckboxProps,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputProps,
} from '@material-ui/core';
import InputContainer from './InputContainer';

import { SvgIconType } from '@/types/elements';

interface BoolFieldProps {
  error?: boolean;
  helperText?: string;
  InputProps?: InputProps;
  label: string;
  leftIcon?: SvgIconType;
  onChange: (value: boolean | null) => void;
  rightIcon?: SvgIconType;
  value: boolean | null;
}

export default function BoolField({
  label,
  leftIcon,
  rightIcon,
  value,
  error,
  helperText,
  InputProps,
  ...props
}: BoolFieldProps & CheckboxProps): ReactElement {
  const classes = useStyles();

  const [checked, setChecked] = useState(value || false);
  const [indeterminate, setIndeterminate] = useState(
    value !== undefined && value !== null ? false : true
  );

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.target.checked && !indeterminate) {
      setChecked(true);
      if (props.onChange) {
        props.onChange(true);
      }
    } else if (!event.target.checked && !indeterminate) {
      setChecked(false);
      setIndeterminate(true);
      if (props.onChange) {
        props.onChange(null);
      }
    } else if (event.target.checked && indeterminate) {
      setChecked(false);
      setIndeterminate(false);
      if (props.onChange) {
        props.onChange(false);
      }
    }
  };

  return (
    <InputContainer leftIcon={leftIcon} rightIcon={rightIcon}>
      <FormControl error={error}>
        <FormControlLabel
          className={error ? classes.error : ''}
          control={
            <Checkbox
              {...props}
              className={error ? classes.error : ''}
              color="default"
              checked={checked}
              indeterminate={indeterminate}
              onChange={handleOnChange}
              disabled={InputProps?.readOnly ? true : false}
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
    </InputContainer>
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
  })
);
