import React from 'react';
import { TableHead, TableRow, TableCell, Typography } from '@material-ui/core';
import EnhancedTableHeadCell from './EnhancedTableHeadCell';

export default function EnhancedTableHead({ attributes }) {
  return (
    <TableHead>
      <TableRow>
        {/* Details view 
            TODO associations? */}
        <TableCell padding="checkbox" />
        {/* Edit | Delete Actions */}
        <TableCell
          padding="checkbox"
          align="center"
          size="small"
          colSpan={2} // TODO dependent on permissions
        >
          <Typography color="inherit" variant="caption">
            {/* {t('modelPanels.actions')} */}
            Actions
          </Typography>
        </TableCell>
        {attributes.map((attribute, index) => (
          <EnhancedTableHeadCell
            label={attribute}
            key={`EnhancedTableHeadCell-${attribute}-${index}`}
          />
        ))}
      </TableRow>
    </TableHead>
  );
}
