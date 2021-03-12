import React, { PropsWithChildren, ReactElement, ReactNode } from 'react';

import { Lock as LockIcon, VpnKey as KeyIcon } from '@material-ui/icons';

import {
  Box,
  Tooltip,
  Typography,
  SvgIconProps,
  makeStyles,
  createStyles,
} from '@material-ui/core';

import { AttributeValue, ParsedAttribute } from '@/types/models';
import { isNullorEmpty } from '@/utils/validation';
import AttributeField from '../input/attribute-field';
import AttributeErrors from '../alert/attributes-error';
import {ErrorsAttribute} from '../alert/attributes-error';

export interface AttributesFormProps {
  actions: ReactNode;
  attributes: FormAttribute[];
  className?: string;
  disabled?: boolean;
  title: {
    prefix?: string;
    main: string;
  };
  formId?: string;
  onChange: (key: string) => (value: AttributeValue) => void;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

export interface FormAttribute extends ParsedAttribute {
  error?: ErrorsAttribute | null;
  readOnly?: boolean;
  value: AttributeValue;
}

export default function AttributesForm({
  attributes,
  className,
  disabled,
  title,
  onChange,
  onSubmit,
  formId,
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
          <Box display="flex" alignItems="center">
            {disabled && (
              <Tooltip title="The form is in read-only mode">
                <LockIcon
                  color="secondary"
                  className={classes.lockedFormIcon}
                />
              </Tooltip>
            )}

            <Typography variant="h6" component="h1">
              {title.prefix && (
                <span className={classes.titlePrefix}>{title.prefix}</span>
              )}
              {title.main}
            </Typography>
          </Box>

          <Typography variant="subtitle1" color="textSecondary">
            Completed: {nonNullValues} / {attributes.length}
          </Typography>
        </Box>

        {attributes.map((attribute) => {
          const { name, type, value, error, readOnly, primaryKey } = attribute;

          return (
            <AttributeField
              key={name}
              type={type}
              error={error ? true : false}
              helperText={error? <AttributeErrors errors={error}/> : undefined}
              InputProps={{
                readOnly,
              }}
              label={name}
              leftIcon={
                primaryKey
                  ? (props: SvgIconProps): ReactElement => (
                      <Tooltip title={`${name} is the primary key`}>
                        <KeyIcon {...props} fontSize="small" color="action" />
                      </Tooltip>
                    )
                  : undefined
              }
              rightIcon={
                readOnly
                  ? (props: SvgIconProps): ReactElement => (
                      <Tooltip title="This field cannot be modified">
                        <LockIcon
                          {...props}
                          fontSize="small"
                          color="secondary"
                        />
                      </Tooltip>
                    )
                  : undefined
              }
              onChange={disabled ? undefined : onChange(name)}
              value={value}
            />
          );
        })}
      </form>
    </Box>
  );
}

const useStyles = makeStyles((theme) =>
  createStyles({
    titlePrefix: {
      ...theme.typography.h6,
      color: 'GrayText',
      fontWeight: 'bold',
      marginRight: theme.spacing(2),
    },
    lockedFormIcon: {
      marginRight: theme.spacing(2),
    },
  })
);
