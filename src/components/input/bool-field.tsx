import { ReactElement, useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from '@material-ui/core';
import InputContainer, { WithContainerProps } from './input-container';
import { BaseInputFieldProps } from '@/types/elements';

export interface BoolFieldProps {
  onChange?: (value: boolean | null) => void;
  value: boolean | null;
}

type Props = WithContainerProps<BaseInputFieldProps<BoolFieldProps>>;

export default function BoolField({
  error,
  helperText,
  InputProps,
  label,
  leftIcon,
  onChange,
  rightIcon,
  value,
}: Props): ReactElement {
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
    <InputContainer
      inputType="checkbox"
      leftIcon={leftIcon}
      rightIcon={rightIcon}
    >
      <FormControl error={error}>
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
