import React, { ReactElement } from 'react';
import {
  TableCell as MuiTableCell,
  TableHead as MuiTableHead,
  TableRow as MuiTableRow,
  Typography,
} from '@material-ui/core';
import KeyIcon from '@material-ui/icons/VpnKey';
import TableColumn from './table-column';
import { ParsedAttribute } from '@/types/models';
import { OrderDirection } from '@/types/queries';

interface TableHeaderProps {
  attributes: ParsedAttribute[];
  actionsColSpan?: number;
  onSortLabelClick(value: string): void;
  activeOrder: string;
  orderDirection: OrderDirection;
}

export default function TableHeader({
  attributes,
  onSortLabelClick,
  activeOrder,
  orderDirection,
  actionsColSpan,
}: TableHeaderProps): ReactElement {
  return (
    <MuiTableHead>
      <MuiTableRow>
        <MuiTableCell
          colSpan={actionsColSpan}
          align="center"
          padding="checkbox"
        >
          <Typography
            color="inherit"
            display="inline"
            noWrap
            variant="caption"
            width="9rem"
          >
            Actions
          </Typography>
        </MuiTableCell>
        {attributes.map((attribute, index) => (
          <TableColumn
            label={attribute.name}
            icon={attribute.primaryKey ? KeyIcon : undefined}
            tooltip={attribute.primaryKey ? 'Unique Identifier' : undefined}
            align={
              attribute.type.includes('Int') || attribute.type.includes('Float')
                ? 'right'
                : 'left'
            }
            disableSort={false}
            activeOrder={activeOrder === attribute.name}
            orderDirection={
              activeOrder === attribute.name ? orderDirection : 'ASC'
            }
            onSortLabelClick={onSortLabelClick}
            key={`EnhancedTableHeadCell-${attribute.name}-${index}`}
          />
        ))}
      </MuiTableRow>
    </MuiTableHead>
  );
}
