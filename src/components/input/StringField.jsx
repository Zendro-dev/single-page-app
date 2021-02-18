import { useRef } from 'react';
import { TextField } from '@material-ui/core';
import InputContainer from './InputContainer';

export default function StringField({ leftIcon, rightIcon, value, ...props }) {
  const computedValue = useRef(value);
  const handleOnChange = (event) => {
    computedValue.current = event.target.value;

    if (props.onChange) {
      props.onChange(computedValue.current);
    }
  };

  return (
    <InputContainer leftIcon={leftIcon} rightIcon={rightIcon}>
      <TextField
        {...props}
        fullWidth
        multiline
        margin="normal"
        variant="outlined"
        value={value ?? ''}
        onChange={handleOnChange}
      />
    </InputContainer>
  );
}
