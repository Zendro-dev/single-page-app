import { TextField } from '@material-ui/core';
import InputContainer from './InputContainer';

export default function FloatField({ leftIcon, rightIcon, value, ...props }) {
  const handleOnChange = (event) => {
    const floatValue = parseFloat(event.target.value);

    if (!isNaN(floatValue) && props.onChange) {
      props.onChange(floatValue);
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
