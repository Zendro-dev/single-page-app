import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import api from '../../../requests/index';
//import { VariableSizeList as List } from 'react-window';
import AssociationSelectableViewToolbar from './components/AssociationSelectableViewToolbar';


/*
  Material-UI components
*/
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Popover from '@material-ui/core/Popover';
import Grow from '@material-ui/core/Grow';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
//icons
import Add from '@material-ui/icons/AddCircle';



/*
  Styles
*/
const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(0),
    minWidth: 200,
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
  row: {
    maxHeight: 70,
  },
  dividerV: {
    height: 50,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  rowPopover: {
    pointerEvents: 'none',
  },
  iconButton: {
    padding: theme.spacing(1),
  },
}));

export default function AssociationSelectableView(props) {
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
    idsToAdd,
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
  const [selectedItems, setSelectedItems] = useState([]);
  const [hoveredItems, setHoveredItems] = useState([]);
  const [rowAnchorEl, setRowAnchorEl] = useState(null);
  const [rowPopoverOpen, setRowPopoverOpen] = useState(false);
  const isRowEnter = Boolean(rowAnchorEl);
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
  const lidsToAdd = useRef([]);

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
    console.log("@@-- hook: associationNames: ", associationNames);
    console.log("@@-- hook: idsToAdd: ", idsToAdd);

    //set ids to add
    if(idsToAdd !== undefined && idsToAdd.length > 0) {
      lidsToAdd.current.concat(idsToAdd);
    }

    //get data
    if(associationNames !== undefined){ getData(); } else {setAreRowsReady(true);}
  }, []);

  useEffect(() => {
    //update state
    if(items.length > 0) { setAreItemsReady(true); } else { setAreItemsReady(false); }

  }, [items]);

   useEffect(() => {
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
    setAreRowsReady(false);

    //reset
    if (isGettingFirstData) {
      setIsGettingFirstData(false);
    }

    //set ops: excluded ids
    let ops = null;
    if(lidsToAdd.current !== undefined && lidsToAdd.current.length > 0) {
      ops = {
        exclude: [{
          type: 'Int',
          values: {id: lidsToAdd.current}
        }]
      };
    }

    /*
      API Request: countItems
    */
    api[associationNames.targetModelLc].getCountItems(associationNames.targetModelLc, graphqlServerUrl, search, ops)
      .then(response => {
        //Check response
        if (
          response.data &&
          response.data.data
        ) {
          /**
           * Debug
           */
          console.log("newCount: ", response.data.data['count' + associationNames.relationNameCp]);

          //set new count
          var newCount = response.data.data['count' + associationNames.relationNameCp];

          /*
            API Request: items
          */
          api[associationNames.targetModelLc].getItems(
            associationNames.targetModelLc,
            graphqlServerUrl,
            search,
            null, //orderBy
            null, //orderDirection
            page * rowsPerPage, //paginationOffset
            rowsPerPage, //paginationLimit
            ops
          )
            .then(response => {
              //check response
              if (
                response.data &&
                response.data.data &&
                response.data.data[associationNames.relationName]) {

                /**
                 * Debug
                 */
                console.log("@@newCount: ", newCount);
                console.log("@@newItems: ", response.data.data[associationNames.relationName]);

                //update state
                setCount(newCount);
                setItems(response.data.data[associationNames.relationName]);
                setIsOnApiRequest(false);

                //done
                console.log("getData: done");
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

  function itemHasKey(item, index) {
    if(item !== undefined) {
      return item.key === this.key;
    } else {
      return false;
    }
  }

  function isSelected(item) {
    for(var i=0; i<selectedItems.length; i++) 
    {
      if(item.id === selectedItems[i].id) {
        return true;
      }
    }
    return false;
  }

  function hasHover(item) {
    for(var i=0; i<hoveredItems.length; i++) 
    {
      if(item.id === hoveredItems[i].id) {
        return true;
      }
    }
    return false;
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

  const handleRowClicked = (event, item) => {
    console.log("clicked: ", item);
  }

  const handleSelectItem = (item, newStatus) => {
    let newSelectedItems = Array.from(selectedItems);
    
    if(newStatus) {
      //add
      newSelectedItems.push(item);
    } else {
      //find item
      for(var i=0; i<newSelectedItems.length; ++i)
      {
        if(item.id === newSelectedItems[i].id) {
          //remove
          newSelectedItems.splice(i, 1);
        }
      }
    }

    //update state
    setSelectedItems(newSelectedItems);
  }

  const handleMouseEnterRow = (event, item) => {
    //reset
    let newHoveredItems = [];
    //add
    newHoveredItems.push(item);
    //update state
    setHoveredItems(newHoveredItems);
  }

  const handleMouseLeaveRow = (event, item) => {
    //update state
    setHoveredItems([]);
  }

  const handleAddClicked = (event, item) => {
    //update state
    console.log("onAddClicked: ", item);
  }

  return (
    <div className={classes.root}>
      <Grid container justify='center'>
        <Grid item xs={12}>

          {(associationNames!==undefined) && (
            <Card className={classes.card}>

              {/* Toolbar */}
              <AssociationSelectableViewToolbar 
                title={title}
                search={search}
                associationNames={associationNames}
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
                  <List dense component="div" role="list">
                    
                    {items.map(item => {
                      let key = item.id;
                      let label = (associationNames.label !== 'id') ? item[associationNames.label] : null;
                      let sublabel = (associationNames.sublabel !== 'id' && 
                                      associationNames.sublabel !== associationNames.label) ? 
                                        item[associationNames.sublabel] : null;
                      let selected = isSelected(item);
                      let hovered = hasHover(item);

                      return (
                        <ListItem key={key} 
                          role="listitem" 
                          button 
                          className={classes.row}
                          onClick={(event) => {
                            handleRowClicked(event, item);
                          }}
                          onMouseEnter={(event) => {handleMouseEnterRow(event, item)}}
                          onMouseLeave={(event) => {handleMouseLeaveRow(event, item)}}
                        >
                          <Grid container justify='center' alignItems='center'>
                            <Grid item xs={12}>
                              <Grid container justify='center' alignItems='center' wrap='nowrap'>
                                
                                {/* Id */}
                                <Grid item xs={1}>
                                  <Typography variant="caption" display="block" noWrap={true}>{item.id}</Typography>
                                </Grid>

                                {/* Divider */}
                                <Divider className={classes.dividerV} orientation="vertical" />

                                {/* Label */}
                                <Grid item xs={9}>
                                  {(label !== undefined && label !== null) && (
                                    <Typography variant="body1" display="block" noWrap={true}>{label}</Typography>
                                  )}
                                  {/* Sublabel */}
                                  {(sublabel !== undefined && sublabel !== null) && (
                                    <Typography variant="caption" display="block" color='textSecondary' noWrap={true}>{sublabel}<b></b> </Typography>
                                  )}
                                </Grid>

                                {/* Button */}
                                <Grid item xs={2}>
                                  <Tooltip title="Add to list">
                                    <IconButton
                                      color="primary"
                                      className={classes.iconButton}
                                      onClick={(event) => {
                                        event.stopPropagation();

                                        //push id to add
                                        lidsToAdd.current.push(item.id);

                                        //get data
                                        getData();

                                        //callback
                                        handleTransfer(associationNames.targetModelLc, item.id);
                                      }}
                                    >
                                      <Add color="primary"/>
                                    </IconButton>
                                  </Tooltip>
                                </Grid>

                              </Grid>
                            </Grid>
                          </Grid>
                        </ListItem>
                      );
                    })}
                    <ListItem />
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
                        <Grid container className={classes.loadingBox} justify="center" alignItems="center">
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
          )}
        </Grid>
      </Grid>
    </div>
  );
}

/*
  PropTypes
*/
AssociationSelectableView.propTypes = {
    title: PropTypes.string,
    associationNames: PropTypes.object,
};