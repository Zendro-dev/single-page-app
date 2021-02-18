import { TextField } from '@material-ui/core';
import InputContainer from './InputContainer';

export default function IntField({ leftIcon, rightIcon, value, ...props }) {
  const handleOnChange = (event) => {
    const intValue =
      event.target.value === ''
        ? null
        : Math.round(parseFloat(event.target.value));

    if (!isNaN(intValue) && props.onChange) {
      props.onChange(intValue);
    }
  };

  return (
    <InputContainer leftIcon={leftIcon} rightIcon={rightIcon}>
      <TextField
        {...props}
        fullWidth
        value={value ?? ''}
        type="number"
        margin="normal"
        variant="outlined"
        onChange={handleOnChange}
      />
    </InputContainer>
  );
}
