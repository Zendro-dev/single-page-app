import React, { PropsWithChildren, ReactElement } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

interface ClickableIconProps {
  tooltip: string;
  disabled?: boolean;
  handleOnClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function ClickableIcon({
  tooltip,
  handleOnClick,
  disabled,
  children,
}: PropsWithChildren<ClickableIconProps>): ReactElement {
  return (
    <Tooltip title={tooltip}>
      <span>
        <IconButton color="inherit" disabled={disabled} onClick={handleOnClick}>
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );
}
