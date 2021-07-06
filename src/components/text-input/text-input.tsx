import { ReactElement, ReactNode } from 'react';
import { Theme } from '@material-ui/core/styles';
import { createStyles, makeStyles } from '@material-ui/styles';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  OutlinedInputProps,
} from '@material-ui/core';

export interface TextInputProps extends OutlinedInputProps {
  helperText?: {
    component?: React.ElementType;
    node: ReactNode;
  };
}

export default function TextInput({
  error,
  helperText,
  label,
  ...props
}: TextInputProps): ReactElement {
  const classes = useStyles();

  return (
    <FormControl className={classes.root} error={error}>
      <InputLabel variant="outlined">{label}</InputLabel>
      <OutlinedInput {...props} label={label} fullWidth />
      {helperText && (
        <FormHelperText
          component={helperText.component ?? 'p'}
          className={classes.helperText}
        >
          {helperText.node}
        </FormHelperText>
      )}
    </FormControl>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    helperText: {
      width: '100%',
      marginTop: theme.spacing(1),
      padding: theme.spacing(0, 4, 0, 4),
    },
  })
);
