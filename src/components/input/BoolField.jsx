import { useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from '@material-ui/core';
import InputContainer from './InputContainer';

export default function BoolField({
  leftIcon,
  rightIcon,
  value,
  error,
  helperText,
  InputProps,
  ...props
}) {
  const classes = useStyles();

  const [checked, setChecked] = useState(value || false);
  const [indeterminate, setIndeterminate] = useState(
    value !== undefined && value !== null ? false : true
  );

  const handleOnChange = (event) => {
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
              disabled={InputProps.readOnly ? true : false}
            />
          }
          label={props.label}
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
