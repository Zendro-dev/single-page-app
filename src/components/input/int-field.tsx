import { ReactElement } from 'react';
import BaseField, { BaseFieldProps } from './base-field';

export interface IntFieldProps {
  onChange?: (value: number | null) => void;
  value: number | null;
}

export default function IntField({
  onChange,
  value,
  ...props
}: BaseFieldProps<IntFieldProps>): ReactElement {
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
    <BaseField
      {...props}
      onChange={handleOnChange}
      type="number"
      value={value ?? ''}
      // inputProps = {{
      //   pattern: "[0-9]"
      // }}
    />
  );
}
