import React from 'react';
import PropTypes from 'prop-types';


/*
  Material-UI components
*/
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';

function EnhancedTableHead(props) {
    /*
      Properties
    */
    const {
        headCells,
        numSelected,
        order,
        orderBy,
        rowCount,
        onSelectAllClick,
        onRequestSort
    } = props;

    /*
      Handlers
    */
    const handleRequestSort = property => event => {
        onRequestSort(event, property);
    };

    /*
      Render
    */
    return (
        <TableHead>
            <TableRow>
                {/* CHECKBOX */}
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={numSelected === rowCount}
                        onChange={onSelectAllClick}
                    />
                </TableCell>
                {/* EXPANDER ICON */}
                <TableCell padding="checkbox" />
                {/* ACTIONS */}
                <TableCell align='center'>
                    Actions
                </TableCell>
                {/* HEADERS */}
                {headCells.map(headCell => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding="default"
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={order}
                            onClick={handleRequestSort(headCell.id)}
                        >
                            {headCell.label}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}
/*
  Proptypes
*/
EnhancedTableHead.propTypes = {
    headCells: PropTypes.arrayOf(PropTypes.exact({
        id: PropTypes.number,
        name: PropTypes.string,
        label: PropTypes.string,   
    })).isRequired,
    numSelected: PropTypes.number.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    onRequestSort: PropTypes.func.isRequired,
};