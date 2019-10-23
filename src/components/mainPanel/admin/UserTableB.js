import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import api from '../../../requests/index'
import CompactListView from './CompactListView'

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
  Headers
*/
/*
  Component: Enhanced Table Head
*/
function EnhancedTableHead(props) {
  /*
    Properties
  */
  const { 
    classes, 
    onSelectAllClick, 
    order, 
    orderBy, 
    numSelected, 
    rowCount, 
    onRequestSort } = props;
    
  const headCells = [
    { id: 'id', numeric: true, disablePadding: false, label: 'ID' },
    { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
    { id: 'password', numeric: false, disablePadding: false, label: 'Password' },
  ];

  /*
    Handlers
  */
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };
  
  /*
    Render
  */
  return (
    <TableHead>
      <TableRow>
        {/*
          Checkbox 
        */}
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        
        {/*
          Expand
        */}
        <TableCell padding="checkbox">
          {/* Empty */}
        </TableCell>
        
        {/*
          Actions
        */}
        <TableCell align='center'>
          Actions
        </TableCell>
        
        {/*
          Headers 
        */}
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            style={{width: '500px'}}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={order}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
/*
  Component.Proptypes: Enhanced Table Head
*/
EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};


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
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
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
const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle">
          Users
        </Typography>
      )}

      {numSelected > 0 ? 
      (
        /*
          Actions on: multiple selection
        */
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <Delete />
          </IconButton>
        </Tooltip>
      ) : 
      (
        <div style={{ width: '100%' }}>
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
            {/*
              Actions on: no selection
              - Add
              - Import
              - Export
            */}
            <Box>
              <Tooltip title="Add new user">
                <IconButton color="primary" aria-label="add">
                  <Add />
                </IconButton>
              </Tooltip>
            </Box>
            <Box>
              <Tooltip title="Import from CSV">
                <IconButton color="primary" aria-label="import">
                  <Import />
                </IconButton>
              </Tooltip>
            </Box>

            <Box>
              <Tooltip title="Export to CSV">
                <IconButton color="primary" aria-label="export">
                  <Export />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </div>
      )}
    </Toolbar>
  );
};
/*
  Prop Types
*/
EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};




/**
 * DETAIL ROW
 */

