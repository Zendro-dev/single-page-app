import { ReactElement } from 'react';
import { Overwrite } from 'utility-types';

import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/Add';

import { InputAdornment, SvgIconProps } from '@material-ui/core';
import { Clear as ClearIcon } from '@material-ui/icons';
import { Delete as DeleteIcon } from '@material-ui/icons';

import {
  BoolField,
  DateTimeField,
  FieldIcons,
  FloatField,
  IntField,
  StringField,
  TextFieldProps,
} from '@/components/input';

import ClickableIcon from '@/components/buttons/icon-button';

import { AttributeArrayValue, AttributeScalarValue } from '@/types/models';

type InputFieldProps = Overwrite<
  TextFieldProps,
  {
    onChange?: (value: AttributeScalarValue) => void;
    onError?: (value?: string) => void;
    value: AttributeScalarValue;
  }
>;

type ArrayFieldProps = Overwrite<
  TextFieldProps,
  {
    onChange?: (value: AttributeArrayValue) => void;
    onError?: (value?: string) => void;
    value: AttributeArrayValue;
  }
>;

const ArrayInputField = ({
  type,
  value,
  onError,
  ...props
}: Overwrite<TextFieldProps, InputFieldProps>): ReactElement => {
  switch (type) {
    case '[Boolean]':
      return <BoolField {...props} value={value as boolean | null} />;
    case '[DateTime]':
      return <DateTimeField {...props} value={value as Date | null} />;
    case '[Float]':
      return (
        <FloatField
          {...props}
          onError={onError}
          value={value as number | null}
        />
      );
    case '[Int]':
      return (
        <IntField {...props} onError={onError} value={value as number | null} />
      );
    case '[String]':
      return <StringField {...props} value={value as string | null} />;
    default:
      return <StringField {...props} value={value as string | null} />;
  }
};

export default function ArrayField({
  onChange,
  onError,
  value,
  endAdornment,
  type,
  label,
  ...props
}: ArrayFieldProps): ReactElement {
  const handleOnChange = (index: number) => (v: AttributeScalarValue): void => {
    if (onChange && value) {
      value[index] = v;
      onChange(value);
    }
  };

  const addItem = (index: number): void => {
    value ? value.splice(index + 1, 0, null) : (value = [null]);
    if (onChange) {
      onChange(value);
    }
  };

  const handleOnClear = (index: number): void => {
    if (value && onChange && !props.readOnly) {
      value[index] = null;
      onChange(value);
    }
  };

  const deleteItem = (index: number): void => {
    if (value && onChange && !props.readOnly) {
      value.splice(index, 1);
      onChange(value);
    }
  };

  return (
    <List subheader={<ListSubheader> {label} </ListSubheader>}>
      {onChange && (
        <ListItem
          button
          onClick={() => {
            addItem(-1);
          }}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Add item" />
        </ListItem>
      )}
      {value &&
        value.map((v: AttributeScalarValue, index: number) => (
          <ListItem key={index}>
            <FieldIcons
              rightIcon={
                onChange
                  ? (props: SvgIconProps): ReactElement => (
                      <ClickableIcon
                        tooltip="Add item below"
                        handleOnClick={() => addItem(index)}
                      >
                        <AddIcon {...props} />
                      </ClickableIcon>
                    )
                  : undefined
              }
            >
              <ArrayInputField
                {...props}
                type={type}
                value={v}
                label={'array item'}
                onChange={handleOnChange(index)}
                onError={onError}
                endAdornment={
                  onChange && (
                    <InputAdornment position="end">
                      <ClickableIcon
                        tooltip="Unset item"
                        handleOnClick={() => handleOnClear(index)}
                      >
                        <ClearIcon />
                      </ClickableIcon>
                      <ClickableIcon
                        tooltip="Delete item"
                        handleOnClick={() => deleteItem(index)}
                      >
                        <DeleteIcon />
                      </ClickableIcon>
                    </InputAdornment>
                  )
                }
              />
            </FieldIcons>
          </ListItem>
        ))}
    </List>
  );
}
