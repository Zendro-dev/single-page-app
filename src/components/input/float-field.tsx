import { ReactElement } from 'react';
import BaseField, { BaseFieldProps } from './base-field';

export interface FloatFieldProps {
  onChange?: (value: number | null) => void;
  value: number | null;
}

export default function FloatField({
  onChange,
  value,
  ...props
}: BaseFieldProps<FloatFieldProps>): ReactElement {
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
    <BaseField
      {...props}
      onChange={handleOnChange}
      type="number"
      value={value ?? ''}
    />
  );
}
