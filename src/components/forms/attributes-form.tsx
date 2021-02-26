import React, { ReactElement, useMemo, useState } from 'react';

import {
  Clear as ClearIcon,
  Save as SaveIcon,
  VpnKey as KeyIcon,
} from '@material-ui/icons';

import {
  Box,
  createStyles,
  Fab,
  IconButton,
  InputAdornment,
  makeStyles,
  Theme,
  Tooltip,
  Typography,
  SvgIconProps,
} from '@material-ui/core';

import {
  BoolField,
  DateTimeField,
  FloatField,
  IntField,
  StringField,
  WithContainerProps,
} from '../input';

import { AttributeValue } from '@/types/models';
import { BaseInputFieldProps } from '@/types/elements';

import { Attribute } from '@/utils/models';
import { readOne } from '@/utils/requests';
import { queryRecordAttributes } from '@/utils/queries';
import useAuth from '@/hooks/useAuth';
import useSWR from 'swr';

interface AttributesFormProps {
  className?: string;
  attributes: Attribute[];
  model: string;
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
  model,
  attributes,
  className,
  operation,
}: AttributesFormProps): ReactElement {
  const classes = useStyles();
  const { auth } = useAuth();

  const [values, setValues] = useState<Map<string, AttributeValue>>(
    attributes.reduce(
      (acc, { name }) => acc.set(name, null),
      new Map<string, AttributeValue>()
    )
  );

  // const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const request = useMemo(
    () => queryRecordAttributes(model, attributes, { id: operation.id ?? '' }),
    [attributes, model, operation.id]
  );

  useSWR<Record<string, AttributeValue> | null>(
    operation.id && auth?.user?.token ? [auth.user.token, request] : null,
    readOne,
    {
      revalidateOnFocus: false,
      onSuccess: (data) => data && setValues(new Map(Object.entries(data))),
    }
  );

  /**
   * Computes the number of values that are currently set.
   */
  const nonNullValues = useMemo<number>(() => {
    return Array.from(values.entries()).reduce(
      (acc, [_, val]) => (val === null ? acc : acc + 1),
      0
    );
  }, [values]);

  /**
   * Updates the attribute value in the internal state.
   * @param key name of the attribute to change in the form state
   */
  const handleOnChange = (key: string) => (value: AttributeValue) => {
    setValues(new Map<string, AttributeValue>(values.set(key, value)));
  };

  /**
   * Sets the the attribute value to null.
   * @param key name of the attribute to clear
   */
  const handleOnClear = (key: string) => () => {
    setValues(new Map<string, AttributeValue>(values.set(key, null)));
  };

  /**
   * Submits the form values to the Zendro GraphQL endpoint.
   */
  const handleOnSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    console.log(values);
  };

  return (
    <form className={className} onSubmit={handleOnSubmit}>
      <Box display="flex" justifyContent="space-between" marginX={9.5} mb={6}>
        <legend className={classes.legend}>
          <Typography variant="h6" component="h1">
            {model}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Completed: {nonNullValues} / {attributes.length}
          </Typography>
        </legend>
        <Tooltip title="Submit changes">
          <Fab color="secondary" type="submit">
            <SaveIcon />
          </Fab>
        </Tooltip>
      </Box>

      {attributes.map((attribute, index) => {
        const { name, type } = attribute;
        const readOnly = index === 0 && operation.mode !== 'create';

        // Set common props to all input fields
        const props: WithContainerProps<
          BaseInputFieldProps<{
            key: string;
            onChange: (value: AttributeValue) => void;
          }>
        > = {
          InputProps: {
            endAdornment: !readOnly && (
              <ClearButton onClick={handleOnClear(name)} />
            ),
            readOnly,
          },
          key: name,
          label: name,
          leftIcon: readOnly ? ReadOnlyIcon : undefined,
          onChange: handleOnChange(name),
        };

        const value = values.get(name);

        // Cast the value and return the appropriate input field
        switch (type) {
          case 'Boolean':
            return <BoolField {...props} value={value as boolean | null} />;
          case 'DateTime':
            return <DateTimeField {...props} value={value as Date | null} />;
          case 'Float':
            return <FloatField {...props} value={value as number | null} />;
          case 'Int':
            return <IntField {...props} value={value as number | null} />;
          case 'String':
            return <StringField {...props} value={value as string | null} />;
          default:
            return <StringField {...props} value={value as string | null} />;
        }
      })}
    </form>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    legend: {
      marginBottom: theme.spacing(6),
    },
  })
);
