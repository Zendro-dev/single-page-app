import { BaseInputFieldProps } from '@/types/elements';
import { TextField } from '@material-ui/core';
import { ReactElement } from 'react';
import InputContainer, { WithContainerProps } from './input-container';

export interface IntFieldProps {
  onChange?: (value: number | null) => void;
  value: number | null;
}

type Props = WithContainerProps<BaseInputFieldProps<IntFieldProps>>;

export default function IntField({
  error,
  helperText,
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
    const intValue =
      event.target.value === ''
        ? null
        : Math.round(parseFloat(event.target.value));

    if ((intValue === null || !isNaN(intValue)) && onChange) {
      onChange(intValue);
    }
  };

  return (
    <InputContainer leftIcon={leftIcon} rightIcon={rightIcon}>
      <TextField
        error={error}
        helperText={helperText}
        fullWidth
        InputProps={InputProps}
        label={label}
        margin="normal"
        onChange={handleOnChange}
        type="number"
        variant="outlined"
        value={value ?? ''}
      />
    </InputContainer>
  );
}
