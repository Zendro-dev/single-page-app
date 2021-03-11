import React from 'react';
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
} from '@material-ui/core';
import {
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
} from '@material-ui/icons';

const useStyles = makeStyles(() => ({
  root: {
    padding: '2rem',
  },
  count: {
    height: '2rem',
    paddingBottom: '1.2rem',
    marginLeft: '1rem',
    marginRight: '55rem',
  },
  paginationLimit: {
    marginLeft: '1rem',
    marginRight: '1rem',
  },
}));

export default function RecordsTablePagination(props) {
  const classes = useStyles();
  const handleOnPagination = (action) => () => {
    if (props.onPagination) {
      props.onPagination(action);
    }
  };
  const handlePaginationLimitChange = (event) => {
    if (props.onPaginationLimitChange) {
      props.onPaginationLimitChange(event);
    }
  };
  return (
    <Box display="flex" alignItems="center" marginTop="2rem">
      <FormControl className={classes.paginationLimit}>
        <InputLabel shrink>Rows</InputLabel>
        <Select
          value={props.paginationLimit}
          onChange={handlePaginationLimitChange}
        >
          {props.options.map((rowValue, index) => (
            <MenuItem value={rowValue} key={index}>
              {rowValue}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {props.count && (
        <div>
          <InputLabel shrink>Count</InputLabel>
          <InputBase value={props.count} disabled={true} />
        </div>
      )}
      <Tooltip title="First page" style={{ marginLeft: 'auto' }}>
        <span>
          <IconButton
            onClick={handleOnPagination('first')}
            disabled={!props.hasFirstPage}
          >
            <FirstPage />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Previous page">
        <span>
          <IconButton
            onClick={handleOnPagination('backward')}
            disabled={!props.hasPreviousPage}
          >
            <KeyboardArrowLeft />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Next page">
        <span>
          <IconButton
            onClick={handleOnPagination('forward')}
            disabled={!props.hasNextPage}
          >
            <KeyboardArrowRight />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Last page">
        <span>
          <IconButton
            onClick={handleOnPagination('last')}
            disabled={!props.hasLastPage}
          >
            <LastPage />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
}
