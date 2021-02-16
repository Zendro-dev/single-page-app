import { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import StringField from '../input/StringField';
import BoolField from '../input/BoolField';
import DateTimeField from '../input/DateTimeField';
import IntegerField from '../input/IntField';
import FloatField from '../input/FloatField';
import { IconButton, InputAdornment, Tooltip } from '@material-ui/core';
import { Clear as ClearIcon } from '@material-ui/icons';
import Key from '@material-ui/icons/VpnKey';
import Typography from '@material-ui/core/Typography';
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

export default function AttributeForm({ attributes, onChange, ...props }) {
  const classes = useStyles();
  const { t } = useTranslation();

  const completedAttr = useMemo(() => {
    let number = 0;
    for (let attrName of Object.keys(attributes)) {
      if (
        attributes[attrName].value !== null &&
        attributes[attrName].value !== undefined
      ) {
        number += 1;
      }
    }
    return number + ' / ' + Object.keys(attributes).length;
  }, [attributes]);

  const handleSetValue = (attrName) => (value) => {
    onChange(attrName, value);
  };

  const handleClearButton = (attrName) => () => {
    if (!attributes[attrName].readOnly) {
      onChange(attrName, null);
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
      {Object.keys(attributes).map((attrName) => {
        const attrType = attributes[attrName].type;
        const InputField = field[attrType];
        return (
          <InputField
            className={classes.field}
            key={attrName + '-' + attrType + 'Field'}
            label={attrName}
            value={attributes[attrName].value}
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
