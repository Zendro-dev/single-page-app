import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import api from '../../../requests/index'

/*
  Material-UI components
*/
/*
  Table
*/
import { lighten, makeStyles } from '@material-ui/core/styles';
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
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList } from 'react-window';


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

/**
 * TOOLBAR
 */
/*
  Styles
*/
const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(0),
  },
  title: {
    flex: '1 1 100%',
  },
  actionsBox: {
    display: "flex", 
    flexDirection: "row",
    p: 0,
    m: 0, 
    alignItems: "center",
    justifyContent: "flex-end",
  }
}));
/*
  Component
*/
const ListToolbar = props => {
  /*
    Properties
  */
  const classes = useToolbarStyles();
  const { title } = props;

  /*
    Render
  */
  return (
    <Toolbar className={classes.root}>

        <Typography id="listTitle" className={classes.title} variant="h6">
            {title}    
        </Typography>

        <Box className={classes.actionsBox}>
            {/*
            Search field 
            */}
            <Box>
            <TextField
                id="search-field"
                className={classes.textField}
                placeholder="Search"
                InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                    <Tooltip title="Search">
                        <Search color="inherit" fontSize="small" />
                    </Tooltip>
                    </InputAdornment>
                ),
                endAdornment: (
                    <InputAdornment position="end">
                    <Tooltip title="Clear search">
                        <IconButton
                        //disabled={!this.props.searchText}
                        //onClick={() => this.props.onSearchChanged("")}
                        >
                        <Clear color="inherit" fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    </InputAdornment>
                ),
                }}
            />
            </Box>
        </Box>
    </Toolbar>
  );
};
/*
  Prop Types
*/
ListToolbar.propTypes = {
  title: PropTypes.string.isRequired,
};

/**
 * Row
 */
function Row(props) {
    const { index, style } = props;

    return (
        <ListItem button style={style} key={index}>
            <ListItemText primary={`Item ${index + 1}`} />
        </ListItem>
    );
}

Row.propTypes = {
    index: PropTypes.number.isRequired,
    style: PropTypes.object.isRequired,
};

/**
 * List
 */
/*
  Styles
*/
const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
        width: '100%',
        marginTop: theme.spacing(7),
    },
    list: {
        width: '100%',
        height: 400,
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    paper: {
        marginBottom: theme.spacing(2),
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
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
function CompactListView(props) {
    /*
      Styles
    */
    const classes = useStyles();
    /*
      Properties
    */
    const {
        title,
        modelName,
        modelItemId,
        associationName,
        associationLabel,
        associationSublabel,
    } = props;

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
        Effect
    */
    //useEffect((), []) <=> componentDidUpdate()
    useEffect(() => {
        //getData() 
    }, []);

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
        console.log("@@url: ", search);
        console.log("@@search: ", search);
        
        /*
        Get count
        */
        api.user.getCount(graphqlServerUrl, search)
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
            api.user.getItems(
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
    const handleNewData = (newCount, newItems) => {
        setCount(newCount);
        setItems(newItems);
    }

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

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, items.length - page * rowsPerPage);

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
                    {/*
                        Toolbar
                    */}
                    <ListToolbar title={title} />
                    
                    {/*
                        List
                    */}
                    <div className={classes.list}>
                        <FixedSizeList height={200} width={360} itemSize={46} itemCount={200}>
                            {Row}
                        </FixedSizeList>
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
            </Grid>
        </Grid>
        </div>
    );
}

export default CompactListView