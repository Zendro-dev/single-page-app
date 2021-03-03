import React, { PropsWithChildren, ReactElement } from 'react';

import { VpnKey as KeyIcon } from '@material-ui/icons';

import {
  Box,
  createStyles,
  makeStyles,
  Theme,
  Tooltip,
  Typography,
  SvgIconProps,
} from '@material-ui/core';

import { AttributeValue, ParsedAttribute } from '@/types/models';
import { isNullorEmpty } from '@/utils/validation';
import AttributeField from '../input/attribute-field';

export interface AttributesFormProps {
  attributes: FormAttribute[];
  className?: string;
  title: string;
  recordId?: string;
  onChange: (key: string) => (value: AttributeValue) => void;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

export interface FormAttribute extends Pick<ParsedAttribute, 'name' | 'type'> {
  error?: string | null;
  readOnly?: boolean;
  value: AttributeValue;
}

export default function AttributesForm({
  attributes,
  className,
  title,
  onChange,
  onSubmit,
  recordId,
  ...props
}: PropsWithChildren<AttributesFormProps>): ReactElement {
  const classes = useStyles();

  const nonNullValues = attributes.reduce((acc, { value }) => {
    return isNullorEmpty(value) ? acc : (acc += 1);
  }, 0);

  return (
    <Box position="relative" width="100%">
      <Box
        position="absolute"
        display="flex"
        justifyContent="flex-end"
        top={-28}
        right={0}
        marginX={10}
        width="100%"
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
            {title}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Completed: {nonNullValues} / {attributes.length}
          </Typography>
        </Box>

        {attributes.map((attribute) => {
          const { name, type, value, error, readOnly } = attribute;

          return (
            <AttributeField
              key={name}
              type={type}
              error={error ? true : false}
              helperText={error}
              InputProps={{
                readOnly,
              }}
              label={name}
              leftIcon={
                readOnly
                  ? (props: SvgIconProps): ReactElement => (
                      <Tooltip title="This field cannot be modified">
                        <KeyIcon {...props} fontSize="small" color="disabled" />
                      </Tooltip>
                    )
                  : undefined
              }
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
