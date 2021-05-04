import React, {
  PropsWithChildren,
  ReactElement,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import clsx from 'clsx';

import { Box, Tooltip } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  Cached as Reload,
  Clear as CancelIcon,
  Create as EditIcon,
  Delete as DeleteIcon,
  Lock as LockIcon,
  Visibility as ReadIcon,
  VpnKey as KeyIcon,
  Save as SaveIcon,
} from '@material-ui/icons';

import ActionButton from '@/components/buttons/fab';

import { AttributeValue, DataRecord, ParsedAttribute } from '@/types/models';
import { isNullorEmpty } from '@/utils/validation';

import FormErrors from './form-errors';
import FormHeader from './form-header';
import FormField from './form-field';
import { formAttributesReducer, computeStats, initForm } from './form-utils';

type FormAction = 'cancel' | 'delete' | 'read' | 'reload' | 'update' | 'submit';
export type ActionHandler = (
  data: FormAttribute[],
  stats: FormStats,
  callback?: () => void
) => void;

export interface AttributesFormProps {
  actions?: Partial<Record<FormAction, ActionHandler>>;
  // actions2?: { [key in FormAction]?: ActionHandler };
  attributes: ParsedAttribute[];
  className?: string;
  data?: DataRecord;
  disabled?: boolean;
  errors?: Record<string, string[]>;
  formId: string;
  formView: FormView;
  modelName: string;
}

export interface FormAttribute extends ParsedAttribute {
  serverErrors?: string[];
  clientError?: string;
  readOnly?: boolean;
  value: AttributeValue;
}

export type FormView = 'create' | 'read' | 'update';

interface FormStats {
  clientErrors: number;
  unset: number;
}

