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

interface EnhancedTableRowProps {
  // TODO correct typing for record
  record: any;
  attributes: ParsedAttribute[];
  onRead: (primaryKey: string | number) => void;
  onUpdate: (primaryKey: string | number) => void;
  onDelete: (primaryKey: string | number) => void;
}

function EnhancedTableRowIcon({
  label,
  onClick,
  children,
}: PropsWithChildren<EnhancedTableRowIconProps>): ReactElement {
  return (
    <TableCell style={{ width: '3rem' }} padding="checkbox" align="center">
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
  onRead,
  onUpdate,
  onDelete,
}: // actions,
EnhancedTableRowProps): ReactElement {
  // TODO needs to be aware of the model to compose the correct Link to View/Update/Delete

  const classes = useStyles();

  const primaryKey = useMemo(() => {
    const primaryKeyAttribute =
      attributes.find((attribute) => attribute?.primaryKey)?.name ?? 'id';
    return record[primaryKeyAttribute];
  }, [attributes, record]);

  return (
    // TODO permissions
    // ? accomodate associations

    <TableRow
      hover
      role="checkbox"
      tabIndex={-1}
      onDoubleClick={() => onRead(primaryKey)}
    >
      <EnhancedTableRowIcon label="detail" onClick={() => onRead(primaryKey)}>
        <DetailIcon fontSize="small" className={classes.iconDetail} />
      </EnhancedTableRowIcon>
      <EnhancedTableRowIcon label="edit" onClick={() => onUpdate(primaryKey)}>
        <EditIcon fontSize="small" className={classes.iconEdit} />
      </EnhancedTableRowIcon>
      <EnhancedTableRowIcon label="delete" onClick={() => onDelete(primaryKey)}>
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
