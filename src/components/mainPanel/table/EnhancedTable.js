import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import api from '../../../requests/index'
import EnhancedTableHead from './components/EnhancedTableHead'
import EnhancedTableToolbar from './components/EnhancedTableToolbar'
import CompactListView from './CompactListView'

/*
  Material-UI components
*/
/*
  Table
*/
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Collapse from '@material-ui/core/Collapse';
import Fade from '@material-ui/core/Fade';
import Zoom from '@material-ui/core/Zoom';
import Grow from '@material-ui/core/Grow';
import Slide from '@material-ui/core/Slide';
import Badge from '@material-ui/core/Badge';

/*
  Icons
*/
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import Add from '@material-ui/icons/AddBox';
import Import from '@material-ui/icons/UnarchiveOutlined';
import Export from '@material-ui/icons/SaveAlt';
import Clear from '@material-ui/icons/Clear';
import Delete from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import Search from '@material-ui/icons/Search';
import ArrowRight from '@material-ui/icons/KeyboardArrowRight';

/*
  Styles
*/
const useStyles = makeStyles(theme => ({

    /*
      Head style
    */

    root: {
        marginTop: theme.spacing(7),
    },
    paper: {
        marginBottom: theme.spacing(2),
    },
    table: {
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    actionsBox: {
        display: "flex",
        flexDirection: "row",
        p: 0,
        m: 0,
        alignItems: "center",
        justifyContent: "center",
    }
}));
/*
  Component
*/
export default function EnhancedTable(props){
    /*
      Styles
    */
    const classes = useStyles();
    /*
      Properties
    */
    const { model } = props;
    /*
      State
    */
    const [items, setItems] = useState([]);
    const [count, setCount] = useState(0);
    const [search, setSearch] = useState('');
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('id');
    const [selected, setSelected] = useState([]);
    const [expanded, setExpanded] = useState([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    /*
      Store selectors
    */
    const graphqlServerUrl = useSelector(state => state.urls.graphqlServerUrl)
    /*
      Flags
    */
    //managed by: getData()
    var isOnApiRequest = false;
    /*
      Effects
    */
    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        console.log("new search: ", search);
        if(!isOnApiRequest) {
            //getData();
        }
    }, [search]);

    useEffect(() => {
        console.log("new order: ", order);
        if(!isOnApiRequest) {
            //getData();
        }
    }, [order]);

    useEffect(() => {
        console.log("new orderBy: ", orderBy);
        if(!isOnApiRequest) {
            //getData();
        }
    }, [orderBy]);

    useEffect(() => {
        console.log("new page: ", page);
        if(!isOnApiRequest) {
            //getData();
        }
    }, [page]);

    useEffect(() => {
        console.log("new rowsPerPage: ", rowsPerPage);
        if(!isOnApiRequest) {
            //getData();
        }
    }, [rowsPerPage]);

    /*
      Methods
    */

    /**
     * getData
     * 
     * Get @items and @count from GrahpQL Server.
     * Uses current state properties to fill query request.
     * Updates state to inform new @items and @count retreived.
     * 
     */
    function getData() {
        /**
         * Debug
         */
        console.log("@@getData() with: ");
        console.log("@@url: ", graphqlServerUrl);
        console.log("@@search: ", search);
        console.log("@@onApiRequest: ", search);

        /*
          Save current context
        */
        var c_search = search;
        var c_order = order;
        var c_orderBy = orderBy;
        var c_page = page;
        var c_rowsPerPage = rowsPerPage;

        /*
          API Request: count
        */
        api[model.model].getCountItems(model, graphqlServerUrl, search)
            .then(response => {
                //Check response
                if (
                    response.data &&
                    response.data.data
                ) {
                    /**
                     * Debug
                     */
                    console.log("newCount: ", response.data.data.countUsers);

                    //handle new count
                    var newCount = response.data.data.countUsers;
                    //handleNewCount(newCount);

                    //check empty page
                    // var p = query.page;
                    // if ((t.currentTotalItems === (query.page * query.pageSize)) && (query.page > 0)) {
                    //   p = query.page - 1;
                    // }

                    /*
                      Get items
                    */
                    api[model.model].getItems(
                        model,
                        graphqlServerUrl,
                        search,
                        orderBy,
                        order,
                        page * rowsPerPage, //paginationOffset
                        rowsPerPage, //paginationLimit
                    )
                        .then(response => {
                            //check response
                            if (
                                response.data &&
                                response.data.data &&
                                response.data.data.users) {
                                /**
                                 * Debug
                                 */
                                //console.log("items: ", response.data.data.users);

                                //check empty page
                                // var p = query.page;
                                // if ((t.currentTotalItems === (query.page * query.pageSize)) && (query.page > 0)) {
                                //   p = query.page - 1;
                                // }

                                // resolve({
                                //   data: response.data.data.users,
                                //   page: p,
                                //   totalCount: t.currentTotalItems
                                // });

                                /**
                                 * Debug
                                 */
                                console.log("@@newCount: ", newCount);
                                console.log("@@newItems: ", response.data.data.users);

                                handleNewData(newCount, response.data.data.users);

                                //done
                                return;

                            } else {

                                //error
                                console.log("error1");

                                //done
                                return;
                            }
                        })
                        .catch(err => {

                            //error
                            console.log("error2");

                            //done
                            return;
                        });

                    //done
                    return;

                } else {

                    //error
                    console.log("error3")

                    //done
                    return;
                }
            })
            .catch(err => {

                //error
                console.log("error4: ", err)

                //done
                return;
            });
    }

    /*
      Handlers
    */

    /**
     * On search text changed handler.
     * 
     * @param {string} value New search text value.
     */
    const onSearchChanged = search => {
        setSearch(search);
    }


    const handleNewData = (newCount, newItems) => {
        setCount(newCount);
        setItems(newItems);
    }

    const handleRequestSort = (event, property) => {
        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
    };

    const handleSelectAllClick = event => {
        if (event.target.checked) {
            const newSelecteds = items.map(item => item.id);
            setSelected(newSelecteds);
            return;
        }
        else {
            setSelected([]);
        }
    };

    const handleClickOnRow = (event, item) => {

        console.log("clicked itemId: ", item.id);

        // const selectedIndex = selected.indexOf(name);
        // let newSelected = [];

        // if (selectedIndex === -1) {
        //   newSelected = newSelected.concat(selected, name);
        // } else if (selectedIndex === 0) {
        //   newSelected = newSelected.concat(selected.slice(1));
        // } else if (selectedIndex === selected.length - 1) {
        //   newSelected = newSelected.concat(selected.slice(0, -1));
        // } else if (selectedIndex > 0) {
        //   newSelected = newSelected.concat(
        //     selected.slice(0, selectedIndex),
        //     selected.slice(selectedIndex + 1),
        //   );
        // }

        // setSelected(newSelected);
    };

    const handleRowChecked = (event, item) => {

        const selectedIndex = selected.indexOf(item.id);
        let newSelected = [];

        if (selectedIndex === -1) {
            //select
            newSelected = newSelected.concat(selected, item.id);
        } else if (selectedIndex === 0) {
            //unselect unique item
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            //unselect last item
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            //unselect item in the middle
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        //update state
        setSelected(newSelected);
    }

    const handleRowExpanded = (event, item) => {

        const expandedIndex = expanded.indexOf(item.id);
        let newExpanded = [];

        if (expandedIndex === -1) {
            //select
            newExpanded = newExpanded.concat(expanded, item.id);
        } else if (expandedIndex === 0) {
            //unselect unique item
            newExpanded = newExpanded.concat(expanded.slice(1));
        } else if (expandedIndex === expanded.length - 1) {
            //unselect last item
            newExpanded = newExpanded.concat(expanded.slice(0, -1));
        } else if (expandedIndex > 0) {
            //unselect item in the middle
            newExpanded = newExpanded.concat(
                expanded.slice(0, expandedIndex),
                expanded.slice(expandedIndex + 1),
            );
        }
        //update state
        setExpanded(newExpanded);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = event => {
        setDense(event.target.checked);
    };

    const isSelected = itemId => selected.indexOf(itemId) !== -1;

    const isExpanded = itemId => expanded.indexOf(itemId) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, items.length - page * rowsPerPage);

    /*
      Render
    */
    return (
        <div>
            <Grid
                className={classes.root}
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
            >
                <Grid item xs={9} md={11} lg={12}>
                    <Paper className={classes.paper}>
                        {/* Toolbar */}
                        <EnhancedTableToolbar numSelected={selected.length} />

                        {/* Table */}
                        <div className={classes.tableWrapper}>
                            <Table
                                className={classes.table}
                                aria-labelledby="tableTitle"
                                size={dense ? 'small' : 'medium'}
                                aria-label="enhanced table"
                            >
                                {/* Table Head */}
                                <EnhancedTableHead
                                    classes={classes}
                                    numSelected={selected.length}
                                    order={order}
                                    orderBy={orderBy}
                                    onSelectAllClick={handleSelectAllClick}
                                    onRequestSort={handleRequestSort}
                                    rowCount={count}
                                />

                                {/* Table Body */}
                                <TableBody>
                                    {
                                        items.map((item, index) => {
                                            const isItemSelected = isSelected(item.id);
                                            const isItemExpanded = isExpanded(item.id);
                                            const labelId = `enhanced-table-checkbox-${index}`;

                                            return ([
                                                /*
                                                  Item Row
                                                */
                                                <TableRow
                                                    hover
                                                    onClick={event => handleClickOnRow(event, item)}
                                                    role="checkbox"
                                                    aria-checked={isItemSelected}
                                                    tabIndex={-1}
                                                    key={item.id}
                                                    selected={isItemSelected}
                                                >
                                                    {/*
                            Checkbox 
                          */}
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={isItemSelected}
                                                            inputProps={{ 'aria-labelledby': labelId }}
                                                            onChange={event => handleRowChecked(event, item)}
                                                        />
                                                    </TableCell>
                                                    {/*
                            Expand
                          */}
                                                    <TableCell padding="checkbox">
                                                        <Tooltip title="">
                                                            <IconButton
                                                                color="primary"
                                                                aria-label="expand-row"
                                                                style={{
                                                                    transition: 'all ease 200ms',
                                                                    transform: isItemExpanded ? 'rotate(90deg)' : 'none'
                                                                }}
                                                                onClick={event => handleRowExpanded(event, item)}
                                                            >
                                                                <ArrowRight />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                    {/*
                            Actions:
                            - Edit
                            - Delete
                          */}
                                                    <TableCell>
                                                        <div style={{ width: '100%' }}>
                                                            <Box className={classes.actionsBox}>
                                                                <Box>
                                                                    <Tooltip title="Edit">
                                                                        <IconButton color="primary" aria-label="add">
                                                                            <Edit fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </Box>
                                                                <Box>
                                                                    <Tooltip title="Delete">
                                                                        <IconButton color="primary" aria-label="import">
                                                                            <Delete fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </Box>
                                                            </Box>
                                                        </div>
                                                    </TableCell>
                                                    {/*
                            Item fields
                          */}
                                                    <TableCell style={{ width: '500px' }} align="right">{item.id}</TableCell>
                                                    <TableCell style={{ width: '500px' }} align="left">{item.email}</TableCell>
                                                    <TableCell style={{ width: '500px' }} align="left">{item.password}</TableCell>

                                                </TableRow>,
                                                /*
                                                  Detail Row
                                                */
                                                (isItemExpanded) && (
                                                    <TableRow key={"detail-row-" + item.id}>
                                                        <TableCell colSpan={6} padding="none">
                                                            <DetailRow
                                                                item={item}
                                                                toOnes={toOnes}
                                                                toManys={toManys}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            ]);
                                        })
                                    }
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        {/*
              Pagination
            */}
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={items.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            backIconButtonProps={{
                                'aria-label': 'previous page',
                            }}
                            nextIconButtonProps={{
                                'aria-label': 'next page',
                            }}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </Paper>
                    <FormControlLabel
                        control={<Switch checked={dense} onChange={handleChangeDense} />}
                        label="Dense padding"
                    />
                </Grid>
            </Grid>
        </div>
    );
}

/*
  PropTypes
*/
EnhancedTable.propTypes = {
    model: PropTypes.PropTypes.exact({
        model: PropTypes.string,
        storageType: PropTypes.string,
        attributes: PropTypes.object,
        associations: PropTypes.object,
        names: PropTypes.object,
        toManys: PropTypes.array,
        toOnes: PropTypes.array,
    }).isRequired,
};