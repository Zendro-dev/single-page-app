import { ReactElement } from 'react';
import BaseField, { BaseFieldProps } from './base-field';

export interface StringFieldProps {
  onChange?: (value: string | null) => void;
  value: string | null;
}

export default function StringField({
  onChange,
  value,
  ...props
}: BaseFieldProps<StringFieldProps>): ReactElement {
  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return <BaseField {...props} onChange={handleOnChange} value={value ?? ''} />;
}
