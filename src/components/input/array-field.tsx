import { ReactElement } from 'react';
import { Overwrite } from 'utility-types';

import AddIcon from '@material-ui/icons/Add';

import { Button, InputAdornment, SvgIconProps } from '@material-ui/core';
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

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
  endAdornment: _,
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

  const addItem = (index: number) => (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    event.preventDefault();
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
    <div style={{ width: '100%', paddingBottom: '10px' }}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          {label}
        </AccordionSummary>
        <AccordionDetails>
          <fieldset
            style={{
              width: '100%',
              height: '150px',
              overflow: 'auto',
            }}
          >
            {onChange && (
              <Button fullWidth={true} onClick={addItem(-1)}>
                <AddIcon /> Add item
              </Button>
            )}
            {value &&
              value.map((v: AttributeScalarValue, index: number) => (
                <div key={index}>
                  <FieldIcons
                    rightIcon={
                      onChange
                        ? (props: SvgIconProps): ReactElement => (
                            <ClickableIcon
                              tooltip="Delete item"
                              handleOnClick={() => deleteItem(index)}
                            >
                              <DeleteIcon {...props} />
                            </ClickableIcon>
                          )
                        : undefined
                    }
                  >
                    <ArrayInputField
                      {...props}
                      type={type}
                      value={v}
                      label={'item ' + index}
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
                          </InputAdornment>
                        )
                      }
                    />
                  </FieldIcons>
                  {onChange && (
                    <Button fullWidth={true} onClick={addItem(index)}>
                      <AddIcon /> Add item
                    </Button>
                  )}
                </div>
              ))}
          </fieldset>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
