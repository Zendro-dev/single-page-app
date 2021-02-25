import { React, useState } from 'react';
import { TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import KeyIcon from '@material-ui/icons/VpnKey';
import EnhancedTableHeadCell from './EnhancedTableHeadCell';

export default function EnhancedTableHead({ attributes }) {
  const [activeOrderCol, setActiveOrderCol] = useState(
    attributes[Object.keys(attributes)[0]]
  );
  const [activeOrder, setActiveOrder] = useState('asc');

  const handleTableHeadCellClick = (event, field) => {
    const isAsc = activeOrderCol === field && activeOrder === 'asc';
    setActiveOrder(isAsc ? 'desc' : 'asc');
    setActiveOrderCol(field);
  };

  return (
    // TODO colspan depending on permissions
    <TableHead>
      <TableRow>
        <TableCell colSpan={3} align="center" padding="checkbox">
          <Typography
            color="inherit"
            variant="caption"
            display="inline"
            noWrap={true}
          >
            Actions
          </Typography>
        </TableCell>
        {attributes.map((attribute, index) => (
          <EnhancedTableHeadCell
            label={attribute.name}
            icon={attribute.readOnly ? KeyIcon : null}
            tooltip={attribute.readOnly ? 'Unique Identifier' : null}
            align={
              attribute.type.includes('Int') || attribute.type.includes('Float')
                ? 'right'
                : 'left'
            }
            disableSort={false}
            activeOrder={activeOrderCol === attribute.name}
            orderDirection={
              activeOrderCol === attribute.name ? activeOrder : 'asc'
            }
            sortDirection={
              activeOrderCol === attribute.name ? activeOrder : false
            }
            onClick={handleTableHeadCellClick}
            key={`EnhancedTableHeadCell-${attribute.name}-${index}`}
          />
        ))}
      </TableRow>
    </TableHead>
  );
}
