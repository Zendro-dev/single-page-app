import { ReactElement } from 'react';
import { Overwrite } from 'utility-types';
import TextInput, { TextInputProps } from '@/components/text-input';

type FloatFieldProps = Overwrite<
  TextInputProps,
  {
    onChange?: (value: number | null) => void;
    onError?: (value?: string) => void;
    value: number | null;
  }
>;

export default function FloatField({
  onChange,
  onError,
  value,
  ...props
}: FloatFieldProps): ReactElement {
  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const floatValue =
      event.target.value === '' ? null : parseFloat(event.target.value);

    if ((floatValue === null || !isNaN(floatValue)) && onChange && onError) {
      onError();
      onChange(floatValue);
    }
  };

  const handleOnKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (/^[+\-.e]{1}$/.test(event.key)) {
      return;
    }
    if (/^\D{1}$/.test(event.key)) {
      if (onError) onError('Please enter a valid number');
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
