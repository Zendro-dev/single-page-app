import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Theme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import {
  IconButton,
  Tooltip,
  InputBase,
  MenuItem,
  Select,
  Box,
  FormControl,
  SelectChangeEvent,
  FormHelperText,
} from '@mui/material';
import {
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
} from '@mui/icons-material';

import { TablePaginationPosition } from './hooks/usePagination';

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

  const handlePageLimitChange = (event: SelectChangeEvent<number>): void => {
    if (props.onPageSizeChange)
      props.onPageSizeChange(event.target.value as number);
  };

  return (
    <Box display="flex" className={classes.pagination}>
      <FormControl className={classes.paginationLimit}>
        <FormHelperText>{t('model-table.pagination-rows')}</FormHelperText>
        <Select
          variant="standard"
          value={paginationLimit}
          onChange={handlePageLimitChange}
          data-cy="pagination-select"
        >
          {options.map((rowValue, index) => (
            <MenuItem
              value={rowValue}
              key={index}
              data-cy={`pagination-select-${rowValue}`}
            >
              {rowValue}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {count >= 0 && (
        <div>
          <FormHelperText>{t('model-table.pagination-count')}</FormHelperText>
          <InputBase value={count} disabled={true} />
        </div>
      )}

      <Tooltip
        title={t('model-table.pagination-first') ?? ''}
        style={{ marginLeft: 'auto' }}
      >
        <span>
          <IconButton
            onClick={handleOnPageChange('first')}
            disabled={!hasFirstPage}
            data-cy="pagination-first"
          >
            <FirstPage />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title={t('model-table.pagination-previous') ?? ''}>
        <span>
          <IconButton
            onClick={handleOnPageChange('previous')}
            disabled={!hasPreviousPage}
            data-cy="pagination-previous"
          >
            <KeyboardArrowLeft />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title={t('model-table.pagination-next') ?? ''}>
        <span>
          <IconButton
            onClick={handleOnPageChange('next')}
            disabled={!hasNextPage}
            data-cy="pagination-next"
          >
            <KeyboardArrowRight />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title={t('model-table.pagination-last') ?? ''}>
        <span>
          <IconButton
            onClick={handleOnPageChange('last')}
            disabled={!hasLastPage}
            data-cy="pagination-last"
          >
            <LastPage />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    pagination: {
      alignItems: 'center',
      padding: theme.spacing(6, 2),
    },
    paginationLimit: {
      display: 'flex',
      alignItems: 'center',
      minWidth: '5rem',
      marginLeft: '1rem',
      marginRight: '1rem',
    },
  })
);
