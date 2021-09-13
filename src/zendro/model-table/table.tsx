import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CircularProgress,
  Fade,
  Table as MuiTable,
  TableProps as MuiTableProps,
  Typography,
} from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import { DataRecord } from '@/types/models';

export interface TableRecord {
  data: DataRecord;
  isAssociated?: boolean;
}

interface ZendroTableProps extends MuiTableProps {
  caption: string;
  isEmpty?: boolean;
  isLoading?: boolean;
}

export default function ZendroTable({
  isEmpty,
  isLoading,
  ...props
}: ZendroTableProps): ReactElement {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <div className={classes.tableWrapper}>
      <MuiTable {...props}>
        <caption hidden>{props.caption}</caption>
        {props.children}
      </MuiTable>
      {isLoading && (
        <div className={classes.tablePlaceholder}>
          <Fade in={isLoading}>
            <CircularProgress color="primary" disableShrink />
          </Fade>
        </div>
      )}
      {!isLoading && isEmpty && (
        <div className={classes.tablePlaceholder}>
          <Typography variant="body1">{t('model-table.no-data')}</Typography>
        </div>
      )}
    </div>
  );
}

const useStyles = makeStyles(() =>
  createStyles({
    tableWrapper: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
    },
    tablePlaceholder: {
      position: 'absolute',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },
  })
);
