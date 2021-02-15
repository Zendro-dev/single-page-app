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

export default function AttributeForm({ records, setRecords, ...props }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const completedAttr = () => {
    let number = 0;
    for (let attrName of Object.keys(records)) {
      if (records[attrName] !== null && records[attrName] !== undefined) {
        number += 1;
      }
    }
    return number;
  };

  const handleSetValue = (attrName) => (value) => {
    setRecords({ ...records, [attrName]: value });
  };
  const handleClearButton = (attrName) => {
    if (!props.readOnly[attrName]) {
      setRecords({ ...records, [attrName]: null });
    }
  };

  const clearButton = (attrName) => {
    return (
      <InputAdornment position="end">
        <Tooltip title="Reset">
          <IconButton
            onClick={() => {
              handleClearButton(attrName);
            }}
            onMouseDown={(event) => event.preventDefault()}
          >
            <ClearIcon />
          </IconButton>
        </Tooltip>
      </InputAdornment>
    );
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
          {completedAttr() +
            ' / ' +
            Object.keys(records).length +
            ' ' +
            t('modelPanels.completed')}
        </Typography>
      </legend>
      ,
      {Object.keys(props.dataModel).map((attrName) => {
        const attrType = props.dataModel[attrName];
        const InputField = field[attrType];
        return (
          <InputField
            className={classes.field}
            key={attrName + '-' + attrType + 'Field'}
            label={attrName}
            value={records[attrName]}
            onChange={handleSetValue(attrName)}
            error={props.errMsg[attrName] ? true : false}
            helperText={props.errMsg[attrName]}
            InputProps={{
              readOnly: props.readOnly[attrName] ? true : false,
              endAdornment: clearButton(attrName),
            }}
            rightIcon={props.readOnly[attrName] ? keyIcon : undefined}
          />
        );
      })}
    </form>
  );
}
