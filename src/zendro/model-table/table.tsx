import React, { ReactElement } from 'react';
import {
  Table,
  TableBody,
  makeStyles,
  Typography,
  CircularProgress,
  Fade,
  createStyles,
} from '@material-ui/core';
import TableHeader from './table-header';
import TableRow, { TableRowAssociationHandler } from './table-row';
import { DataRecord, ParsedAttribute } from '@/types/models';
import { isEmptyArray } from '@/utils/validation';

import { usePermissions } from '@/hooks';

export interface TableRecord {
  data: DataRecord;
  isAssociated?: boolean;
}

export interface EnhancedTableProps {
  attributes: ParsedAttribute[];
  filterID?: string | number;
  onRead?: (primaryKey: string | number) => void;
  onUpdate?: (primaryKey: string | number) => void;
  onDelete?: (primaryKey: string | number) => void;
  onSetOrder: (field: string) => void;

  records: TableRecord[];
  activeOrder: string;
  orderDirection: 'ASC' | 'DESC';
  isValidatingRecords: boolean;

  onAssociate?: TableRowAssociationHandler;
  associationView?: 'details' | 'update' | 'new';
  primaryKey: string;
  recordsToAdd?: (string | number)[];
  recordsToRemove?: (string | number)[];
}

export default function EnhancedTable({
  attributes,
  associationView,
  onRead,
  onUpdate,
  onDelete,
  onSetOrder,
  onAssociate,
  records,
  activeOrder,
  orderDirection,
  isValidatingRecords,
  primaryKey,
  recordsToAdd,
  recordsToRemove,
}: EnhancedTableProps): ReactElement {
  // const dispatch = useContext(VariablesDispatch);
  const classes = useStyles();
  const { permissions } = usePermissions();
  return (
    <div className={classes.tableWrapper}>
      <Table stickyHeader size="medium">
        <TableHeader
          actionsColSpan={
            associationView === 'details'
              ? 0
              : associationView === 'new' || associationView === 'update'
              ? 1
              : Object.keys(permissions).filter((action) => action !== 'create')
                  .length
          }
          attributes={attributes}
          onSortLabelClick={onSetOrder}
          activeOrder={activeOrder}
          orderDirection={orderDirection}
        />
        <Fade in={!isValidatingRecords && !isEmptyArray(records)}>
          <TableBody>
            {records.map((record) => {
              const recordId = record.data[primaryKey] as string | number;
              return (
                // TODO key should use primaryKey value
                <TableRow
                  attributes={attributes}
                  record={record.data}
                  key={recordId}
                  isMarked={
                    recordsToAdd &&
                    recordsToRemove &&
                    recordsToAdd.concat(recordsToRemove).includes(recordId)
                  }
                  isAssociated={record.isAssociated}
                  actions={{
                    read: !associationView ? onRead : undefined,
                    update:
                      permissions.update && !associationView
                        ? onUpdate
                        : undefined,
                    delete:
                      permissions.delete && !associationView
                        ? onDelete
                        : undefined,
                    associationHandler:
                      associationView !== 'details' ? onAssociate : undefined,
                  }}
                />
              );
            })}
          </TableBody>
        </Fade>
      </Table>
      {isValidatingRecords && (
        <div className={classes.tablePlaceholder}>
          <Fade in={isValidatingRecords}>
            <CircularProgress color="primary" disableShrink={true} />
          </Fade>
        </div>
      )}
      {!isValidatingRecords && isEmptyArray(records) && (
        <div className={classes.tablePlaceholder}>
          <Typography variant="body1">No data to display</Typography>
        </div>
      )}
    </div>
  );
}

const useStyles = makeStyles((theme) =>
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
    pagination: {
      padding: theme.spacing(6, 2),
    },
  })
);
