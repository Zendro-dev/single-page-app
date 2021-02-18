import { useMemo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import StringField from '../input/StringField';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Tooltip,
  Typography,
} from '@material-ui/core';
import {
  Clear as ClearIcon,
  Save as SaveIcon,
  VpnKey as Key,
} from '@material-ui/icons';

import BoolField from '../input/BoolField';
import DateTimeField from '../input/DateTimeField';
import IntegerField from '../input/IntField';
import FloatField from '../input/FloatField';

const field = {
  String: StringField,
  Boolean: BoolField,
  DateTime: DateTimeField,
  Integer: IntegerField,
  Float: FloatField,
};

const ClearButton = ({ onClick, ...buttonProps }) => {
  const handleOnClick = (event) => {
    event.preventDefault();
    console.log('clear');
    onClick();
  };

  return (
    <InputAdornment position="end">
      <Tooltip title="Reset">
        <IconButton {...buttonProps} onClick={handleOnClick}>
          <ClearIcon />
        </IconButton>
      </Tooltip>
    </InputAdornment>
  );
};

const KeyIcon = (props) => {
  return (
    <Tooltip title="This field cannot be edited">
      <Key {...props} fontSize="small" color="disabled" />
    </Tooltip>
  );
};

export default function AttributeForm({
  attributes,
  onSubmit,
  modelName,
  ...formProps
}) {
  const classes = useStyles();
  let record = {};
  for (let attrName of Object.keys(attributes)) {
    record[attrName] = attributes[attrName].value;
  }

  const [records, setRecords] = useState(record);

  const completedAttr = useMemo(() => {
    let number = 0;
    for (let attrName of Object.keys(records)) {
      if (records[attrName] !== null && records[attrName] !== undefined) {
        number += 1;
      }
    }
    return number + ' / ' + Object.keys(records).length + ' completed';
  }, [records]);

  const handleSetValue = (attrName) => (value) => {
    setRecords({ ...records, [attrName]: value });
  };

  const handleClearButton = (attrName) => () => {
    if (!attributes[attrName].readOnly) {
      setRecords({ ...records, [attrName]: null });
    }
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    onSubmit(records);
  };

  return (
    <form {...formProps} onSubmit={handleOnSubmit}>
      <legend className={classes.legend}>
        <Typography variant="h6" component="h1">
          Model: {modelName}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {completedAttr}
        </Typography>
      </legend>
      {Object.keys(attributes).map((attrName) => {
        const { type, readOnly, errMsg } = attributes[attrName];
        const InputField = field[type];
        return (
          <InputField
            key={attrName + '-' + type + 'Field'}
            label={attrName}
            value={records[attrName]}
            onChange={handleSetValue(attrName)}
            error={errMsg ? true : false}
            helperText={errMsg}
            InputProps={{
              readOnly: readOnly ? true : false,
              endAdornment: readOnly ? undefined : (
                <ClearButton onClick={handleClearButton(attrName)} />
              ),
            }}
            leftIcon={readOnly ? KeyIcon : false}
          />
        );
      })}
      <Box display="flex" justifyContent="flex-end" mr={9.5} mt={4}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          startIcon={<SaveIcon />}
        >
          Save
        </Button>
      </Box>
    </form>
  );
}

const useStyles = makeStyles((theme) => ({
  legend: {
    marginBottom: theme.spacing(6),
  },
  submitButtonContainer: {
    display: 'flex',
    justifyContent: 'left',
  },
}));
