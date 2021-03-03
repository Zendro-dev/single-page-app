import React, { PropsWithChildren, ReactElement, ReactNode } from 'react';

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
  actions: ReactNode;
  attributes: FormAttribute[];
  className?: string;
  title: string;
  formId?: string;
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
  formId,
  ...props
}: PropsWithChildren<AttributesFormProps>): ReactElement {
  const nonNullValues = attributes.reduce((acc, { value }) => {
    return isNullorEmpty(value) ? acc : (acc += 1);
  }, 0);

  return (
    <Box position="relative" width="100%">
      <Box
        position="absolute"
        display="flex"
        justifyContent="space-between"
        top={-28}
        right={0}
        paddingX={10}
        width="100%"
      >
        {props.actions}
      </Box>

      <form id={formId} className={className} onSubmit={onSubmit}>
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
