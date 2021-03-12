import { ReactElement } from 'react';
import BaseField, { BaseFieldProps } from './base-field';

export interface IntFieldProps {
  onChange?: (value: number | string | null) => void;
  onError?: (value: string | null) => void;
  value: number | null;
}

function containsLetter(value: string) {
  return value.match('[^0-9]');
}

export default function IntField({
  onChange,
  onError,
  value,
  ...props
}: BaseFieldProps<IntFieldProps>): ReactElement {
  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    let error: string | null = 'Please enter a valid integer';

    const intValue =
      event.target.value === '' ? null : parseInt(event.target.value);

    if (
      (intValue === null || !containsLetter(event.target.value)) &&
      onChange
    ) {
      error = null;
      onChange(intValue);
    }

    if (onError) {
      onError(error);
    }
  };

  return (
    <BaseField
      {...props}
      onChange={handleOnChange}
      type="text"
      value={value ?? ''}
    />
  );
}
