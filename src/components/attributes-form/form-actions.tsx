import React, { ReactElement } from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core';
import {
  Cached as Reload,
  ChevronLeft as CancelIcon,
  Create as EditIcon,
  Delete as DeleteIcon,
  Visibility as ReadIcon,
  Save as SaveIcon,
} from '@material-ui/icons';

import ActionButton from '@/components/buttons/fab';

import { AclPermission } from '@/types/acl';

export type FormAction =
  | 'cancel'
  | 'create'
  | 'delete'
  | 'read'
  | 'reload'
  | 'update';

export type FormView = 'create' | 'read' | 'update';

interface Props {
  permissions: AclPermission[];
  formId: string;
  view: FormView;
  onAction: (action: FormAction) => () => void;
}

export default function FormActions({
  permissions,
  formId,
  view,
  onAction,
}: Props): ReactElement {
  const classes = useStyles();
  return (
    <>
      <div className={classes.actions}>
        <ActionButton
          color="secondary"
          form={formId}
          onClick={onAction('cancel')}
          icon={CancelIcon}
          size="large"
          tooltip="Exit form"
        />

        {(permissions.includes('read') || permissions.includes('*')) &&
          view === 'update' && (
            <ActionButton
              color="primary"
              form={formId}
              icon={ReadIcon}
              onClick={onAction('read')}
              size="medium"
              tooltip="View record details"
            />
          )}

        {(permissions.includes('update') || permissions.includes('*')) &&
          view === 'read' && (
            <ActionButton
              color="primary"
              form={formId}
              icon={EditIcon}
              onClick={onAction('update')}
              size="medium"
              tooltip="Edit record"
            />
          )}
      </div>

      <div className={classes.actions}>
        {(permissions.includes('delete') || permissions.includes('*')) &&
          (view === 'read' || view === 'update') && (
            <ActionButton
              color="secondary"
              form={formId}
              icon={DeleteIcon}
              onClick={onAction('delete')}
              tooltip="Delete record"
              size="medium"
            />
          )}

        {(permissions.includes('read') || permissions.includes('*')) &&
          (view === 'read' || view === 'update') && (
            <ActionButton
              color="primary"
              form={formId}
              icon={Reload}
              tooltip="Reload data"
              size={view === 'read' ? 'large' : 'medium'}
              onClick={onAction('reload')}
            />
          )}

        {(permissions.includes('create') ||
          permissions.includes('update') ||
          permissions.includes('*')) &&
          (view === 'create' || view === 'update') && (
            <ActionButton
              color="primary"
              form={formId}
              icon={SaveIcon}
              size="large"
              tooltip="Submit changes"
              type="submit"
            />
          )}
      </div>
    </>
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
