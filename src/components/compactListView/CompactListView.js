import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import api from '../../requests/index';
import { FixedSizeList } from 'react-window';
import { VariableSizeList as List } from 'react-window';
import CompactListViewToolbar from './components/CompactListViewToolbar';


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
import Zoom from '@material-ui/core/Zoom';
import Grow from '@material-ui/core/Grow';
import Slide from '@material-ui/core/Slide';
import Badge from '@material-ui/core/Badge';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';



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
  root: {
    marginTop: theme.spacing(0),
  },
  card: {
    margin: theme.spacing(1),
    overflowX: 'auto',
  },
}));

export default function CompactListView(props) {
  /*
    Styles
  */
  const classes = useStyles();
  /*
    Properties
  */
  const {
    title,
    modelNames,
    itemId,
    associationNames,
  } = props;
  const minListHeight = 200;
  const maxListHeight = 450;
  var itemHeights = [];

  /*
    State
  */
  const [totalItemsHeight, setTotalItemsHeight] = useState(minListHeight);
  const [listHeight, setListHeight] = useState(minListHeight);

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
  const [isOnApiRequest, setIsOnApiRequest] = useState(true);
  const [isPendingApiRequest, setIsPendingApiRequest] = useState(false);
  const [isGettingFirstData, setIsGettingFirstData] = useState(true); //to avoid repeat initial fetch
  const [searchTimeoutId, setSearchTimeoutId] = useState(0);
  const [isSearchTimeoutOn, setIsSearchTimeoutOn] = useState(false);
  const [dataReady, setDataReady] = useState(false);

  /*
      Store selectors
  */
  const graphqlServerUrl = useSelector(state => state.urls.graphqlServerUrl)

  /*
    Effects
  */
  useEffect(() => {
    console.log("hook:[]: ", associationNames);
    
    if(associationNames !== undefined){
      getData();
    }
  }, []);

  useEffect(() => {

    console.log("on: useEffect[ITEMS]!!!!!: ", items);

  }, [items]);

   useEffect(() => {

    //new itemsHeight
    if(count === 0) {
      itemHeights = [];
    } else {
      itemHeights = new Array(count).fill(50);
    }

    console.log("on: useEffect[COUNT]!!!!!: itemHeights: ", itemHeights);

  }, [count]);


  /*
      Methods
  */
  const getItemSize = index => {
    
    if(itemHeights.length > 0) {
      return itemHeights[index];
    }
    else {
      return 50;
    }
  }

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
      console.log("@@onApiRequest: ", isOnApiRequest);

      //set state flag
      setIsOnApiRequest(true);

      //reset
      if(isGettingFirstData) {
        setIsGettingFirstData(false);
      }

      /*
        Get data
      */
      api[modelNames.name].getAssociationFilter(
        graphqlServerUrl, 
        modelNames, 
        itemId, 
        associationNames,
        search,
        page * rowsPerPage, //paginationOffset
        rowsPerPage, //paginationLimit
      )
          .then(response => {
              //Check response
              if (
                  response.data &&
                  response.data.data
              ) {
                  /**
                   * Debug
                   */
                  console.log("newData: ", response.data.data);

                  //update state
                  setIsOnApiRequest(false);
                  setCount(response.data.data[`readOne${modelNames.nameCp}`][`countFiltered${associationNames.targetModelPlCp}`]);
                  setItems(response.data.data[`readOne${modelNames.nameCp}`][`${associationNames.targetModelPlLc}Filter`]);

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
     * On search text enter handler.
     * 
     * @param {String} value New search text value.
     */
    const handleSearchEnter = text => {
      console.log("on HSC: text: ", text);
      
      setSearch(text);
    }

  const handleNewData = (newCount, newItems) => {
      setCount(newCount);
      setItems(newItems);
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

  const handleItemsRendered = () => {
    console.log("on: handleItemsRendered!!!!!");
  }

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, items.length - page * rowsPerPage);

  /**
   * SubComponent: Row
   */
  const Row = ({ index, style }) => {
    const item = items[index];
    const itemKeys = Object.keys(items[index]);
    const itemRef = useRef(null);

    useEffect(() => {
      //set new item height
      itemHeights[index] = itemRef.current.clientHeight;
    }, []);

    return (
      <CardContent ref={itemRef} >
        
        <Typography variant="caption" display="inline"><b>id:</b> </Typography>
        <Typography variant="caption" display="inline">{item.id}<b> | </b> </Typography>

        <Typography variant="caption" display="inline"><b>{itemKeys[1]}:</b> </Typography>
        <Typography variant="caption" display="inline">{item[itemKeys[1]]}<b> | </b> </Typography>

        <Typography variant="caption" display="inline"><b>{itemKeys[2]}:</b> </Typography>
        <Typography variant="caption" display="inline">{item[itemKeys[2]]}<b></b> </Typography>
{/* 
        <Typography variant="caption" display="inline">id: </Typography>
        <Typography variant="caption" display="inline">{item.id}</Typography>
        

        <Typography color="textSecondary">
          {item[head.name]}
        </Typography> */}

      </CardContent>
    )
  };
  Row.propTypes = {
      index: PropTypes.number.isRequired,
      style: PropTypes.object.isRequired,
  };


  return (
    <div className={classes.root}>
      <Grid container justify='center'>
        <Grid item xs={12}>
          <Card className={classes.card}>

            {/* Toolbar */}
            <CompactListViewToolbar 
              title={title}
              search={search}
              onSearchEnter={handleSearchEnter}
            />

            {/* Case: no data */}
            {(!isOnApiRequest && count === 0) && (

              /* Progress */
              <Fade
                in={true}
                unmountOnExit
              >
                <div style={{ width: "100%", height: 200 }}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Grid container justify="center" alignItems="center">
                        <Grid item>
                          <Typography variant="body1" > No data to display </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </div>
              </Fade>

            )}

            {/* Case: data ready */}
            {(!isOnApiRequest && items.length > 0 && count > 0) && (
            
              /* List */
              <List
                height={listHeight}
                width="100%"
                itemCount={count}
                itemSize={getItemSize}
                onItemsRendered={handleItemsRendered}
              >
                {Row}
              </List>

            )}

            {/* Case: loading */}
            {(isOnApiRequest) && (
              /* Progress */
              <Fade
                in={true}
                unmountOnExit
              >
                <div style={{ width: "100%", height: 200 }}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Grid container justify="center">
                        <Grid item>
                          <CircularProgress color='primary' disableShrink/>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </div>
              </Fade>

            )}

            {/* Pagination */}
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

          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

/*
  PropTypes
*/
CompactListView.propTypes = {
    title: PropTypes.string,
    modelNames: PropTypes.object,
    itemId: PropTypes.number,
    associationNams: PropTypes.object,
};