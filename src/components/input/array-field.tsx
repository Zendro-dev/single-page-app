import { ReactElement } from 'react';
import { Overwrite } from 'utility-types';

import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/Add';

import {
  IconButton,
  InputAdornment,
  Tooltip,
  SvgIconProps,
} from '@material-ui/core';
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
    value: AttributeValue;
  }
>;

type ArrayFieldProps = Overwrite<
  TextFieldProps,
  {
    onChange?: (value: AttributeArrayType) => void;
    onError?: (value?: string) => void;
    value: any; //boolean[] | Date[] | number[] | string[] | null;
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
  const handleOnChange2 = (index: number) => (v: AttributeValue): void => {
    //if (index === -1 && v !== null) {

    console.log('VALUE ', v);
    if (index === -1) {
      value ? value.push(null) : (value = [null]);
    } else if (value) {
      value[index] = v;
    }
    if (onChange) {
      onChange(value);
    }
  };

  // const handleOnChange = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  //   index: number
  // ): void => {
  //   if (index === -1) {
  //     value ? value.push(event.target.value) : (value = [event.target.value]);
  //   } else if (value) {
  //     value[index] = event.target.value;
  //   }
  //   if (onChange) {
  //     onChange(value);
  //   }
  // };
  const addItem = () => {
    console.log('Clicked ADD');
    value ? value.push(null) : (value = [null]);
    if (onChange) {
      onChange(value);
    }
  };

  const handleOnClear = (index: number): void => {
    console.log('Clear this');
    if (onChange && !props.readOnly) {
      value[index] = null;
      onChange(value);
    }
  };

  return (
    <List subheader={<ListSubheader> {label} </ListSubheader>}>
      <ListItem button onClick={addItem}>
        <ListItemIcon>
          <AddIcon />
        </ListItemIcon>
        <ListItemText primary="Add item" />
      </ListItem>
      {value &&
        value.map((v: any, index: any) => (
          <ListItem key={index}>
            <FieldIcons
              rightIcon={(props: SvgIconProps): ReactElement => (
                <Tooltip title="Add item below">
                  <IconButton
                    tabIndex="-1"
                    onClick={() => {
                      handleOnClear(index);
                    }}
                  >
                    <AddIcon {...props} />
                  </IconButton>
                </Tooltip>
              )}
            >
              <ArrayInputField
                {...props}
                type={type}
                value={v}
                label={'array item'}
                onChange={handleOnChange2(index)}
                onError={onError}
                endAdornment={
                  onChange && (
                    <InputAdornment position="end">
                      <Tooltip title="Unset item">
                        <span>
                          <IconButton
                            tabIndex="-1"
                            onClick={() => {
                              handleOnClear(index);
                            }}
                          >
                            <ClearIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Delete item">
                        <span>
                          <IconButton
                            tabIndex="-1"
                            onClick={() => {
                              handleOnClear(index);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
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
