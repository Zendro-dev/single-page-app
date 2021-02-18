import { TextField } from '@material-ui/core';
import InputContainer from './InputContainer';

export default function StringField({ leftIcon, rightIcon, value, ...props }) {
  const handleOnChange = (event) => {
    const computedValue = event.target.value === '' ? null : event.target.value;

    if (props.onChange) {
      props.onChange(computedValue);
    }
  };

  return (
    <InputContainer leftIcon={leftIcon} rightIcon={rightIcon}>
      <TextField
        {...props}
        fullWidth
        multiline
        margin="normal"
        variant="outlined"
        value={value ?? ''}
        onChange={handleOnChange}
      />
    </InputContainer>
  );
}