/*
  Styles
*/
const useDetailRowStyles = makeStyles(theme => ({
  tabs: {
    maxWidth: '50vw',
  },
  textSecondary: {
    marginBottom: 12,
  },
  vtabsRoot: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    // height: 224,
  },
  vtabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  badgePadding: {
    padding: theme.spacing(0, 2),
  },
  associationsRootGrid: {
    flexGrow: 1,
  },
  associationTypeTab: {
    height: 56,   //2 lines
    maxHeight: 56
  },
  associationTab: {
    height: 56,   //2 lines
    maxHeight: 56
  },

}));
/*
  Component
*/
function DetailRow(props) {
  /*
    Styles
  */
  const classes = useDetailRowStyles();

  /*
    Properties
  */
  const {toOnes, toManys} = props;

  /*
    State
  */
  const [ready, setReady] = useState(false);
  const [tabsValue, setTabsValue] = React.useState(0);
  const [associationTypeSelected, setAssociationTypeSelected] = useState(0);

  /*
    Effect
  */
  useEffect(() => { 
    setReady(true);
    return function cleanup() { setReady(false) };
  }, []);
  
  /*
    Handlers
  */
  const handleChange = (event, newValue) => {
    /**
     * Debug
     */
    console.log("newValue: ", newValue);

    setTabsValue(newValue);
  };

  const handleAssociationTypeChange = (event, newValue) => {
    
    /**
     * Debug
     */
    console.log("onAssociationTypeChange: newValue: ", newValue);
    
    setAssociationTypeSelected(newValue);
  };

  /*
    Sub Components
  */

  /** 
   * ASSOCIATION TYPE TABS 
   */
  function AssociationTypeTabs(props) {
    /*
      Properties
    */
    const { 
      toOnesLength, 
      toManysLength, 
      associationTypeSelected, 
      classes,
      onChange,
    } = props;
    
    /*
      Render
    */
    return (
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={associationTypeSelected}
        className={classes.vtabs}
        onChange={onChange}
      >
        <Tab
          id='tab-to-one'
          key={0}
          value={0}
          className={classes.associationTypeTab}
          label={
            <Badge className={classes.badgePadding} color='secondary' badgeContent={toOnesLength}>
              To-One
            </Badge>
          }
        />
        <Tab
          id='tab-to-many'
          key={1}
          value={1}
          className={classes.associationTypeTab}
          label={
            <Badge className={classes.badgePadding} color={ (associationTypeSelected===1)?'secondary':'default'} badgeContent={toManysLength}>
              To-Many
            </Badge>
          }
        />
      </Tabs>
    )
  }

  /** 
   * ASSOCIATION TABS 
   */
  function AssociationTabs(props) {
    /*
      Properties
    */
    const { toOnes, toManys, associationTypeSelected, classes } = props;
    /*
      State
    */
    const [toOneSelected, setToOneSelected] = useState(0);
    const [toManySelected, setToManySelected] = useState(0);
    const [ready, setReady] = useState(false);

    /*
      Effect
    */
    useEffect(() => { 
        console.log("ready: ok");
      setReady(true);
      return function cleanup() { setReady(false) };
    }, []);

    /*
      Render
    */
    return (
      
        <div>
          {/* 
            Case 0: toOnes
              Nested Tabs 
          */}
          {(associationTypeSelected === 0) && (
            <Grow in={ready}>
              <Tabs
                className={classes.tabs}
                value={toOneSelected}
                // onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
              >
                {(toOnes.length > 0) ?
                  /*
                    Case: There are associations
                  */
                  (toOnes.map((item, index) => {
                    return (
                      <Tab 
                        label={item.relationNameCp} 
                        key={item.relationNameCp + index} 
                        value={index} 
                        className={classes.associationTypeTab}
                        // onClick={props.onClick} 
                      />
                  )})) :
                  /*
                    Case: There are no associations
                  */
                  (
                    <Tab 
                        label={"There are no to-one associations"} 
                        disabled={true}
                        disableRipple={true}
                        disableFocusRipple={true}
                        className={classes.associationTypeTab}
                    />
                  )
                }
              </Tabs>
            </Grow>
          )}

          {/* 
            Case 1: toManys
              Nested Tabs 
          */}
          {(associationTypeSelected === 1) && (
            <Grow in={ready}>
              <Tabs
                className={classes.tabs}
                value={toManySelected}
                // onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"

              >
                {(toManys.length > 0) ?
                  /*
                    Case: There are associations
                  */
                  (toManys.map((item, index) => {
                    return (
                      <Tab 
                        label={item.relationNameCp} 
                        key={item.relationNameCp + index} 
                        value={index}
                        className={classes.associationTypeTab}
                        // onClick={props.onClick} 
                      />
                  )})) :
                  /*
                    Case: There are no associations
                  */
                  (
                    <Tab 
                        label={"There are no to-many associations"} 
                        disabled={true}
                        disableRipple={true}
                        disableFocusRipple={true}
                        className={classes.associationTypeTab}
                    />
                  )
                }
              </Tabs>
            </Grow>
          )}
        </div>

    );
  }

  /**
   * TAB PANEL
   */
  function TabPanel(props) {
    /*
      Properties
    */
    const { children, value, index, ...other } = props;
  
    /*
      Render
    */
    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`scrollable-auto-tabpanel-${index}`}
        aria-labelledby={`scrollable-auto-tab-${index}`}
        {...other}
      >
        <Box p={3} >{children} </Box>
      </Typography>
    );
  }
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `scrollable-auto-tab-${index}`,
      'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
  }

  /*
    Render
  */
  return (
    /*
      Card
    */
     <Collapse in={ready}>
      <Card>
        {/*
          Card.Content
        */}
        <CardContent>
          <Typography variant="h5" component="h2">
            Id
          </Typography>
          <Typography className={classes.textSecondary} color="textSecondary">
            {props.item.id}
          </Typography>

          <Typography variant="h5" component="h2">
            Email
          </Typography>
          <Typography className={classes.textSecondary} color="textSecondary">
            {props.item.email}
          </Typography>

          <Typography variant="h5" component="h2">
            Password
          </Typography>
          <Typography className={classes.textSecondary} color="textSecondary">
            {props.item.password}
          </Typography>
          
        </CardContent>

        {/* <CardActions>
          <Button color="primary" size="small">SEE ASSOCIATIONS</Button>
        </CardActions> */}

        {/*
          Associations
        */}
        <CardContent>
          <Grid container className={classes.associationsRootGrid}>
            {/*
              Title
            */}
            <Grid item xs={12}>
              <Grid container justify="flex-start">
                <Grid item>
                  <Typography variant="h6" color="primary">
                    Associations
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            {/* 
              Association types tabs  |   Association tabs
              ------------------------|----------------------------
                To Manys              |   ToManys.1  ToManys.2  ...  
                To Ones               |   ToOnes.1   ToOnes.2   ...
            */}
            <Grid item xs={12}>
              <Grid 
                container justify="flex-start" 
                alignItems={(associationTypeSelected === 0) ? "flex-start" : "flex-end"}
                spacing={1}
              >
                
                <Grid item>
                  <AssociationTypeTabs
                    toOnesLength={toOnes.length}
                    toManysLength={toManys.length}
                    associationTypeSelected={associationTypeSelected}
                    classes={classes}
                    onChange={handleAssociationTypeChange}
                  />
                </Grid>
            
                <Grid item >
                  <AssociationTabs
                    toOnes={toOnes}
                    toManys={toManys}
                    associationTypeSelected={associationTypeSelected}
                    classes={classes}
                  />
                </Grid>
              </Grid>
            </Grid>
            
            {/*
              Compact List View

              const {
        title,
        modelName,
        modelItemId,
        associationName,
        associationLabel,
        associationSublabel,
    } = props;


            */}
            <Grid item xs={12}>
              <Grid container justify="flex-start">
                <Grid item>
                  <CompactListView 
                    title="title"
                  />
                </Grid>
              </Grid>
            </Grid>

          </Grid>
        </CardContent>
      </Card>
    </Collapse>
  )//end: return
}//end: function RoleDetailRow2()


/**
 * Table
 */

/*
  Styles
*/
const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    width: '100%',
    //maxWidth: '800px',
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
function EnhancedTable() {
  /*
    Styles
  */
  const classes = useStyles();
  /*
    Properties
  */
 const toManys = [
  { 
    "relationName":"roles",
    "relationNameCp":"Roles",
    "targetModelPlLc":"roles",
    "targetModelCp":"Role",
    "targetModelPlCp":"Roles",
    "label":"name",
    "sublabel":"id"
  },
 ];
 const toOnes = [];

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
    /**
     * Debug
     */
    console.log("toManys: ", toManys);

    getData() 
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
            <EnhancedTableToolbar numSelected={selected.length} />
            
            {/*
              Table
            */}
            <div className={classes.tableWrapper}>
              <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                size={dense ? 'small' : 'medium'}
                aria-label="enhanced table"
              >
                {/*
                  Table Head
                */}
                <EnhancedTableHead
                  classes={classes}
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={count}
                />

                {/*
                  Table Body
                */}
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

export default EnhancedTable