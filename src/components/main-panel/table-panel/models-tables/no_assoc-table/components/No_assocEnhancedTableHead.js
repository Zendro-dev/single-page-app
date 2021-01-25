import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Key from '@material-ui/icons/VpnKey';

export default function NoAssocEnhancedTableHead(props) {
  const { t } = useTranslation();
  const {
    permissions,
    order,
    orderBy,
    onRequestSort
  } = props;

  return (
    <TableHead>
      <TableRow>

        {/* See-info icon */}
        <TableCell padding="checkbox" />

        {/* Actions */}
        {
          /* acl check */
          (permissions&&permissions.no_assoc&&Array.isArray(permissions.no_assoc)
          &&(permissions.no_assoc.includes('update') || permissions.no_assoc.includes('delete') || permissions.no_assoc.includes('*')))
          &&(
            <TableCell 
              padding="checkbox" 
              align='center' 
              size='small' 
              colSpan={
                0 +
                ((permissions.no_assoc.includes('update') || permissions.no_assoc.includes('*')) ? 1 : 0) 
                +
                ((permissions.no_assoc.includes('delete') || permissions.no_assoc.includes('*')) ? 1 : 0)
              }
            >
              <Typography color="inherit" variant="caption">
                { t('modelPanels.actions') }
              </Typography>
            </TableCell>
          )
        }

        {/* 
          Headers 
        */}

        {/* idField*/}
        <TableCell
          key='idField'
          align='left'
          padding="checkbox"
          sortDirection={orderBy === 'idField' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'idField'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'idField') }}
          >
          <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
            <Grid item>
              <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography color="inherit" variant="caption" display='inline' noWrap={true}>
                idField              </Typography>
            </Grid>
          </Grid>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='stringField'
          align='left'
          padding="default"
          sortDirection={orderBy === 'stringField' ? order : false}
        >
          {/* stringField */}
          <TableSortLabel
              active={orderBy === 'stringField'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'stringField')}}
          >
            <Typography color="inherit" variant="caption">
              stringField
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='intField'
          align='right'
          padding="default"
          sortDirection={orderBy === 'intField' ? order : false}
        >
          {/* intField */}
          <TableSortLabel
              active={orderBy === 'intField'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'intField')}}
          >
            <Typography color="inherit" variant="caption">
              intField
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='floatField'
          align='right'
          padding="default"
          sortDirection={orderBy === 'floatField' ? order : false}
        >
          {/* floatField */}
          <TableSortLabel
              active={orderBy === 'floatField'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'floatField')}}
          >
            <Typography color="inherit" variant="caption">
              floatField
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='datetimeField'
          align='left'
          padding="default"
          sortDirection={orderBy === 'datetimeField' ? order : false}
        >
          {/* datetimeField */}
          <TableSortLabel
              active={orderBy === 'datetimeField'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'datetimeField')}}
          >
            <Typography color="inherit" variant="caption">
              datetimeField
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='booleanField'
          align='left'
          padding="default"
          sortDirection={orderBy === 'booleanField' ? order : false}
        >
          {/* booleanField */}
          <TableSortLabel
              active={orderBy === 'booleanField'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'booleanField')}}
          >
            <Typography color="inherit" variant="caption">
              booleanField
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='stringArrayField'
          align='left'
          padding="default"
          sortDirection={orderBy === 'stringArrayField' ? order : false}
        >
          {/* stringArrayField */}
          <TableSortLabel
              active={orderBy === 'stringArrayField'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'stringArrayField')}}
          >
            <Typography color="inherit" variant="caption">
              stringArrayField
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='intArrayField'
          align='left'
          padding="default"
          sortDirection={orderBy === 'intArrayField' ? order : false}
        >
          {/* intArrayField */}
          <TableSortLabel
              active={orderBy === 'intArrayField'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'intArrayField')}}
          >
            <Typography color="inherit" variant="caption">
              intArrayField
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='floatArrayField'
          align='left'
          padding="default"
          sortDirection={orderBy === 'floatArrayField' ? order : false}
        >
          {/* floatArrayField */}
          <TableSortLabel
              active={orderBy === 'floatArrayField'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'floatArrayField')}}
          >
            <Typography color="inherit" variant="caption">
              floatArrayField
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='datetimeArrayField'
          align='left'
          padding="default"
          sortDirection={orderBy === 'datetimeArrayField' ? order : false}
        >
          {/* datetimeArrayField */}
          <TableSortLabel
              active={orderBy === 'datetimeArrayField'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'datetimeArrayField')}}
          >
            <Typography color="inherit" variant="caption">
              datetimeArrayField
            </Typography>
          </TableSortLabel>
        </TableCell>

        <TableCell
          key='booleanArrayField'
          align='left'
          padding="default"
          sortDirection={orderBy === 'booleanArrayField' ? order : false}
        >
          {/* booleanArrayField */}
          <TableSortLabel
              active={orderBy === 'booleanArrayField'}
              direction={order}
              onClick={(event) => {onRequestSort(event, 'booleanArrayField')}}
          >
            <Typography color="inherit" variant="caption">
              booleanArrayField
            </Typography>
          </TableSortLabel>
        </TableCell>

      </TableRow>
    </TableHead>
  );
}
NoAssocEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};