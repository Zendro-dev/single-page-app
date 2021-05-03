import { ReactElement } from 'react';

import { IconButton, InputAdornment, Tooltip } from '@material-ui/core';
import { Clear as ClearIcon } from '@material-ui/icons';

import { InputActions, WithActions } from '@/components/inputs';
import { AttributeValue, AttributeArrayValue } from '@/types/models';
import { InputField, InputFieldProps } from '@/zendro/record-fields';

export default function AttributeField({
  actionLeft: leftIcon,
  actionRight: rightIcon,
  ...props
}: WithActions<InputFieldProps>): ReactElement {
  const handleOnChange = (
    value: AttributeValue | AttributeArrayValue
  ): void => {
    if (props.onChange) props.onChange(value);
  };

  const handleOnClear = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    if (props.onChange && !props.readOnly) props.onChange(null);
    if (props.onError) props.onError();
  };

  return (
    <InputActions actionLeft={leftIcon} actionRight={rightIcon}>
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
    </InputActions>
  );
}
