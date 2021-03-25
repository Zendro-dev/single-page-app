import { ReactElement, ReactNode } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  OutlinedInputProps,
} from '@material-ui/core';

export interface TextFieldProps extends OutlinedInputProps {
  helperText?: {
    component?: React.ElementType;
    node: ReactNode;
  };
}

export default function TextField({
  error,
  helperText,
  label,
  ...props
}: TextFieldProps): ReactElement {
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

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: '100%',
      margin: theme.spacing(5, 0, 2, 0),
    },
    helperText: {
      marginLeft: theme.spacing(4),
      padding: 0,
    },
    input: {},
  })
);
