import { TextField, Chip, Paper, withWidth } from '@material-ui/core';
import InputContainer from './InputContainer';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    justifyContent: 'start',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

export default function ArrayField({ leftIcon, rightIcon, value, ...props }) {
  const classes = useStyles();
  const arrayType = props.InputProps.arraytype;
  const [chipData, setChipData] = useState(
    value
      ? value.map((data, index) => {
          return { key: index, label: data.toString() };
        })
      : []
  );
  const [displayValue, setDisplayValue] = useState(
    value ? value.toString() : ''
  );
  let parseValue = (input, arrayType) => {
    let array = input.split(',');
    if (array[array.length - 1] === '') {
      array = array.slice(0, array.length - 1);
    }
    let typeSet = ['String', 'Date', 'Time', 'DateTime'];
    if (typeSet.includes(arrayType)) {
      return array;
    } else if (arrayType === 'Int') {
      return array.map((x) => parseInt(x));
    } else if (arrayType === 'Float') {
      return array.map((x) => parseFloat(x));
    } else if (arrayType === 'Boolean') {
      return array.map((x) => x === 'true');
    } else {
      console.log('No support for current type. Please check your input.');
      return null;
    }
  };
  const handleOnTextChange = (event) => {
    const computedValue =
      event.target.value === ''
        ? null
        : parseValue(event.target.value, arrayType);
    setDisplayValue(event.target.value);

    if (props.onChange) {
      props.onChange(computedValue);
      if (computedValue !== null) {
        setChipData(
          computedValue.map((data, index) => {
            return { key: index, label: data.toString() };
          })
        );
      } else {
        setChipData([]);
      }
    }
  };

  const handleDelete = (chipToDelete) => () => {
    setChipData((chips) =>
      chips.filter((chip) => chip.key !== chipToDelete.key)
    );
    if (props.onChange) {
      let remainingChips = chipData
        .filter((chip) => chip.key !== chipToDelete.key)
        .map((chip) => chip.label);
      setDisplayValue(remainingChips.toString());
      props.onChange(remainingChips === [] ? null : remainingChips);
    }
  };

  return (
    <InputContainer leftIcon={leftIcon} rightIcon={rightIcon}>
      <div>
        <TextField
          {...props}
          fullWidth
          multiline
          margin="normal"
          variant="outlined"
          value={value ? displayValue : ''}
          onChange={handleOnTextChange}
        />
        <Paper component="ul" className={classes.paper}>
          {value &&
            chipData.map((data) => {
              return (
                <li key={data.key}>
                  <Chip
                    label={data.label}
                    onDelete={handleDelete(data)}
                    variant="outlined"
                    color="primary"
                    className={classes.chip}
                  />
                </li>
              );
            })}
        </Paper>
      </div>
    </InputContainer>
  );
}
