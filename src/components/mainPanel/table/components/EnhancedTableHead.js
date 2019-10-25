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

export default function EnhancedTableHead(props) {
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
      Render
    */
    return (
        <TableHead>
            <TableRow>

                {/* Checkbox */}
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={numSelected === rowCount}
                        onChange={onSelectAllClick}
                    />
                </TableCell>

                {/* Expanded icon */}
                <TableCell padding="checkbox" />

                {/* Actions */}
                <TableCell padding="checkbox" align='center' size='small' colSpan={2}>
                    Actions
                </TableCell>

                {/* Headers */}
                {headCells.map(headCell => (
                    <TableCell
                        key={headCell.key}
                        align={
                            (headCell.type === 'Int' || headCell.type === 'Float') ? 
                            'right' : 'left'
                        }
                        padding="default"
                        sortDirection={orderBy === headCell.name ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.name}
                            direction={order}
                            onClick={(event) => {onRequestSort(event, headCell.name)}}
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
        key: PropTypes.number,
        name: PropTypes.string,
        label: PropTypes.string,
        type: PropTypes.string,
    })).isRequired,
    numSelected: PropTypes.number.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    onRequestSort: PropTypes.func.isRequired,
};