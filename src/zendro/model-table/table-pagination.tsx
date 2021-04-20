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

interface RecordsTablePaginationProps {
  paginationLimit?: number;
  count: number;
  options: number[];
  hasFirstPage: boolean | null;
  hasLastPage: boolean | null;
  hasNextPage: boolean | null;
  hasPreviousPage: boolean | null;
  onPagination: (action: string) => void;
  onPaginationLimitChange: (
    event: React.ChangeEvent<{ value: number }>
  ) => void;
}

export default function RecordsTablePagination({
  paginationLimit,
  count,
  options,
  hasFirstPage,
  hasLastPage,
  hasNextPage,
  hasPreviousPage,
  onPagination,
  onPaginationLimitChange,
}: RecordsTablePaginationProps): ReactElement {
  const classes = useStyles();
  const handleOnPagination = (action: string) => () => {
    if (onPagination) {
      onPagination(action);
    }
  };
  const handlePaginationLimitChange = (
    event: React.ChangeEvent<{ value: number }>
  ): void => {
    if (onPaginationLimitChange) {
      onPaginationLimitChange(event);
    }
  };
  return (
    <Box display="flex" className={classes.pagination}>
      <FormControl className={classes.paginationLimit}>
        <InputLabel id="pagination">Rows</InputLabel>
        <Select
          labelId="pagination"
          variant="standard"
          value={paginationLimit}
          onChange={handlePaginationLimitChange}
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
            onClick={handleOnPagination('first')}
            disabled={!hasFirstPage}
          >
            <FirstPage />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Previous page">
        <span>
          <IconButton
            onClick={handleOnPagination('backward')}
            disabled={!hasPreviousPage}
          >
            <KeyboardArrowLeft />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Next page">
        <span>
          <IconButton
            onClick={handleOnPagination('forward')}
            disabled={!hasNextPage}
          >
            <KeyboardArrowRight />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Last page">
        <span>
          <IconButton
            onClick={handleOnPagination('last')}
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
