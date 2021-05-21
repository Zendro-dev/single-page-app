import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TableCell as MuiTableCell,
  TableHead as MuiTableHead,
  TableRow as MuiTableRow,
  Typography,
} from '@material-ui/core';
import KeyIcon from '@material-ui/icons/VpnKey';
import TableColumn from './table-column';
import { ParsedAttribute } from '@/types/models';
import { OrderDirection } from '@/types/queries';

interface TableHeaderProps {
  attributes: ParsedAttribute[];
  actionsColSpan: number;
  onSortLabelClick(value: string): void;
  activeOrder: string;
  orderDirection: OrderDirection;
}

export default function TableHeader({
  attributes,
  onSortLabelClick,
  activeOrder,
  orderDirection,
  actionsColSpan,
}: TableHeaderProps): ReactElement {
  const { t } = useTranslation();

  return (
    <MuiTableHead>
      <MuiTableRow>
        {actionsColSpan > 0 && (
          <MuiTableCell
            colSpan={actionsColSpan}
            align="center"
            padding="checkbox"
          >
            <Typography
              color="inherit"
              display="inline"
              noWrap
              variant="caption"
              width="9rem"
            >
              {t('model-table.header-actions')}
            </Typography>
          </MuiTableCell>
        )}
        {attributes.map((attribute, index) => (
          <TableColumn
            label={attribute.name}
            icon={attribute.primaryKey ? KeyIcon : undefined}
            tooltip={
              attribute.primaryKey
                ? t('model-table.header-id-tooltip')
                : undefined
            }
            align={
              attribute.type.includes('Int') || attribute.type.includes('Float')
                ? 'right'
                : 'left'
            }
            disableSort={false}
            activeOrder={activeOrder === attribute.name}
            orderDirection={
              activeOrder === attribute.name ? orderDirection : 'ASC'
            }
            onSortLabelClick={onSortLabelClick}
            key={`EnhancedTableHeadCell-${attribute.name}-${index}`}
            data-cy={`table-column-${attribute.name}`}
          />
        ))}
      </MuiTableRow>
    </MuiTableHead>
  );
}
