import React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';

export default function UserEnhancedTableHead(props) {
  const {
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
        <TableCell padding="checkbox" align='center' size='small' colSpan={2}>
          <Typography color="inherit" variant="overline">
            Actions
          </Typography>
        </TableCell>

        {/* 
          Headers 
        */}

        {/* Id */}
        <TableCell
          key='id'
          align='left'
          padding="default"
          sortDirection={orderBy === 'id' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'id'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'id') }}
          >
            <Typography color="inherit" variant="overline">
              Id
            </Typography>
          </TableSortLabel>
        </TableCell>

        {/* Email */}
        <TableCell
          key='email'
          align='right'
          padding="default"
          sortDirection={orderBy === 'email' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'email'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'email') }}
          >
            <Typography color="inherit" variant="overline">
              Email
            </Typography>
          </TableSortLabel>
        </TableCell>

        {/* Password */}
        <TableCell
          key='password'
          align='right'
          padding="default"
          sortDirection={orderBy === 'password' ? order : false}
        >
          <TableSortLabel
            active={orderBy === 'password'}
            direction={order}
            onClick={(event) => { onRequestSort(event, 'password') }}
          >
            <Typography color="inherit" variant="overline">
              Password
            </Typography>
          </TableSortLabel>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}
UserEnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};