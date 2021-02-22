import React from 'react';
import {
  TableSortLabel,
  TableCell,
  Typography,
  Tooltip,
} from '@material-ui/core';

export default function EnhancedTableHeadCell({
  label,
  icon: Icon,
  disableSort,
  tooltip,
  activeOrder,
  orderDirection,
  onClick,
  ...props
}) {
  return (
    <TableCell {...props}>
      <TableSortLabel
        active={activeOrder}
        disabled={disableSort}
        direction={orderDirection}
        onClick={(event) => {
          onClick(event, label);
        }}
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
      </TableSortLabel>
    </TableCell>
  );
}
