import React, { ReactElement, useState } from 'react';
import { TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import KeyIcon from '@material-ui/icons/VpnKey';
import EnhancedTableHeadCell from './EnhancedTableHeadCell';
import { QueryVariableOrder } from '@/types/queries';
import { ParsedAttribute } from '@/types/models';

interface EnhancedTableHeadProps {
  attributes: ParsedAttribute[];
  handleSetOrder(value: QueryVariableOrder): void;
}

declare global {
  interface String {
    toUpperCase(this: 'asc' | 'desc'): 'ASC' | 'DESC';
  }
}

export type Order = 'asc' | 'desc';

export default function EnhancedTableHead({
  attributes,
  handleSetOrder,
}: EnhancedTableHeadProps): ReactElement {
  const [activeOrderCol, setActiveOrderCol] = useState(attributes[0].name);
  const [activeOrder, setActiveOrder] = useState<Order>('asc');

  const handleTableHeadCellClick = (field: string): void => {
    const isAsc = activeOrderCol === field && activeOrder === 'asc';
    setActiveOrder(isAsc ? 'desc' : 'asc');
    setActiveOrderCol(field);
    handleSetOrder({ field: field, order: activeOrder.toUpperCase() });
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
            icon={attribute.primaryKey ? KeyIcon : null}
            tooltip={attribute.primaryKey ? 'Unique Identifier' : null}
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
            onTableCellClick={handleTableHeadCellClick}
            key={`EnhancedTableHeadCell-${attribute.name}-${index}`}
          />
        ))}
      </TableRow>
    </TableHead>
  );
}
