import React, { PropsWithChildren, ReactElement, useMemo } from 'react';
import {
  TableRow,
  TableCell,
  Tooltip,
  makeStyles,
  IconButton,
} from '@material-ui/core';
import {
  DeleteOutline as DeleteIcon,
  Edit as EditIcon,
  VisibilityTwoTone as DetailIcon,
} from '@material-ui/icons';
import { ParsedAttribute } from '@/types/models';

interface EnhancedTableRowIconProps {
  label: string;
  onClick: () => void;
}

export type ActionHandler = (
  primaryKey: string,
  action: 'create' | 'read' | 'update' | 'delete'
) => void;

interface EnhancedTableRowProps {
  // TODO correct typing for record
  record: any;
  attributes: ParsedAttribute[];
  onAction: ActionHandler;
}

function EnhancedTableRowIcon({
  label,
  onClick,
  children,
}: PropsWithChildren<EnhancedTableRowIconProps>): ReactElement {
  return (
    <TableCell
      style={{ minWidth: '3rem', maxWidth: '3rem' }}
      padding="checkbox"
      align="center"
    >
      <Tooltip title={label}>
        <IconButton color="default" onClick={onClick}>
          {children}
        </IconButton>
      </Tooltip>
    </TableCell>
  );
}

export default function EnhancedTableRow({
  record,
  attributes,
  onAction,
}: // actions,
EnhancedTableRowProps): ReactElement {
  // TODO needs to be aware of the model to compose the correct Link to View/Update/Delete

  const classes = useStyles();

  const primaryKey = useMemo(() => {
    const primaryKeyAttribute =
      attributes.find((attribute) => attribute?.primaryKey)?.name ?? 'id';
    return record[primaryKeyAttribute];
  }, [attributes, record]);

  const handleReadAction = (): void => {
    onAction(primaryKey, 'read');
  };

  const handleUpdateAction = (): void => {
    onAction(primaryKey, 'update');
  };

  const handleDeleteAction = (): void => {
    onAction(primaryKey, 'delete');
  };

  return (
    // TODO permissions
    // ? accomodate associations

    <TableRow
      hover
      role="checkbox"
      tabIndex={-1}
      onDoubleClick={handleReadAction}
    >
      <EnhancedTableRowIcon label="detail" onClick={handleReadAction}>
        <DetailIcon fontSize="small" className={classes.iconDetail} />
      </EnhancedTableRowIcon>
      <EnhancedTableRowIcon label="edit" onClick={handleUpdateAction}>
        <EditIcon fontSize="small" className={classes.iconEdit} />
      </EnhancedTableRowIcon>
      <EnhancedTableRowIcon label="delete" onClick={handleDeleteAction}>
        <DeleteIcon fontSize="small" className={classes.iconDelete} />
      </EnhancedTableRowIcon>
      {attributes.map((attribute, index) => (
        <TableCell
          key={`${attribute.name}-${index}`}
          align={
            attribute.type.includes('Int') || attribute.type.includes('Float')
              ? 'right'
              : 'left'
          }
        >
          {String(
            record[attribute.name] !== null ? record[attribute.name] : ''
          )}
        </TableCell>
      ))}
    </TableRow>
  );
}

const useStyles = makeStyles(() => ({
  iconDetail: {
    '&:hover': {
      color: '#3f51b5',
    },
  },
  iconEdit: {
    '&:hover': {
      color: '#3f51b5',
    },
  },
  iconDelete: {
    '&:hover': {
      color: '#f50057',
    },
  },
}));
