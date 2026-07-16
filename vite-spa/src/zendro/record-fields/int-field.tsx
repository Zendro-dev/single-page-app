import { ReactElement } from 'react';
import { Overwrite } from 'utility-types';
import TextInput, { TextInputProps } from '@/components/text-input';

type IntFieldProps = Overwrite<
  TextInputProps,
  {
    onChange?: (value: number | null) => void;
    onError?: (value?: string) => void;
    value: number | null;
  }
>;

export default function IntField({
  onChange,
  onError,
  value,
  ...props
}: IntFieldProps): ReactElement {
  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const intValue =
      event.target.value === ''
        ? null
        : Math.round(parseFloat(event.target.value));

    if ((intValue === null || !isNaN(intValue)) && onChange && onError) {
      onError();
      onChange(intValue);
    }
  };

  const handleOnKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (/^[+\-.e]{1}$/.test(event.key)) {
      return;
    }
    if (/^\D{1}$/.test(event.key)) {
      if (onError) onError('Please enter a valid integer');
      event.preventDefault();
      return;
    }
  };

  return (
    <TextInput
      {...props}
      onChange={handleOnChange}
      onKeyDown={handleOnKeyDown}
      type="number"
      value={value ?? ''}
    />
  );
}
