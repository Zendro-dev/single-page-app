import React from 'react';
import {
  TableSortLabel,
  TableCell,
  Typography,
  Grid,
  Tooltip,
} from '@material-ui/core';

export default function EnhancedTableHeadCell({
  label,
  icon: Icon,
  sortable,
  tooltip,
  ...props
}) {
  const { active, direction, sortDirection } = props;

  return (
    <TableCell
      key="idField"
      align="left"
      padding="checkbox"
      sortDirection={true}
      // sortDirection={orderBy === label ? order : false}
    >
      <TableSortLabel
        active={true}
        // active={orderBy === label}
        // direction={order}
        direction="asc"
        // onClick={(event) => {
        //   onRequestSort(event, 'idField');
        // }}
      >
        <Grid
          container
          alignItems="center"
          alignContent="center"
          wrap="nowrap"
          spacing={1}
        >
          {Icon && tooltip && (
            <Grid item>
              {/* <Tooltip title={t('modelPanels.internalId', 'Unique Identifier')}> */}
              <Tooltip title={tooltip}>
                <Icon
                  fontSize="small"
                  color="disabled"
                  style={{ marginTop: 8 }}
                />
              </Tooltip>
            </Grid>
          )}
          <Grid item>
            <Typography
              color="inherit"
              variant="caption"
              display="inline"
              noWrap={true}
            >
              {label}
            </Typography>
          </Grid>
        </Grid>
      </TableSortLabel>
    </TableCell>
  );
}
