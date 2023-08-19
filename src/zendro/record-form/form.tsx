import React, {
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { useTranslation } from 'react-i18next';

import { Container, ContainerProps, Tooltip } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import {
  Cached as Reload,
  Create as EditIcon,
  Delete as DeleteIcon,
  Lock as LockIcon,
  Visibility as ReadIcon,
  VpnKey as KeyIcon,
  Save as SaveIcon,
  ViewList as TableIcon,
} from '@mui/icons-material';

import ActionButton from '@/components/float-button';

import {
  AttributeValue,
  DataRecord,
  ParsedAttribute,
  AttributeWithDescription,
} from '@/types/models';
import { isNullorEmpty } from '@/utils/validation';

import FormErrors from './form-errors';
import FormHeader from './form-header';
import FormField from './form-field';
import {
  computeStats,
  formAttributesReducer,
  FormStats,
  initForm,
} from './form-utils';

type FormAction = 'cancel' | 'delete' | 'read' | 'reload' | 'update' | 'submit';
export type ActionHandler = (
  data: FormAttribute[],
  stats: FormStats,
  callback?: () => void
) => void;

export interface FormAttribute extends ParsedAttribute {
  serverErrors?: string[];
  clientError?: string;
  readOnly?: boolean;
  value: AttributeValue;
}

export type FormView = 'create' | 'read' | 'update';

export interface AttributesFormProps extends ContainerProps {
  actions?: Partial<Record<FormAction, ActionHandler>>;
  // actions2?: { [key in FormAction]?: ActionHandler };
  attributes: ParsedAttribute[];
  data?: DataRecord;
  disabled?: boolean;
  errors?: Record<string, string[]>;
  formId: string;
  formView: FormView;
  info?: ReactNode;
  modelName: string;
}

export default function AttributesForm({
  actions,
  attributes,
  disabled,
  data,
  errors,
  formId,
  formView,
  modelName,
  ...props
}: PropsWithChildren<AttributesFormProps>): ReactElement {
  const classes = useStyles();
  const { t } = useTranslation();

  /* STATE */

  const [formAttributes, dispatch] = useReducer(
    formAttributesReducer,
    { formView, attributes },
    initForm
  );

  const formStats = useMemo(
    () => computeStats(formAttributes),
    [formAttributes]
  );

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

  const handleOnAction =
    ({ handler }: { action: FormAction; handler: ActionHandler }) =>
    (event: React.FormEvent<HTMLButtonElement>) => {
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
    <Container maxWidth="lg" {...props}>
      <div className={classes.actionsContainer}>
        {actions?.cancel && (
          <ActionButton
            className="support"
            form={formId}
            onClick={handleOnAction({
              action: 'cancel',
              handler: actions.cancel,
            })}
            icon={TableIcon}
            tooltip={t('record-form.action-exit', { modelName: modelName })}
            data-cy="record-form-exit"
          />
        )}

        {actions?.read && (
          <ActionButton
            className="support"
            form={formId}
            icon={ReadIcon}
            onClick={handleOnAction({
              action: 'read',
              handler: actions.read,
            })}
            tooltip={t('record-form.action-read')}
            data-cy="record-form-read"
          />
        )}

        {actions?.update && (
          <ActionButton
            className="support"
            form={formId}
            icon={EditIcon}
            onClick={handleOnAction({
              action: 'update',
              handler: actions.update,
            })}
            tooltip={t('record-form.action-update')}
            data-cy="record-form-update"
          />
        )}

        {actions?.delete && (
          <ActionButton
            className="secondary"
            form={formId}
            icon={DeleteIcon}
            onClick={handleOnAction({
              action: 'delete',
              handler: actions.delete,
            })}
            tooltip={t('record-form.action-delete')}
            data-cy="record-form-delete"
          />
        )}

        {actions?.reload && (
          <ActionButton
            className="support"
            form={formId}
            icon={Reload}
            tooltip={t('record-form.action-reload')}
            onClick={handleOnAction({
              action: 'reload',
              handler: actions.reload,
            })}
            data-cy="record-form-reload"
          />
        )}

        {actions?.submit && (
          <ActionButton
            className="primary"
            form={formId}
            icon={SaveIcon}
            tooltip={t('record-form.action-submit')}
            type="submit"
            onClick={handleOnAction({
              action: 'submit',
              handler: actions.submit,
            })}
            data-cy="record-form-submit"
          />
        )}
      </div>

      <form id={formId} className={classes.form}>
        <FormHeader
          locked={disabled}
          prefix={t(
            `record-form.${formView}` as unknown as TemplateStringsArray
          )}
          title={modelName}
          subtitle={`${t('record-form.completed')} ${
            formAttributes.length - formStats.unset
          } / ${formAttributes.length}`}
        >
          {props.info}
        </FormHeader>

        <section
          aria-label={`${formId}-input-fields`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
          }}
        >
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
                type={(type as AttributeWithDescription).type ?? type}
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
                    <Tooltip
                      title={t('record-fields.primary-key', { name }) ?? ''}
                    >
                      <KeyIcon fontSize="small" color="action" />
                    </Tooltip>
                  )
                }
                readOnly={readOnly}
                actionRight={
                  readOnly ? (
                    <Tooltip title={t('record-fields.read-only') ?? ''}>
                      <LockIcon fontSize="small" color="secondary" />
                    </Tooltip>
                  ) : null
                }
                onChange={!disabled ? handleOnChange(name) : undefined}
                onError={!disabled ? handleOnError(name) : undefined}
                value={value}
                data-cy={`record-form-fields-${name}`}
              />
            );
          })}
        </section>
      </form>
    </Container>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',

      [theme.breakpoints.up('lg')]: {
        flexDirection: 'row',
        alignItems: 'start',
      },

      marginTop: theme.spacing(6),
    },
    actionsContainer: {
      // Layout
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',

      [theme.breakpoints.up('sm')]: {
        justifyContent: 'center',
        '& > button:not(:last-child), a:not(:last-child)': {
          marginRight: theme.spacing(6),
        },
      },

      [theme.breakpoints.only('md')]: {
        justifyContent: 'flex-start',
        marginLeft: theme.spacing(9.5),
      },

      [theme.breakpoints.up('lg')]: {
        justifyContent: 'flex-end',
        marginRight: theme.spacing(9.5),
      },

      // Spacing
      marginBottom: theme.spacing(4),

      // Buttons
      '& > button, a': {
        flexShrink: 0,
        width: theme.spacing(10),
        height: theme.spacing(10),
      },

      '& .primary': {
        color: theme.palette.primary.background,
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
          backgroundColor: theme.palette.primary.dark,
        },
      },

      '& .secondary': {
        color: theme.palette.secondary.main,
      },

      '& .support': {
        color: theme.palette.primary.main,
      },
    },
  })
);
