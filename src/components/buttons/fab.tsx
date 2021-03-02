import React, { ReactElement } from 'react';
import { Fab, FabProps, Tooltip } from '@material-ui/core';
import { SvgIconType } from '@/types/elements';

export interface FloatButtonProps extends FabProps {
  icon: SvgIconType;
  tooltip?: string;
}

export default function FloatButton({
  icon: Icon,
  tooltip,
  ...props
}: FloatButtonProps): ReactElement {
  return (
    <>
      {tooltip ? (
        <Tooltip title={tooltip}>
          <Fab {...props}>
            <Icon />
          </Fab>
        </Tooltip>
      ) : (
        <Fab {...props}>
          <Icon />
        </Fab>
      )}
    </>
  );
}
