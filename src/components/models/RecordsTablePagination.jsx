import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import {
  Toolbar,
  IconButton,
  Tooltip,
  InputBase,
  InputLabel,
  MenuItem,
  Select,
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
    minWidth: '5rem',
    marginLeft: '2rem',
  },
}));
export default function RecordsTablePagination(props) {
  const classes = useStyles();
  const { t } = useTranslation();
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
    <Toolbar className={classes.root}>
      {/* Row Selector */}
      <div className={classes.paginationLimit}>
        <InputLabel>{t('modelPanels.rows', 'Rows')}</InputLabel>
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
      </div>
      <div className={classes.count}>
        <InputLabel shrink>{t('modelPanels.count', 'Count')}</InputLabel>
        <InputBase value={props.count} disabled={true} />
      </div>
      <Tooltip title={t('modelPanels.goToFirstPage', 'First page')}>
        <IconButton
          onClick={handleOnPagination('first')}
          disabled={!props.hasFirstPage}
        >
          <FirstPage />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('modelPanels.goToPreviousPage', 'Previous page')}>
        <IconButton
          onClick={handleOnPagination('backward')}
          disabled={!props.hasPreviousPage}
        >
          <KeyboardArrowLeft />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('modelPanels.goToNextPage', 'Next page')}>
        <IconButton
          onClick={handleOnPagination('forward')}
          disabled={!props.hasNextPage}
        >
          <KeyboardArrowRight />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('modelPanels.goToLastPage', 'Last page')}>
        <IconButton
          onClick={handleOnPagination('last')}
          disabled={!props.hasLastPage}
        >
          <LastPage />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
}
