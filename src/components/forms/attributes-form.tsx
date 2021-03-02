import React, { PropsWithChildren, ReactElement, useState } from 'react';

import { Clear as ClearIcon, VpnKey as KeyIcon } from '@material-ui/icons';

import {
  Box,
  createStyles,
  IconButton,
  InputAdornment,
  makeStyles,
  Theme,
  Tooltip,
  Typography,
  SvgIconProps,
} from '@material-ui/core';

import { AttributeValue, ParsedAttribute } from '@/types/models';
import { isNullorEmpty } from '@/utils/validation';
import AttributeField from '../input/attribute-field';

interface AttributesFormProps {
  attributes: ParsedAttribute[];
  className?: string;
  data: Record<string, AttributeValue> | null | undefined;
  model: string;
  recordId?: string;
  onChange: (key: string) => (value: AttributeValue) => void;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  operation: {
    mode: 'create' | 'read' | 'update';
    id?: string;
  };
}

const ClearButton = (props: { onClick: () => void }): ReactElement => (
  <InputAdornment position="end">
    <Tooltip title="Unset value">
      <span>
        <IconButton {...props}>
          <ClearIcon />
        </IconButton>
      </span>
    </Tooltip>
  </InputAdornment>
);

const ReadOnlyIcon = (props: SvgIconProps): ReactElement => (
  <Tooltip title="This field cannot be modified">
    <KeyIcon {...props} fontSize="small" color="disabled" />
  </Tooltip>
);

export default function AttributesForm({
  attributes,
  className,
  data,
  model,
  onChange,
  onSubmit,
  operation,
  recordId,
  ...props
}: PropsWithChildren<AttributesFormProps>): ReactElement {
  const classes = useStyles();

  const [errors] = useState<Map<string, string | undefined>>(
    attributes.reduce(
      (acc, { name }) => acc.set(name, undefined),
      new Map<string, string | undefined>()
    )
  );

  const nonNullValues = Object.entries(data ?? {}).reduce((acc, [_, val]) => {
    return isNullorEmpty(val) ? acc : (acc += 1);
  }, 0);

  return (
    <Box position="relative">
      <Box
        position="absolute"
        top={-28}
        right={0}
        marginX={10}
        className={classes.actions}
      >
        {props.children}
      </Box>

      <form
        id={`AttributesForm-${recordId ?? 'create'}`}
        className={className}
        onSubmit={onSubmit}
      >
        <Box
          component="legend"
          display="flex"
          justifyContent="space-between"
          marginX={9.5}
          mb={6}
        >
          <Typography variant="h6" component="h1">
            {model}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Completed: {nonNullValues} / {attributes.length}
          </Typography>
        </Box>

        {data &&
          attributes.map((attribute) => {
            const { name, type, primaryKey } = attribute;
            const readOnly =
              operation.mode === 'read' ||
              (primaryKey && operation.mode !== 'create');

            // const value = values.get(name);
            const value = data[name];

            return (
              <AttributeField
                key={name}
                type={type}
                error={errors.get(name) ? true : false}
                helperText={errors.get(name)}
                InputProps={{
                  readOnly,
                }}
                label={name}
                leftIcon={readOnly ? ReadOnlyIcon : undefined}
                onChange={onChange(name)}
                value={value}
              />
            );
          })}
      </form>
    </Box>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    actions: {
      '& > button:not(:first-child), a:not(:first-child)': {
        marginLeft: theme.spacing(6),
      },
    },
  })
);
