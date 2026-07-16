import { ReactElement } from 'react';
import { Overwrite } from 'utility-types';
import {
  AttributeArrayType,
  AttributeArrayValue,
  AttributeScalarType,
  AttributeScalarValue,
} from '@/types/models';

import { TextInputProps } from '@/components/text-input';

import BoolField from './bool-field';
import DateTimeField from './datetime-field';
import FloatField from './float-field';
import IntField from './int-field';
import StringField from './string-field';
import ArrayField from './array-field';

export type InputFieldProps = Overwrite<
  TextInputProps,
  {
    onChange?: (value: AttributeScalarValue | AttributeArrayValue) => void;
    onError?: (value?: string) => void;
    type: AttributeScalarType | AttributeArrayType;
    value: AttributeScalarValue | AttributeArrayValue;
  }
>;

export default function InputField({
  onError,
  type,
  value,
  ...props
}: Overwrite<TextInputProps, InputFieldProps>): ReactElement {
  switch (type) {
    case 'Boolean':
      return <BoolField {...props} value={value as boolean | null} />;
    case 'DateTime':
      return <DateTimeField {...props} value={value as Date | null} />;

    case 'Float':
      return (
        <FloatField
          {...props}
          onError={onError}
          value={value as number | null}
        />
      );
    case 'Int':
      return (
        <IntField {...props} onError={onError} value={value as number | null} />
      );
    case 'String':
      return <StringField {...props} value={value as string | null} />;
    case '[String]':
      return (
        <ArrayField {...props} type={type} value={value as string[] | null} />
      );
    case '[Boolean]':
      return (
        <ArrayField {...props} type={type} value={value as boolean[] | null} />
      );
    case '[DateTime]':
      return (
        <ArrayField {...props} type={type} value={value as Date[] | null} />
      );
    case '[Int]':
      return (
        <ArrayField
          {...props}
          onError={onError}
          type={type}
          value={value as number[] | null}
        />
      );
    case '[Float]':
      return (
        <ArrayField
          {...props}
          onError={onError}
          type={type}
          value={value as number[] | null}
        />
      );
    default:
      return <StringField {...props} value={value as string | null} />;
  }
}
