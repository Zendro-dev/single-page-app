import React, { PropsWithChildren, ReactElement, useMemo } from 'react';
import {
  TableRow,
  TableCell,
  Tooltip,
  makeStyles,
  IconButton,
  createStyles,
} from '@material-ui/core';
import {
  DeleteOutline as DeleteIcon,
  Edit as EditIcon,
  VisibilityTwoTone as DetailIcon,
  Link as LinkIcon,
  LinkOff as LinkOffIcon,
} from '@material-ui/icons';
import { DataRecord, ParsedAttribute } from '@/types/models';

export type TableRowActionHandler = (primaryKey: string | number) => void;

export type TableRowAssociationHandler = (
  primaryKey: string | number,
  list: 'toAdd' | 'toRemove',
  action: 'add' | 'remove'
) => void;

interface TableRowAcions {
  read?: TableRowActionHandler;
  update?: TableRowActionHandler;
  delete?: TableRowActionHandler;
  associationHandler?: TableRowAssociationHandler;
}

interface EnhancedTableRowIconProps {
  label: string;
  onClick: () => void;
}

interface EnhancedTableRowProps {
  record: DataRecord;
  attributes: ParsedAttribute[];
  actions: TableRowAcions;
  isMarked?: boolean;
  isAssociated?: boolean;
}

function EnhancedTableRowIcon({
  label,
  onClick,
  children,
}: PropsWithChildren<EnhancedTableRowIconProps>): ReactElement {
  return (
    <TableCell padding="checkbox" align="center">
      <Tooltip title={label} disableInteractive={true} arrow={true}>
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
  actions,
  isMarked,
  isAssociated,
}: EnhancedTableRowProps): ReactElement {
  const classes = useStyles();

  const primaryKey = useMemo(() => {
    const primaryKeyAttribute =
      attributes.find((attribute) => attribute?.primaryKey)?.name ?? 'id';
    return record[primaryKeyAttribute] as string | number;
  }, [attributes, record]);

  const handleOnAction = ({
    handler,
  }: {
    handler: TableRowActionHandler;
  }) => () => {
    handler(primaryKey);
  };

  const handleOnAssocAction = ({
    handler,
    list,
    action,
  }: {
    handler: TableRowAssociationHandler;
    list: 'toAdd' | 'toRemove';
    action: 'add' | 'remove';
  }) => () => {
    handler(primaryKey, list, action);
  };

  return (
    // ? accomodate associations

    <TableRow
      hover
      role="checkbox"
      onDoubleClick={
        actions.read
          ? handleOnAction({
              handler: actions.read,
            })
          : undefined
      }
    >
      {actions.associationHandler && (
        <EnhancedTableRowIcon
          label={`${isMarked ? 'un' : ''}marks this record to be ${
            isAssociated ? 'removed' : 'added'
          }`}
          onClick={handleOnAssocAction({
            handler: actions.associationHandler,
            list: isAssociated ? 'toRemove' : 'toAdd',
            action: isMarked ? 'remove' : 'add',
          })}
        >
          {isAssociated ? (
            isMarked ? (
              <LinkOffIcon
                fontSize="small"
                className={classes.iconLinkOffMarked}
              />
            ) : (
              <LinkIcon fontSize="small" />
            )
          ) : isMarked ? (
            <LinkIcon fontSize="small" className={classes.iconLinkMarked} />
          ) : (
            <LinkOffIcon fontSize="small" />
          )}
        </EnhancedTableRowIcon>
      )}
      {actions.read && (
        <EnhancedTableRowIcon
          label="detail"
          onClick={handleOnAction({
            handler: actions.read,
          })}
        >
          <DetailIcon fontSize="small" className={classes.iconDetail} />
        </EnhancedTableRowIcon>
      )}
      {actions.update && (
        <EnhancedTableRowIcon
          label="edit"
          onClick={handleOnAction({
            handler: actions.update,
          })}
        >
          <EditIcon fontSize="small" className={classes.iconEdit} />
        </EnhancedTableRowIcon>
      )}
      {actions.delete && (
        <EnhancedTableRowIcon
          label="delete"
          onClick={handleOnAction({
            handler: actions.delete,
          })}
        >
          <DeleteIcon fontSize="small" className={classes.iconDelete} />
        </EnhancedTableRowIcon>
      )}
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

const useStyles = makeStyles((theme) =>
  createStyles({
    iconDetail: {
      '&:hover': {
        color: theme.palette.primary.main,
      },
    },
    iconEdit: {
      '&:hover': {
        color: theme.palette.primary.main,
      },
    },
    iconDelete: {
      '&:hover': {
        color: theme.palette.secondary.main,
      },
    },
    iconLinkMarked: {
      color: 'green',
    },
    iconLinkOffMarked: {
      color: 'red',
    },
  })
);
