import { SvgIconTypeMap } from '@material-ui/core';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';

export type SvgIconType = OverridableComponent<
  SvgIconTypeMap<Record<string, unknown>, 'svg'>
> & {
  muiName: string;
};
