import { TextField, TextFieldProps } from '@material-ui/core';
import { ReactElement } from 'react';
import InputContainer, { InputContainerProps } from './input-container';

interface FloatFieldProps {
  onChange: (value: number | null) => void;
  value: number | null;
}

export default function FloatField({
  leftIcon,
  rightIcon,
  value,
  ...props
}: FloatFieldProps & InputContainerProps & TextFieldProps): ReactElement {
  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const floatValue =
      event.target.value === '' ? null : parseFloat(event.target.value);

    if ((floatValue === null || !isNaN(floatValue)) && props.onChange) {
      props.onChange(floatValue);
    }
  };

  return (
    <InputContainer leftIcon={leftIcon} rightIcon={rightIcon}>
      <TextField
        {...props}
        fullWidth
        value={value ?? ''}
        type="number"
        margin="normal"
        variant="outlined"
        onChange={handleOnChange}
      />
    </InputContainer>
  );
}
