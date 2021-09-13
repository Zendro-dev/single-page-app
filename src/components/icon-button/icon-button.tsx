import React, { ReactElement } from 'react';
import {
  IconButton as MuiIconButton,
  IconButtonProps as MuiIconButtonProps,
  Tooltip,
} from '@mui/material';

export interface IconButtonProps extends MuiIconButtonProps {
  component?: React.ElementType;
  tooltip?: string;
}

export default function IconButton({
  tooltip,
  onClick,
  ...props
}: IconButtonProps): ReactElement {
  return (
    <>
      {tooltip ? (
        <Tooltip title={tooltip} arrow disableInteractive>
          <MuiIconButton
            component={props.disabled ? 'span' : props.component ?? 'button'}
            {...props}
            onClick={onClick}
          >
            {props.children}
          </MuiIconButton>
        </Tooltip>
      ) : (
        <MuiIconButton {...props} onClick={onClick}>
          {props.children}
        </MuiIconButton>
      )}
    </>
  );
}
