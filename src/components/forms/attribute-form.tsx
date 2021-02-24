import {
  ReactElement,
  useMemo,
  useState,
  DetailedHTMLProps,
  FormHTMLAttributes,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Button,
  IconButton,
  IconButtonProps,
  InputAdornment,
  SvgIconProps,
  Tooltip,
  Typography,
} from '@material-ui/core';
import {
  Clear as ClearIcon,
  Save as SaveIcon,
  VpnKey as Key,
} from '@material-ui/icons';

import {
  AttributeScalarType,
  AttributeArrayType,
  AttributeValue,
} from '@/types/models';

import BoolField from '../input/bool-field';
import DateTimeField from '../input/datetime-field';
import IntField from '../input/int-field';
import FloatField from '../input/float-field';
import StringField from '../input/string-field';

interface InputField {
  [key: string]:
    | typeof StringField
    | typeof BoolField
    | typeof DateTimeField
    | typeof IntField
    | typeof FloatField;
}

const field: InputField = {
  String: StringField,
  Boolean: BoolField,
  DateTime: DateTimeField,
  Int: IntField,
  Float: FloatField,
};

interface ClearButtonProps {
  onClick: () => void;
}

const ClearButton = ({
  onClick,
  ...buttonProps
}: ClearButtonProps & IconButtonProps): ReactElement => {
  const handleOnClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
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

const KeyIcon = (props: SvgIconProps): ReactElement => {
  return (
    <Tooltip title="This field cannot be edited">
      <Key {...props} fontSize="small" color="disabled" />
    </Tooltip>
  );
};

interface AttributeFormProps {
  attributes: FormAttributes;
  className: string;
  modelName: string;
  onSubmit: (records: FormRecords) => void;
}

export interface FormAttributes {
  [key: string]: {
    type: AttributeScalarType | AttributeArrayType;
    readOnly: boolean;
    errMsg: string | null;
    value: AttributeValue;
  };
}

interface FormRecords {
  [key: string]: AttributeValue;
}

export default function AttributeForm({
  attributes,
  onSubmit,
  modelName,
  ...formProps
}: AttributeFormProps &
  DetailedHTMLProps<
    FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  >): ReactElement {
  const classes = useStyles();
  const record: FormRecords = {};

  for (const attrName of Object.keys(attributes)) {
    record[attrName] = attributes[attrName].value;
  }

  const [records, setRecords] = useState(record);

  const completedAttr = useMemo(() => {
    let number = 0;
    for (const attrName of Object.keys(records)) {
      if (records[attrName] !== null && records[attrName] !== undefined) {
        number += 1;
      }
    }
    return number + ' / ' + Object.keys(records).length + ' completed';
  }, [records]);

  const handleSetValue = (attrName: string) => (value: AttributeValue) => {
    setRecords({ ...records, [attrName]: value });
  };

  const handleClearButton = (attrName: string) => () => {
    if (!attributes[attrName].readOnly) {
      setRecords({ ...records, [attrName]: null });
    }
  };

  const handleOnSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
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
        const _type = type as AttributeScalarType;
        const InputField = field[_type];
        return (
          <InputField
            key={attrName + '-' + type + 'Field'}
            label={attrName}
            value={records[attrName] as any}
            onChange={handleSetValue(attrName) as any}
            error={errMsg ? true : false}
            helperText={errMsg ?? ''}
            InputProps={{
              readOnly: readOnly ? true : false,
              endAdornment: readOnly ? undefined : (
                <ClearButton onClick={handleClearButton(attrName)} />
              ),
            }}
            leftIcon={readOnly ? KeyIcon : undefined}
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
