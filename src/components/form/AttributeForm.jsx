import { ReactElement, useState } from 'react';
import StringField from '../input/StringField';
import { IconButton, InputAdornment, Tooltip } from '@material-ui/core';
import { Clear as ClearIcon } from '@material-ui/icons';
// pass to attributeForm
const dataModel = {
  attr1: { type: 'String', foreignKey: false },
  attr2: { type: 'String', foreignKey: false },
};
// actual data in database, pass to attributeForm
let record = {
  attr1: null,
  attr2: 'test',
};
// receive from server, pass to attributeForm
const errMsg = {
  attr1: null,
  attr2: 'error message',
};
// pass to attributeForm
const readOnly = false;
const field = (type) => {
  return {
    String: StringField,
  }[type];
};

export default function AttributeForm() {
  const [attributes, setAttributes] = useState(record);
  const handleSetValue = (attrName, value) => {
    setAttributes({ ...attributes, [attrName]: value });
    console.log('set value:');
    console.log(attributes);
  };
  const handleClearButton = (attrName) => {
    if (!readOnly) {
      console.log(`clear ${attrName}`);
      setAttributes({ ...attributes, [attrName]: null });
      console.log(attributes);
    }
  };
  return (
    <div>
      {Object.keys(dataModel).flatMap((attrName) => {
        const attrType = dataModel[attrName].type;
        console.log('initialize:');
        console.log(attributes);
        const InputField = field(attrType);
        let multiline = false;
        if (attrType === 'String') {
          multiline = true;
        }
        return dataModel[attrName].foreignKey
          ? []
          : [
              <InputField
                key={attrName + '-' + attrType + 'Field'}
                label={attrName}
                value={attributes[attrName]}
                multiline={multiline}
                onChange={handleSetValue}
                InputProps={{
                  readOnly: readOnly ? true : false,
                  endAdornment: (
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
                  ),
                }}
                error={errMsg[attrName] ? true : undefined}
                helperText={errMsg[attrName]}
              />,
            ];
      })}
    </div>
  );
}
