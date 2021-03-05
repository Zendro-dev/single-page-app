import { ReactElement, ReactNode } from 'react';
import { InputProps, TextField } from '@material-ui/core';

export type BaseFieldProps<T = Record<string, unknown>> = T & {
  error?: boolean;
  helperText?: ReactNode;
  InputProps?: InputProps;
  label?: ReactNode;
};

export default function BaseField({ ...props }: BaseFieldProps): ReactElement {
  return <TextField {...props} fullWidth margin="normal" variant="outlined" />;
}
