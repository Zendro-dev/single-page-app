import { ReactElement } from 'react';

import {
  IconButton,
  InputAdornment,
  TextFieldProps,
  Tooltip,
} from '@material-ui/core';
import { Clear as ClearIcon } from '@material-ui/icons';

import InputContainer, { WithContainerProps } from './input-container';
import BoolField from './bool-field';
import DateTimeField from './datetime-field';
import FloatField from './float-field';
import IntField from './int-field';
import StringField from './string-field';

import { BaseFieldProps } from './base-field';
import {
  AttributeArrayType,
  AttributeScalarType,
  AttributeValue,
} from '@/types/models';

interface InputFieldProps {
  onChange?: (value: AttributeValue) => void;
  onError?: (value?: string) => void;
  type: AttributeScalarType | AttributeArrayType;
  value: AttributeValue;
}

type CommonProps = Pick<TextFieldProps, 'InputProps' | 'variant'>;

const InputField = ({
  type,
  value,
  ...props
}: InputFieldProps & CommonProps): ReactElement => {
  switch (type) {
    case 'Boolean':
      return <BoolField {...props} value={value as boolean | null} />;
    case 'DateTime':
      return <DateTimeField {...props} value={value as Date | null} />;
    case 'Float':
      return <FloatField {...props} value={value as number | null} />;
    case 'Int':
      return <IntField {...props} value={value as number | null} />;
    case 'String':
      return <StringField {...props} value={value as string | null} />;
    default:
      return <StringField {...props} value={value as string | null} />;
  }
};

export default function AttributeField({
  leftIcon,
  rightIcon,
  InputProps,
  ...props
}: WithContainerProps<BaseFieldProps<InputFieldProps>>): ReactElement {
  const handleOnChange = (value: AttributeValue): void => {
    if (props.onChange) props.onChange(value);
  };

  const handleOnClear = (): void => {
    if (props.onChange && !InputProps?.readOnly) props.onChange(null);
    if (props.onError) props.onError();
  };

  return (
    <InputContainer leftIcon={leftIcon} rightIcon={rightIcon}>
      <InputField
        {...props}
        onChange={props.onChange ? handleOnChange : undefined}
        InputProps={{
          ...InputProps,
          endAdornment: props.onChange && (
            <InputAdornment position="end">
              <Tooltip title="Unset value">
                <span>
                  <IconButton tabIndex="-1" onClick={handleOnClear}>
                    <ClearIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />
    </InputContainer>
  );
}
