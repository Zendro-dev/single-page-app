import React, { ReactElement } from 'react';
import {
  TableSortLabel,
  TableCell,
  Typography,
  Tooltip,
  Box,
  TableCellProps,
} from '@material-ui/core';
import { Order } from './EnhancedTableHead';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';

interface EnhacedTableHeadCellProps extends TableCellProps {
  label: string;
  // TODO remove any
  icon: OverridableComponent<any> | null;
  tooltip: string | null;
  disableSort: boolean;
  activeOrder: boolean;
  orderDirection: Order;
  onTableCellClick(field: string): void;
}

export default function EnhancedTableHeadCell({
  label,
  icon: Icon,
  disableSort,
  tooltip,
  activeOrder,
  orderDirection,
  onTableCellClick,
  ...props
}: EnhacedTableHeadCellProps): ReactElement {
  return (
    <TableCell {...props}>
      <TableSortLabel
        active={activeOrder}
        disabled={disableSort}
        direction={orderDirection}
        onClick={() => {
          onTableCellClick(label);
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          flexWrap="nowrap"
          alignContent="center"
        >
          {Icon && tooltip && (
            <Tooltip title={tooltip}>
              <Icon fontSize="small" color="disabled" />
            </Tooltip>
          )}
          <Typography
            color="inherit"
            variant="caption"
            display="inline"
            noWrap={true}
          >
            {label}
          </Typography>
        </Box>
      </TableSortLabel>
    </TableCell>
  );
}
