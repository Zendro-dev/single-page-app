import { useMemo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import StringField from '../input/StringField';
import BoolField from '../input/BoolField';
import DateTimeField from '../input/DateTimeField';
import IntegerField from '../input/IntField';
import FloatField from '../input/FloatField';
import {
  IconButton,
  InputAdornment,
  Tooltip,
  Button,
  Typography,
} from '@material-ui/core';
import {
  Clear as ClearIcon,
  Save as SaveIcon,
  VpnKey as Key,
} from '@material-ui/icons';

const useStyles = makeStyles(() => ({
  header: {
    marginTop: '1rem',
    marginLeft: '2rem',
  },
  field: {
    marginLeft: '5rem',
    marginRight: '5rem',
    minWidth: '10rem',
    maxWidth: '40rem',
  },
  saveButton: {
    marginLeft: '22rem',
  },
}));

const field = {
  String: StringField,
  Boolean: BoolField,
  DateTime: DateTimeField,
  Integer: IntegerField,
  Float: FloatField,
};

const clearButton = (attrName, handleClearButton) => {
  return (
    <InputAdornment position="end">
      <Tooltip title="Reset">
        <IconButton
          onClick={handleClearButton(attrName)}
          onMouseDown={(event) => event.preventDefault()}
        >
          <ClearIcon />
        </IconButton>
      </Tooltip>
    </InputAdornment>
  );
};

export default function AttributeForm({ attributes, onSubmit, ...props }) {
  const classes = useStyles();
  const { t } = useTranslation();
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
    return number + ' / ' + Object.keys(records).length;
  }, [records]);

  const handleSetValue = (attrName) => (value) => {
    setRecords({ ...records, [attrName]: value });
  };

  const handleClearButton = (attrName) => () => {
    if (!attributes[attrName].readOnly) {
      setRecords({ ...records, [attrName]: null });
    }
  };

  const keyIcon = () => {
    return (
      <Tooltip title={t('modelPanels.internalId', 'Unique Identifier')}>
        <Key
          fontSize="small"
          color="disabled"
          style={{
            marginRight: '5rem',
            marginLeft: '0rem',
          }}
        />
      </Tooltip>
    );
  };

  return (
    <form id="AttributesForm-div-root">
      <legend className={classes.header}>
        <Typography variant="h6" component="h1">
          {' '}
          {t('modelPanels.model') + ': ' + props.modelName}
        </Typography>
        <Typography variant="subtitle1">
          {completedAttr + ' ' + t('modelPanels.completed')}
        </Typography>
      </legend>
      <Button
        variant="contained"
        color="primary"
        size="large"
        className={classes.saveButton}
        startIcon={<SaveIcon />}
        onClick={onSubmit(records)}
      >
        Save
      </Button>
      {Object.keys(attributes).map((attrName) => {
        const attrType = attributes[attrName].type;
        const InputField = field[attrType];
        return (
          <InputField
            className={classes.field}
            key={attrName + '-' + attrType + 'Field'}
            label={attrName}
            value={records[attrName]}
            onChange={handleSetValue(attrName)}
            error={attributes[attrName].errMsg ? true : false}
            helperText={attributes[attrName].errMsg}
            InputProps={{
              readOnly: attributes[attrName].readOnly ? true : false,
              endAdornment: clearButton(attrName, handleClearButton),
            }}
            rightIcon={attributes[attrName].readOnly ? keyIcon : undefined}
          />
        );
      })}
    </form>
  );
}
