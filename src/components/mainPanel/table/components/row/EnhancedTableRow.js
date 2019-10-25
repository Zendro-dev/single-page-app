import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import CompactListView from '../../../../compactListView/CompactListView'
import AssociationsTabs from './components/AssociationsTabs'
import AssociationsTypesTabs from './components/AssociationTypesTabs'

/*
  Material-UI components
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
export default function DetailRow(props) {
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
                  <AssociationsTypesTabs
                    toOnesLength={toOnes.length}
                    toManysLength={toManys.length}
                    associationTypeSelected={associationTypeSelected}
                    classes={classes}
                    onChange={handleAssociationTypeChange}
                  />
                </Grid>
            
                <Grid item >
                  <AssociationsTabs
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
