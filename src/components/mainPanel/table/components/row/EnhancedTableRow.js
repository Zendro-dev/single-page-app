import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import CompactListView from '../../../../compactListView/CompactListView'
import AssociationsTabs from './components/AssociationsTabs'
import AssociationsTypesTabs from './components/AssociationTypesTabs'
import DetailView from '../../../../detailView/DetailView'

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
export default function EnhancedTableRow(props) {
  /*
    Styles
  */
  const classes = useDetailRowStyles();

  /*
    Properties
  */
  const { item, headCells, toOnes, toManys } = props;

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

    <Collapse in={ready}>
      
      <Card>
        
      {/* DetailView */}
      <DetailView item={item} headCells={headCells} />
   

      

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