export default function AttributesForm({
  actions,
  attributes,
  className,
  disabled,
  data,
  errors,
  formId,
  formView,
  modelName,
}: PropsWithChildren<AttributesFormProps>): ReactElement {
  const classes = useStyles();

  /* STATE */

  const [formAttributes, dispatch] = useReducer(
    formAttributesReducer,
    { formView, attributes },
    initForm
  );

  const formStats = useMemo(() => computeStats(formAttributes), [
    formAttributes,
  ]);

  /* EFFECTS */

  useEffect(
    function updateFormValues() {
      if (data) {
        dispatch({
          action: 'UPDATE_VALUES',
          payload: { data },
        });
      }
    },
    [data, dispatch]
  );

  useEffect(
    function updateFormServerErrors() {
      dispatch({
        action: 'UDPATE_SERVER_ERRORS',
        payload: {
          errors,
        },
      });
    },
    [errors]
  );

  /* HANDLERS */

  const handleOnAction = ({
    handler,
  }: {
    action: FormAction;
    handler: ActionHandler;
  }) => (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    formAttributes.reduce(
      (acc, { value, clientError }) => {
        if (isNullorEmpty(value)) acc.unset += 1;
        if (clientError) acc.clientErrors += 1;
        return acc;
      },
      { clientErrors: 0, unset: 0 } as FormStats
    );

    // let callback: (() => void) | undefined;
    handler(formAttributes, formStats);
  };

  /**
   * Update an attribute value in the internal state.
   * @param attrName name of the attribute that changed in the form
   */
  const handleOnChange = (attrName: string) => (value: AttributeValue) => {
    dispatch({
      action: 'UPDATE_ONE',
      payload: { attrName, attrField: { value } },
    });
  };

  /**
   * Update an attribute error in the internal state.
   * @param attrName name of the attribute that changed in the form
   */
  const handleOnError = (attrName: string) => (error?: string) => {
    dispatch({
      action: 'UPDATE_ONE',
      payload: { attrName, attrField: { clientError: error } },
    });
  };

  return (
    <Box position="relative" className={className}>
      <Box
        position="absolute"
        display="flex"
        justifyContent="space-between"
        top={-28}
        right={0}
        paddingX={10}
        width="100%"
      >
        <div className={clsx(classes.actions, classes.leftActions)}>
          {actions?.cancel && (
            <ActionButton
              className={classes.actionSecondary}
              form={formId}
              onClick={handleOnAction({
                action: 'cancel',
                handler: actions.cancel,
              })}
              icon={CancelIcon}
              tooltip="Exit form"
            />
          )}

          {actions?.read && (
            <ActionButton
              className={classes.actionSupport}
              form={formId}
              icon={ReadIcon}
              onClick={handleOnAction({
                action: 'read',
                handler: actions.read,
              })}
              tooltip="View record details"
            />
          )}

          {actions?.update && (
            <ActionButton
              className={classes.actionSupport}
              form={formId}
              icon={EditIcon}
              onClick={handleOnAction({
                action: 'update',
                handler: actions.update,
              })}
              tooltip="Edit Record"
            />
          )}
        </div>

        <div className={clsx(classes.actions, classes.rightActions)}>
          {actions?.delete && (
            <ActionButton
              className={classes.actionSecondary}
              form={formId}
              icon={DeleteIcon}
              onClick={handleOnAction({
                action: 'delete',
                handler: actions.delete,
              })}
              tooltip="Delete record"
            />
          )}

          {actions?.reload && (
            <ActionButton
              className={classes.actionSupport}
              form={formId}
              icon={Reload}
              tooltip="Reload data"
              onClick={handleOnAction({
                action: 'reload',
                handler: actions.reload,
              })}
            />
          )}

          {actions?.submit && (
            <ActionButton
              className={classes.actionPrimary}
              form={formId}
              icon={SaveIcon}
              tooltip="Submit changes"
              type="submit"
              onClick={handleOnAction({
                action: 'submit',
                handler: actions.submit,
              })}
            />
          )}
        </div>
      </Box>

      <form id={formId} className={classes.form}>
        <FormHeader
          locked={disabled}
          prefix={formView}
          title={modelName}
          subtitle={`Completed ${formAttributes.length - formStats.unset} / ${
            formAttributes.length
          }`}
        />

        {formAttributes.map((attribute) => {
          const {
            name,
            type,
            value,
            clientError,
            serverErrors,
            readOnly,
            primaryKey,
          } = attribute;

          return (
            <FormField
              key={name}
              type={type}
              error={clientError || serverErrors ? true : false}
              helperText={
                clientError || serverErrors
                  ? {
                      component: 'ul',
                      node: (
                        <FormErrors
                          ajvValidation={serverErrors}
                          clientValidation={clientError}
                        />
                      ),
                    }
                  : undefined
              }
              label={name}
              actionLeft={
                primaryKey && (
                  <Tooltip title={`${name} is the primary key`}>
                    <KeyIcon fontSize="small" color="action" />
                  </Tooltip>
                )
              }
              readOnly={readOnly}
              actionRight={
                readOnly && (
                  <Tooltip title="This field cannot be modified">
                    <LockIcon fontSize="small" color="secondary" />
                  </Tooltip>
                )
              }
              onChange={!disabled ? handleOnChange(name) : undefined}
              onError={!disabled ? handleOnError(name) : undefined}
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
    form: {
      marginTop: theme.spacing(6),
    },
    actions: {
      '& > button, a': {
        width: theme.spacing(12),
        height: theme.spacing(12),
      },
      '& > button:not(:first-child), a:not(:first-child)': {
        marginLeft: theme.spacing(6),
      },
    },
    leftActions: {
      '& > button:first-child, a:first-child': {
        width: theme.spacing(14),
        height: theme.spacing(14),
      },
    },
    rightActions: {
      '& > button:last-child, a:last-child': {
        width: theme.spacing(14),
        height: theme.spacing(14),
      },
    },
    actionPrimary: {
      color: theme.palette.grey[100],
      backgroundColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
    actionSecondary: {
      color: theme.palette.secondary.main,
    },
    actionSupport: {
      color: theme.palette.primary.main,
    },
  })
);
