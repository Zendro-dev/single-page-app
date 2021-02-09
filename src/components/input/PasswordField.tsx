import { ReactElement, useState } from 'react';
import { IconButton, InputAdornment, Tooltip } from '@material-ui/core';

import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@material-ui/icons';

import StringField, { StringFieldProps } from './LoginField';

interface State {
  showPassword: boolean;
}

export default function PasswordField(props: StringFieldProps): ReactElement {
  const [state, setState] = useState<State>({
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setState((state) => ({ ...state, showPassword: !state.showPassword }));
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <StringField
      {...props}
      type={state.showPassword ? 'text' : 'password'}
      autoComplete="off"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Tooltip title="Show Password">
              <IconButton
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
              >
                {state.showPassword ? (
                  <VisibilityOffIcon />
                ) : (
                  <VisibilityIcon />
                )}
              </IconButton>
            </Tooltip>
          </InputAdornment>
        ),
      }}
    />
  );
}
