import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

export type SvgIconType = OverridableComponent<
  SvgIconTypeMap<Record<string, unknown>, 'svg'>
> & {
  muiName: string;
};
