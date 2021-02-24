import { TextField, TextFieldProps } from '@material-ui/core';
import { ReactElement } from 'react';
import InputContainer, { InputContainerProps } from './input-container';

interface IntFieldProps {
  onChange: (value: number | null) => void;
  value: number | null;
}

export default function IntField({
  leftIcon,
  rightIcon,
  value,
  ...props
}: IntFieldProps & InputContainerProps & TextFieldProps): ReactElement {
  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const intValue =
      event.target.value === ''
        ? null
        : Math.round(parseFloat(event.target.value));

    if ((intValue === null || !isNaN(intValue)) && props.onChange) {
      props.onChange(intValue);
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
