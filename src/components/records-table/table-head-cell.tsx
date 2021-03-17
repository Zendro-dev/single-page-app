import React, { ReactElement } from 'react';
import {
  TableSortLabel,
  TableCell,
  Typography,
  Tooltip,
  Box,
  TableCellProps,
} from '@material-ui/core';
import { Order } from './table-head';
import { SvgIconType } from '@/types/elements';
import { makeStyles, createStyles } from '@material-ui/core/styles';

interface EnhacedTableHeadCellProps extends TableCellProps {
  label: string;
  icon?: SvgIconType;
  tooltip?: string;
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
  const classes = useStyles();
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
        {Icon && tooltip && (
          <Tooltip title={tooltip}>
            <Icon fontSize="small" color="disabled" className={classes.icon} />
          </Tooltip>
        )}
        <Box display="inline">
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

const useStyles = makeStyles((theme) =>
  createStyles({
    icon: {
      marginRight: theme.spacing(1),
    },
  })
);
