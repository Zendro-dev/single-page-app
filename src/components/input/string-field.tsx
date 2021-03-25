import { ReactElement } from 'react';
import { Overwrite } from 'utility-types';
import TextField, { TextFieldProps } from './text-field';

type StringFieldProps = Overwrite<
  TextFieldProps,
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

  return <TextField {...props} onChange={handleOnChange} value={value ?? ''} />;
}
