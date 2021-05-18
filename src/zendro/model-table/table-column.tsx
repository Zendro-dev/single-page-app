import React, { ReactElement } from 'react';
import {
  TableSortLabel,
  TableCell,
  Typography,
  Tooltip,
  Box,
  TableCellProps,
} from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { SvgIconType } from '@/types/elements';
import { OrderDirection } from '@/types/queries';

interface TableColumnProps extends TableCellProps {
  label: string;
  icon?: SvgIconType;
  tooltip?: string;
  disableSort: boolean;
  activeOrder: boolean;
  orderDirection: OrderDirection;
  onSortLabelClick(field: string): void;
}

export default function TableColumn({
  label,
  icon: Icon,
  disableSort,
  tooltip,
  activeOrder,
  orderDirection,
  onSortLabelClick,
  ...props
}: TableColumnProps): ReactElement {
  const classes = useStyles();
  return (
    <TableCell {...props}>
      <TableSortLabel
        active={activeOrder}
        disabled={disableSort}
        direction={orderDirection.toLowerCase() as Lowercase<OrderDirection>}
        onClick={() => {
          onSortLabelClick(label);
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
