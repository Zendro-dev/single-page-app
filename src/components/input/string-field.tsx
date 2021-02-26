import { ReactElement } from 'react';
import { TextField } from '@material-ui/core';
import InputContainer, { WithContainerProps } from './input-container';
import { BaseInputFieldProps } from '@/types/elements';

export interface StringFieldProps {
  onChange?: (value: string | null) => void;
  value: string | null;
}

type Props = WithContainerProps<BaseInputFieldProps<StringFieldProps>>;

export default function StringField({
  InputProps,
  label,
  leftIcon,
  onChange,
  rightIcon,
  value,
}: Props): ReactElement {
  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (onChange) {
      onChange(event.target.value || null);
    }
  };

  return (
    <InputContainer leftIcon={leftIcon} rightIcon={rightIcon}>
      <TextField
        InputProps={InputProps}
        fullWidth
        label={label}
        margin="normal"
        onChange={handleOnChange}
        variant="outlined"
        value={value ?? ''}
      />
    </InputContainer>
  );
}
