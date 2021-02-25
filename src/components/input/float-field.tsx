import { TextField } from '@material-ui/core';
import { ReactElement } from 'react';
import InputContainer, { WithContainerProps } from './input-container';
import { BaseInputFieldProps } from '@/types/elements';

interface FloatFieldProps {
  onChange?: (value: number | null) => void;
  value: number | null;
}

type Props = WithContainerProps<BaseInputFieldProps<FloatFieldProps>>;

export default function FloatField({
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
    const floatValue =
      event.target.value === '' ? null : parseFloat(event.target.value);

    if ((floatValue === null || !isNaN(floatValue)) && onChange) {
      onChange(floatValue);
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
        type="number"
        variant="outlined"
        value={value ?? ''}
      />
    </InputContainer>
  );
}
