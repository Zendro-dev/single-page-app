import { ReactElement } from 'react';
import { Overwrite } from 'utility-types';

import { IconButton, InputAdornment, Tooltip } from '@material-ui/core';
import { Clear as ClearIcon } from '@material-ui/icons';

import {
  BoolField,
  DateTimeField,
  FieldIcons,
  FloatField,
  IntField,
  StringField,
  ArrayField,
  TextFieldProps,
  WithIcons,
} from '@/components/input';

import {
  AttributeArrayType,
  AttributeScalarType,
  AttributeValue,
} from '@/types/models';

type InputFieldProps = Overwrite<
  TextFieldProps,
  {
    onChange?: (value: AttributeValue) => void;
    onError?: (value?: string) => void;
    type: AttributeScalarType | AttributeArrayType;
    value: AttributeValue;
  }
>;

const InputField = ({
  onError,
  type,
  value,
  ...props
}: Overwrite<TextFieldProps, InputFieldProps>): ReactElement => {
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
};

export default function AttributeField({
  leftIcon,
  rightIcon,
  ...props
}: WithIcons<InputFieldProps>): ReactElement {
  const handleOnChange = (value: AttributeValue): void => {
    if (props.onChange) props.onChange(value);
  };

  const handleOnClear = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    if (props.onChange && !props.readOnly) props.onChange(null);
    if (props.onError) props.onError();
  };

  return (
    <FieldIcons leftIcon={leftIcon} rightIcon={rightIcon}>
      <InputField
        {...props}
        onChange={props.onChange ? handleOnChange : undefined}
        endAdornment={
          props.onChange && (
            <InputAdornment position="end">
              <Tooltip title="Unset value">
                <span>
                  <IconButton tabIndex="-1" onClick={handleOnClear}>
                    <ClearIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </InputAdornment>
          )
        }
      />
    </FieldIcons>
  );
}
