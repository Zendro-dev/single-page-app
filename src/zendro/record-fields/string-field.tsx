import { ReactElement } from 'react';
import { Overwrite } from 'utility-types';
import TextInput, { TextInputProps } from '@/components/text-input';

type StringFieldProps = Overwrite<
  TextInputProps,
  {
    onChange?: (value: string | null) => void;
    value: string | null;
  }
>;

export default function StringField({
  onChange,
  value,
  ...props
}: StringFieldProps): ReactElement {
  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return <TextInput {...props} onChange={handleOnChange} value={value ?? ''} />;
}
