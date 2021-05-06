import React, { ReactElement } from 'react';
import {
  CircularProgress,
  Fade,
  Table as MuiTable,
  TableProps as MuiTableProps,
  Typography,
} from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { DataRecord } from '@/types/models';

import '@/i18n';
import { useTranslation } from 'react-i18next';

export interface TableRecord {
  data: DataRecord;
  isAssociated?: boolean;
}

// export interface EnhancedTableProps {
//   attributes: ParsedAttribute[];
//   filterID?: string | number;
//   onRead?: (primaryKey: string | number) => void;
//   onUpdate?: (primaryKey: string | number) => void;
//   onDelete?: (primaryKey: string | number) => void;
//   onSetOrder: (field: string) => void;

//   records: TableRecord[];
//   activeOrder: string;
//   orderDirection: 'ASC' | 'DESC';
//   isValidatingRecords: boolean;

//   onAssociate?: TableRowAssociationHandler;
//   associationView?: 'details' | 'update' | 'new';
//   primaryKey: string;
//   recordsToAdd?: (string | number)[];
//   recordsToRemove?: (string | number)[];
// }

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
      overflow: 'auto',
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
