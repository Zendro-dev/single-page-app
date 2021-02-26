import { InputProps, SvgIconTypeMap } from '@material-ui/core';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';

export type BaseInputFieldProps<T = Record<string, unknown>> = T & {
  error?: boolean;
  helperText?: string;
  InputProps?: InputProps;
  label?: string;
};

export type SvgIconType = OverridableComponent<
  SvgIconTypeMap<Record<string, unknown>, 'svg'>
>;
