import React, { ReactElement } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  IconButton,
  Tooltip,
  InputBase,
  InputLabel,
  MenuItem,
  Select,
  Box,
  FormControl,
  createStyles,
} from '@material-ui/core';
import {
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
} from '@material-ui/icons';

import { TablePaginationPosition } from './hooks/usePagination';

interface RecordsTablePaginationProps {
  paginationLimit?: number;
  count: number;
  options: number[];
  hasFirstPage: boolean | null;
  hasLastPage: boolean | null;
  hasNextPage: boolean | null;
  hasPreviousPage: boolean | null;
  onPageChange: (
    position: TablePaginationPosition,
    cursor: string | null
  ) => void;
  onPageSizeChange: (limit: number) => void;
  startCursor: string | null;
  endCursor: string | null;
}

export default function RecordsTablePagination({
  paginationLimit,
  count,
  options,
  hasFirstPage,
  hasLastPage,
  hasNextPage,
  hasPreviousPage,
  startCursor,
  endCursor,
  ...props
}: RecordsTablePaginationProps): ReactElement {
  const classes = useStyles();

  const handleOnPageChange = (position: TablePaginationPosition) => () => {
    if (!props.onPageChange) return;

    const cursor =
      position === 'next'
        ? endCursor
        : position === 'previous'
        ? startCursor
        : null;

    console.log({ position, cursor });

    props.onPageChange(position, cursor);
  };

  const handlePageLimitChange = (
    event: React.ChangeEvent<{ value: number }>
  ): void => {
    if (props.onPageSizeChange) props.onPageSizeChange(event.target.value);
  };

  return (
    <Box display="flex" className={classes.pagination}>
      <FormControl className={classes.paginationLimit}>
        <InputLabel id="pagination">Rows</InputLabel>
        <Select
          labelId="pagination"
          variant="standard"
          value={paginationLimit}
          onChange={handlePageLimitChange}
        >
          {options.map((rowValue, index) => (
            <MenuItem value={rowValue} key={index}>
              {rowValue}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {count && (
        <div>
          <InputLabel shrink>Count</InputLabel>
          <InputBase value={count} disabled={true} />
        </div>
      )}

      <Tooltip title="First page" style={{ marginLeft: 'auto' }}>
        <span>
          <IconButton
            onClick={handleOnPageChange('first')}
            disabled={!hasFirstPage}
          >
            <FirstPage />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Previous page">
        <span>
          <IconButton
            onClick={handleOnPageChange('previous')}
            disabled={!hasPreviousPage}
          >
            <KeyboardArrowLeft />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Next page">
        <span>
          <IconButton
            onClick={handleOnPageChange('next')}
            disabled={!hasNextPage}
          >
            <KeyboardArrowRight />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Last page">
        <span>
          <IconButton
            onClick={handleOnPageChange('last')}
            disabled={!hasLastPage}
          >
            <LastPage />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
}

const useStyles = makeStyles((theme) =>
  createStyles({
    pagination: {
      padding: theme.spacing(6, 2),
    },
    paginationLimit: {
      minWidth: '5rem',
      marginLeft: '1rem',
      marginRight: '1rem',
    },
  })
);
