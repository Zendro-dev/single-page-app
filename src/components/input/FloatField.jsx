import { useRef } from 'react';
import { TextField } from '@material-ui/core';
import InputContainer from './InputContainer';

export default function FloatField({ leftIcon, rightIcon, value, ...props }) {
  const floatValue = useRef(value ?? null);

  const handleOnChange = (event) => {
    floatValue.current = parseFloat(event.target.value);

    if (!isNaN(floatValue.current) && props.onChange) {
      props.onChange(floatValue.current);
    }
  };

  return (
    <InputContainer leftIcon={leftIcon} rightIcon={rightIcon}>
      <TextField
        {...props}
        fullWidth
        value={value !== undefined && value !== null ? value.toString() : ''}
        type="number"
        margin="normal"
        variant="outlined"
        onChange={handleOnChange}
      />
    </InputContainer>
  );
}
