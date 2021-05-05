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

import '@/i18n';
import { useTranslation } from 'react-i18next';

interface RecordsTablePaginationProps {
  paginationLimit?: number;
  count: number;
  options: number[];
  hasFirstPage?: boolean;
  hasLastPage?: boolean;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
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
  const { t } = useTranslation();

  const handleOnPageChange = (position: TablePaginationPosition) => () => {
    if (!props.onPageChange) return;

    const cursor =
      position === 'next'
        ? endCursor
        : position === 'previous'
        ? startCursor
        : null;

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
        <InputLabel id="pagination">
          {t('model-table.pagination-rows')}
        </InputLabel>
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

      {count >= 0 && (
        <div>
          <InputLabel shrink>{t('model-table.pagination-count')}</InputLabel>
          <InputBase value={count} disabled={true} />
        </div>
      )}

      <Tooltip
        title={t('model-table.pagination-first')}
        style={{ marginLeft: 'auto' }}
      >
        <span>
          <IconButton
            onClick={handleOnPageChange('first')}
            disabled={!hasFirstPage}
          >
            <FirstPage />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title={t('model-table.pagination-previous')}>
        <span>
          <IconButton
            onClick={handleOnPageChange('previous')}
            disabled={!hasPreviousPage}
          >
            <KeyboardArrowLeft />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title={t('model-table.pagination-next')}>
        <span>
          <IconButton
            onClick={handleOnPageChange('next')}
            disabled={!hasNextPage}
          >
            <KeyboardArrowRight />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title={t('model-table.pagination-last')}>
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
