import { ReactElement } from 'react';
import { TextField, TextFieldProps } from '@material-ui/core';
import InputContainer, { InputContainerProps } from './input-container';

interface StringFieldProps {
  onChange: (value: string | null) => void;
  value: string | null;
}

export default function StringField({
  leftIcon,
  rightIcon,
  value,
  ...props
}: StringFieldProps & InputContainerProps & TextFieldProps): ReactElement {
  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const computedValue = event.target.value === '' ? null : event.target.value;

    if (props.onChange) {
      props.onChange(computedValue);
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
