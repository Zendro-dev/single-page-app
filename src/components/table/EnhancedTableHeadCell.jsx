import React from 'react';
import {
  TableSortLabel,
  TableCell,
  Typography,
  Tooltip,
  Grid,
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
        <Grid
          container
          alignItems="center"
          alignContent="center"
          wrap="nowrap"
          // spacing={1}
        >
          {Icon && tooltip && (
            <Grid item>
              <Tooltip title={tooltip}>
                <Icon
                  fontSize="small"
                  color="disabled"
                  style={{ marginTop: 6, marginRight: 5 }}
                />
              </Tooltip>
            </Grid>
          )}
          <Typography
            color="inherit"
            variant="caption"
            display="inline"
            noWrap={true}
          >
            {label}
          </Typography>
        </Grid>
      </TableSortLabel>
    </TableCell>
  );
}
