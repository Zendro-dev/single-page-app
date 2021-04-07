import { ReactElement } from 'react';
import { Overwrite } from 'utility-types';
import TextField, { TextFieldProps } from './text-field';

type StringFieldProps = Overwrite<
  TextFieldProps,
  {
    onChange?: (value: string[] | null) => void;
    value: string[] | null;
  }
>;

export default function StringField({
  onChange,
  value,
  ...props
}: StringFieldProps): ReactElement {
  //const  [v1, setV1] = useState('');
  const handleOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ): void => {
    if (index === -1) {
      value ? value.push(event.target.value) : (value = [event.target.value]);
    } else if (value) {
      value[index] = event.target.value;
    }
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <>
      <TextField
        {...props}
        onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
          handleOnChange(ev, -1)
        }
        value={''}
      />
      {value &&
        value.map((v, index) => (
          <TextField
            key={index}
            {...props}
            onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
              handleOnChange(ev, index)
            }
            value={v ?? ''}
          />
        ))}
    </>
  );
}
