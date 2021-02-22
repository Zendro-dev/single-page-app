import React from 'react';

import {
  TableRow,
  TableCell,
  Tooltip,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import {
  DeleteOutline as DeleteIcon,
  Edit as EditIcon,
  VisibilityTwoTone as DetailIcon,
} from '@material-ui/icons';

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

function EnhancedTableRowIcon({ label, to, ...props }) {
  // TODO replace this with a Link (next link?)
  return (
    <TableCell padding="checkbox" align="center">
      <Tooltip title={label}>
        <IconButton
          color="default"
          onClick={() => {
            alert(to);
          }}
        >
          {props.children}
        </IconButton>
      </Tooltip>
    </TableCell>
  );
}

export default function EnhancedTableRow({ record, attributes }) {
  // TODO needs to be aware of the model to compose the correct Link to View/Update/Delete

  const classes = useStyles();

  return (
    // TODO permissions
    // TODO handleOnRowClick
    // ? accomodate associations
    <TableRow hover role="checkbox" tabIndex={-1}>
      <EnhancedTableRowIcon label="detail" to="detail">
        <DetailIcon fontSize="small" className={classes.iconDetail} />
      </EnhancedTableRowIcon>
      <EnhancedTableRowIcon label="edit" to="edit">
        <EditIcon fontSize="small" className={classes.iconEdit} />
      </EnhancedTableRowIcon>
      <EnhancedTableRowIcon label="delete" to="delete">
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
