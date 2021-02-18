import { useRef } from 'react';
import { TextField } from '@material-ui/core';
import InputContainer from './InputContainer';

export default function IntField({ leftIcon, rightIcon, value, ...props }) {
  const intValue = useRef(value ?? null);

  const handleOnChange = (event) => {
    intValue.current = Math.round(parseFloat(event.target.value));

    if (!isNaN(intValue.current) && props.onChange) {
      props.onChange(intValue.current);
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
        variant={'outlined'}
        onChange={handleOnChange}
      />
    </InputContainer>
  );
}
