import React, { ReactElement } from 'react';
import { TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import KeyIcon from '@material-ui/icons/VpnKey';
import EnhancedTableHeadCell from './table-head-cell';
import { ParsedAttribute } from '@/types/models';
import { AclPermission } from '@/types/acl';
import { OrderDirection } from '@/types/queries';

interface EnhancedTableHeadProps {
  attributes: ParsedAttribute[];
  actionsColSpan?: number;
  onSortLabelClick(value: string): void;
  activeOrder: string;
  orderDirection: OrderDirection;
}

export default function EnhancedTableHead({
  attributes,
  onSortLabelClick,
  activeOrder,
  orderDirection,
  actionsColSpan,
}: EnhancedTableHeadProps): ReactElement {
  return (
    // TODO colspan depending on permissions
    <TableHead>
      <TableRow>
        <TableCell colSpan={actionsColSpan} align="center" padding="checkbox">
          <Typography
            color="inherit"
            variant="caption"
            display="inline"
            noWrap={true}
            width="9rem"
          >
            Actions
          </Typography>
        </TableCell>
        {attributes.map((attribute, index) => (
          <EnhancedTableHeadCell
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
      </TableRow>
    </TableHead>
  );
}
