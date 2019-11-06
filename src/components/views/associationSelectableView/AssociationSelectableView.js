import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import api from '../../requests/index';
import { VariableSizeList as List } from 'react-window';
import AssociationSelectableViewToolbar from './components/AssociationSelectableViewToolbar';


/*
  Material-UI components
*/
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';


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
  noDataBox: {
    width: "100%",
    height:200,
  },
  loadingBox: {
    width: "100%",
    height:200,
  },
  line: {
    display: "inline",
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
    associationNames,
    transferStates,
    handleTransfer,
  } = props;
  const minListHeight = 200;
  const maxListHeight = 450;
  const defaultRowHeight = 50;

  /*
    State
  */
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState('');
  const [selectStates, setSelectStates] = useState([]);
  // const [selected, setSelected] = useState([]);
  // const [expanded, setExpanded] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isOnApiRequest, setIsOnApiRequest] = useState(true);
  const [isPendingApiRequest, setIsPendingApiRequest] = useState(false);
  const [isGettingFirstData, setIsGettingFirstData] = useState(true); //to avoid repeat initial fetch
  const [isCountReady, setIsCountReady] = useState(false);
  const [areItemsReady, setAreItemsReady] = useState(false);
  //state: virtual vist
  const [totalItemsHeight, setTotalItemsHeight] = useState(minListHeight);
  const [listHeight, setListHeight] = useState(minListHeight);
  const [areRowsReady, setAreRowsReady] = useState(false);

  /*
    Refs
  */
  const itemHeights = useRef([]);


  /*
      Store selectors
  */
  const graphqlServerUrl = useSelector(state => state.urls.graphqlServerUrl)

  /*
    Effects
  */
  useEffect(() => {
    /**
     * Debug
     */
    console.log("hook:[]: ", associationNames);
    
    //get data
    if(associationNames !== undefined){ getData(); }
  }, []);

  useEffect(() => {
    /**
     * Debug
     */
    console.log("on: useEffect[ITEMS]!!!!!: ", items);

    //update state
    if(items.length > 0) { setAreItemsReady(true); } else { setAreItemsReady(false); }

  }, [items]);

   useEffect(() => {

    console.log("on: useEffect[COUNT]!!!!!: ", count);

    //new itemsHeight
    if(count === 0) {
      //reset
      itemHeights.current = [];
      //update state
      setIsCountReady(false);

    } else {
      //init
      itemHeights.current = new Array(count).fill(defaultRowHeight);
      //update state
      setIsCountReady(true);
    }

  }, [count]);

  useEffect(() => {
    console.log("new search: ", search, " isGettingFirstData: ", isGettingFirstData);
    //return on init
    if(isGettingFirstData) return;

    //get data
    if (!isOnApiRequest) { getData(); } else { setIsPendingApiRequest(true); }
  }, [search]);

  useEffect(() => {
    console.log("new areItemsReady: ", areItemsReady,  "  ihs: ", itemHeights.current);

  }, [areItemsReady]);

  useEffect(() => {
    console.log("new isCountReady: ", isCountReady);
    
  }, [isCountReady]);

  useEffect(() => {
    console.log("new areRowsReady: ", areRowsReady, "  ihs: ", itemHeights.current);

    if(areRowsReady) {
      //get new total items height
      var t = 0;
      for (var i=0; i < itemHeights.current.length; ++i) 
      {
        t += itemHeights.current[i];
        console.log("[",i,"]: ", itemHeights.current[i]);
      }

      /**
       * Debug
       */
      console.log("curTH: ", totalItemsHeight, " newTH: ", t);
      console.log("curIH: ", itemHeights.current);
      console.log("curLH: ", listHeight, " newLH: ", Math.min(Math.max(minListHeight, t), maxListHeight));

      //update totalItemsHeight
      setTotalItemsHeight(t);
      //update listHeight
      setListHeight(Math.min(Math.max(minListHeight, t), maxListHeight));
    }
  }, [areRowsReady]);

  useEffect(() => {
    console.log("new totalItemsHeight: ", totalItemsHeight);
    
  }, [totalItemsHeight]);

  useEffect(() => {
    console.log("new listHeight: ", listHeight);
    
  }, [listHeight]);

  useEffect(() => {
    console.log("new isOnApiRequest: ", isOnApiRequest);
    console.log("isPendingApiRequest: ", isPendingApiRequest);
    
    if (!isOnApiRequest && isPendingApiRequest) {
      //reset
      setIsPendingApiRequest(false);

      //get data  
      getData();
    }
  }, [isOnApiRequest]);



  /*
      Methods
  */
  const getItemSize = index => {

    console.log("on getItemSize: index: ", index, "l: ", itemHeights.current.length, " size: ", itemHeights.current[index]);
    
    if(itemHeights.current.length > 0) {
      return itemHeights.current[index];
    }
    else {
      return defaultRowHeight;
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

      //update state
      setIsOnApiRequest(true);
      setCount(0);
      setItems([]);
      setAreRowsReady(false);

      //reset
      if(isGettingFirstData) {
        setIsGettingFirstData(false);
      }

      /*
        Get data
      */
      api[associationNames.relationName].get(
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
                  setCount(response.data.data[`readOne${modelNames.nameCp}`][`countFiltered${associationNames.targetModelPlCp}`]);
                  setItems(response.data.data[`readOne${modelNames.nameCp}`][`${associationNames.targetModelPlLc}Filter`]);
                  setIsOnApiRequest(false);

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

  const handleItemsRendered = () => {
    console.log("on: handleItemsRendered!!!!!, areItemsReady: ", areItemsReady, "  isCountReady: ", isCountReady, " ihs: ", itemHeights.current);
  }

  /**
   * SubComponent: Row
   */
  const Row = ({ index, style }) => {
    const item = items[index];
    const itemKeys = Object.keys(items[index]);
    const itemRef = useRef(null);

    useEffect(() => {

      console.log("onRow: keys: ", itemKeys, " item: ", item);
      console.log("onRow: count: ", count, " index: ", index, "  cur_ihs: ", itemHeights.current);

      //set new item height
      itemHeights.current[index] = itemRef.current.clientHeight;

      console.log("onRow: new_ihs: ", itemHeights.current);

      //update state
      if(index < (count-1)) {
        setAreRowsReady(false);
      } else {
        setAreRowsReady(true);
      }

    }, []);

    return (
      <CardContent ref={itemRef} >
        
        {/* id */}
        <Typography variant="caption" display="inline"><b>id:</b> </Typography>
        <Typography variant="caption" display="inline">{item.id}</Typography>

        {/* label */}
        {(itemKeys.length > 1 && item[itemKeys[1]] !== null) && (
          <div className={classes.line}>
            <Typography variant="caption" display="inline"><b> | {itemKeys[1]}:</b> </Typography>
            <Typography variant="caption" display="inline">{item[itemKeys[1]]}</Typography>
          </div>
        )}

         {/* sublabel */}
         {(itemKeys.length > 2 && item[itemKeys[2]] !== null) && (
          <div className={classes.line}>
            <Typography variant="caption" display="inline"><b> | {itemKeys[2]}:</b> </Typography>
            <Typography variant="caption" display="inline">{item[itemKeys[2]]}<b></b> </Typography>
          </div>
        )}
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
            <AssociationSelectableViewToolbar 
              title={title}
              search={search}
              onSearchEnter={handleSearchEnter}
            />

            {/* Case: no data */}
            {(!isOnApiRequest && (!areItemsReady || !isCountReady)) && (

              /* Label */
              <Fade
                in={true}
                unmountOnExit
              >
                <div>
                  <Grid container>
                    <Grid item xs={12}>
                      <Grid className={classes.noDataBox} container justify="center" alignItems="center">
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
            {(!isOnApiRequest && areItemsReady && isCountReady) && (
            
              /* List */
              <Fade
                in={true}
                unmountOnExit
              >
                <List
                  height={listHeight}
                  width="100%"
                  itemCount={count}
                  itemSize={getItemSize}
                  onItemsRendered={handleItemsRendered}
                >
                  {Row}
                </List>
              </Fade>

            )}

            {/* Case: loading */}
            {(isOnApiRequest) && (
              /* Progress */
              <Fade
                in={true}
                unmountOnExit
              >
                <div>
                  <Grid container>
                    <Grid item xs={12}>
                      <Grid container className={classes.loadingBox} justify="center" alignItems="center" justify="center">
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