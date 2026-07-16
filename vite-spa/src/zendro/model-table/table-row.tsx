import React, { ReactElement } from 'react';
import {
  TableCell as MuiTableCell,
  TableRow as MuiTableRow,
  TableRowProps as MuiTableRowProps,
} from '@mui/material';
import {
  DataRecord,
  ParsedAttribute,
  AttributeWithDescription,
} from '@/types/models';

export type TableRowActionHandler = (primaryKey: string | number) => void;

export type TableRowAssociationHandler = (
  primaryKey: string | number,
  list: 'toAdd' | 'toRemove',
  action: 'add' | 'remove'
) => void;

interface TableRowProps extends MuiTableRowProps {
  attributes: ParsedAttribute[];
  record: DataRecord;
}

export default function TableRow({
  attributes,
  record,
  ...props
}: TableRowProps): ReactElement {
  return (
    <MuiTableRow {...props}>
      {props.children}
      {attributes.map((attribute, index) => (
        <MuiTableCell
          key={`${attribute.name}-${index}`}
          align={(() => {
            const type =
              (attribute.type as AttributeWithDescription).type ??
              attribute.type;
            return type.includes('Int') || type.includes('Float')
              ? 'right'
              : 'left';
          })()}
        >
          {String(
            record[attribute.name] !== null ? record[attribute.name] : ''
          )}
        </MuiTableCell>
      ))}
    </MuiTableRow>
  );
}
