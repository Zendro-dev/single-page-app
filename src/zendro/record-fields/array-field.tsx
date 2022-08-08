import clsx from 'clsx';
import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Overwrite } from 'utility-types';

import { Button, FormHelperText, InputAdornment } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import {
  Add as AddIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

import IconButton from '@/components/icon-button';
import InputActions from '@/components/input-actions';
import { TextInputProps } from '@/components/text-input';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {
  AttributeArrayType,
  AttributeArrayValue,
  AttributeScalarType,
  AttributeScalarValue,
} from '@/types/models';
import { InputField } from '@/zendro/record-fields';

type ArrayFieldProps = Overwrite<
  TextInputProps,
  {
    onChange?: (value: AttributeArrayValue) => void;
    onError?: (value?: string) => void;
    value: AttributeArrayValue;
    type: AttributeArrayType;
  }
>;

export default function ArrayField({
  onChange,
  onError,
  value: arrayValue,
  endAdornment: _,
  helperText,
  type,
  label,
  ...props
}: ArrayFieldProps): ReactElement {
  const classes = useStyles();
  const { t } = useTranslation();

  const handleOnChange =
    (index: number) =>
    (v: AttributeScalarValue | AttributeArrayValue): void => {
      const scalarValue = v as AttributeScalarValue;
      if (onChange && arrayValue) {
        arrayValue[index] = scalarValue;
        onChange(arrayValue);
      }
    };

  const addItem =
    (index: number) =>
    (event: React.MouseEvent<HTMLButtonElement>): void => {
      event.preventDefault();
      arrayValue
        ? arrayValue.splice(index + 1, 0, null)
        : (arrayValue = [null]);
      if (onChange) {
        onChange(arrayValue);
      }
    };

  const handleOnClear = (index: number): void => {
    if (arrayValue && onChange && !props.readOnly) {
      arrayValue[index] = null;
      onChange(arrayValue);
    }
  };

  const deleteItem = (index: number): void => {
    if (arrayValue && onChange && !props.readOnly) {
      arrayValue.splice(index, 1);
      onChange(arrayValue);
    }
  };

  return (
    <Accordion className={classes.accordion}>
      <AccordionSummary
        expandIcon={
          <ExpandMoreIcon data-cy="arrayfield-accordion-expand-button" />
        }
      >
        {label}
      </AccordionSummary>
      <AccordionDetails>
        <fieldset className={classes.fieldset}>
          {/* VALIDATION ERRORS */}
          {helperText && (
            <FormHelperText
              className={classes.helperText}
              component={helperText.component ?? 'p'}
            >
              {helperText.node}
            </FormHelperText>
          )}

          {/* INSERT AT POSITION=0 */}
          <Button
            className={classes.actionAddNew}
            onClick={addItem(-1)}
            data-cy="arrayfield-unshift-item"
          >
            <AddIcon /> {t('record-fields.array-add')}
          </Button>

          {/* ARRAY FIELD */}
          {arrayValue &&
            arrayValue.length > 0 &&
            arrayValue.map(
              (scalarValue: AttributeScalarValue, index: number) => (
                <InputActions
                  key={index}
                  className={classes.fieldContainer}
                  actionBottom={
                    onChange && (
                      <IconButton
                        className={clsx(
                          classes.actionAddNewBottom,
                          'action-bottom'
                        )}
                        onClick={addItem(index)}
                        data-cy={`arrayfield-add-item-${index}`}
                      >
                        <AddIcon />
                      </IconButton>
                    )
                  }
                  actionRight={
                    onChange && (
                      <IconButton
                        className={clsx(classes.actionDelete)}
                        size="small"
                        tooltip={t('record-fields.array-delete')}
                        onClick={() => deleteItem(index)}
                        data-cy={`arrayfield-delete-item-${index}`}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )
                  }
                >
                  <InputField
                    {...props}
                    style={{
                      width: '100%',
                    }}
                    type={
                      type.substring(1, type.length - 1) as AttributeScalarType
                    }
                    value={scalarValue}
                    label={'item ' + index}
                    onChange={handleOnChange(index)}
                    onError={onError}
                    data-cy={`arrayfield-inputfield-${index}`}
                    endAdornment={
                      onChange && (
                        <InputAdornment position="end">
                          <IconButton
                            className={classes.actionClear}
                            tooltip={t('record-fields.array-unset')}
                            onClick={() => handleOnClear(index)}
                            data-cy={`arrayfield-inputfield-unset-${index}`}
                          >
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  />
                </InputActions>
              )
            )}
        </fieldset>
      </AccordionDetails>
    </Accordion>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    accordion: {
      boxShadow: 'none',
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: theme.shape.borderRadius,
      borderColor: 'rgba(0, 0, 0, 0.23)',
      backgroundColor: 'inherit',
      padding: theme.spacing(2, 0),
      width: '100%',
    },
    actionAddNew: {
      color: theme.palette.grey[700],
      fontWeight: 'bold',
      margin: theme.spacing(0, 0, 2, 6),
      '&:hover': {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.background.default,
      },
    },
    actionAddNewBottom: {
      display: 'none',
      '&:hover': {
        color: theme.palette.background.default,
        backgroundColor: theme.palette.primary.main,
      },
    },
    actionClear: {
      '&:hover': {
        color: theme.palette.secondary.main,
        backgroundColor: theme.palette.background.default,
      },
    },
    actionDelete: {
      '&:hover': {
        color: theme.palette.secondary.main,
        backgroundColor: theme.palette.background.default,
      },
    },
    fieldset: {
      border: 0,
      overflowY: 'auto',
      position: 'relative',
      maxHeight: theme.spacing(180),
    },
    fieldContainer: {
      width: '100%',
      '&:hover .action-bottom': {
        display: 'inline-flex',
      },
    },
    helperText: {
      marginBottom: theme.spacing(2),
    },
  })
);
