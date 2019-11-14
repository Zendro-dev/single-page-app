import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import api from '../../../../../requests/index';
import RolesToRemoveTransferViewToolbar from './components/RolesToRemoveTransferViewToolbar';

import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Add from '@material-ui/icons/AddCircle';
import Remove from '@material-ui/icons/RemoveCircle';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(1),
    minWidth: 200,
    maxWidth: 477*2+20,
  },
  card: {
    margin: theme.spacing(1),
    height: '43vh',
    maxHeight: '43vh',
    overflow: 'auto',
  },
  listBox: {
    height: '43vh',
    maxHeight: '43vh',
    overflowY: 'auto',
    overflowX: 'hidden'
  },
  noDataBox: {
    width: "100%",
    height: '43vh',
    maxHeight: '43vh',
  },
  loadingBox: {
    width: "100%",
    height: '43vh',
    maxHeight: '43vh',
  },
  row: {
    maxHeight: 70,
  },
  dividerV: {
    height: 50,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

export default function RolesToRemoveTransferView(props) {
  const classes = useStyles();
  const {
    item,
    idsToRemove,
    handleTransfer,
    handleUntransfer,
  } = props;

  /*
    State Table A (associated)
  */
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [isOnApiRequest, setIsOnApiRequest] = useState(true);
  const [isPendingApiRequest, setIsPendingApiRequest] = useState(false);
  const [isGettingFirstData, setIsGettingFirstData] = useState(true);
  const [isCountReady, setIsCountReady] = useState(false);
  const [areItemsReady, setAreItemsReady] = useState(false);
  /*
    State Table B (to remove)
  */
  const [itemsB, setItemsB] = useState([]);
  const [countB, setCountB] = useState(50);
  const [searchB, setSearchB] = useState('');
  const [pageB, setPageB] = useState(0);
  const [rowsPerPageB, setRowsPerPageB] = useState(10);
  const [isOnApiRequestB, setIsOnApiRequestB] = useState(true);
  const [isPendingApiRequestB, setIsPendingApiRequestB] = useState(false);
  const [isGettingFirstDataB, setIsGettingFirstDataB] = useState(true);
  const [isCountReadyB, setIsCountReadyB] = useState(false);
  const [areItemsReadyB, setAreItemsReadyB] = useState(false);

  const [thereAreItemsToAdd, setThereAreItemsToAdd] = useState(false);
  const lidsToRemove = useRef([]);
  const graphqlServerUrl = useSelector(state => state.urls.graphqlServerUrl)

  useEffect(() => {
    if(idsToRemove !== undefined && idsToRemove.length > 0) {
      lidsToRemove.current.concat(idsToRemove);
      setThereAreItemsToAdd(true);
      getDataB();
    } else {
      setIsGettingFirstDataB(false);
    }

    if(item !== undefined){
      getData(); 
    } else {
      setIsGettingFirstData(false);
    }
  }, []);

  useEffect(() => {
    if(items.length > 0) { 
      setAreItemsReady(true); 
    } else { 
      setAreItemsReady(false); 
    }
  }, [items]);

  useEffect(() => {
    if(itemsB.length > 0) { 
      setAreItemsReadyB(true); 
    } else { 
      setAreItemsReadyB(false); 
    }
  }, [itemsB]);

  useEffect(() => {
    if(count === 0) {
      setIsCountReady(false);

    } else {
      setIsCountReady(true);
    }
  }, [count]);

  useEffect(() => {
    if(countB === 0) {
      setIsCountReadyB(false);

    } else {
      setIsCountReadyB(true);
    }
  }, [countB]);

  useEffect(() => {
    if(isGettingFirstData) return;

    if(page === 0) {
      if (!isOnApiRequest) { getData(); } else { setIsPendingApiRequest(true); }
    } else {
      setPage(0);
    }
  }, [search]);

  useEffect(() => {
    if(isGettingFirstDataB) return;

    if(page === 0) {
      if (!isOnApiRequestB) { getDataB(); } else { setIsPendingApiRequestB(true); }
    } else {
      setPageB(0);
    }
  }, [searchB]);

  useEffect(() => {
    if(isGettingFirstData) return;

    if (!isOnApiRequest) { getData(); } else { setIsPendingApiRequest(true); }
  }, [page]);

  useEffect(() => {
    if(isGettingFirstDataB) return;

    if (!isOnApiRequestB) { getDataB(); } else { setIsPendingApiRequestB(true); }
  }, [pageB]);

  useEffect(() => {
    if(isGettingFirstData) return;

    if(page !== 0) {
      setPage(0);
    } else {
      if (!isOnApiRequest) { getData(); } else { setIsPendingApiRequest(true); }
    }
  }, [rowsPerPage]);

  useEffect(() => {
    if(isGettingFirstDataB) return;

    if(pageB !== 0) {
      setPageB(0);
    } else {
      if (!isOnApiRequestB) { getDataB(); } else { setIsPendingApiRequestB(true); }
    }
  }, [rowsPerPageB]);

  useEffect(() => {
    if (!isOnApiRequest && isPendingApiRequest) {
      setIsPendingApiRequest(false);
      getData();
    }
  }, [isOnApiRequest]);
  
  useEffect(() => {
    if (!isOnApiRequestB && isPendingApiRequestB) {
      setIsPendingApiRequestB(false);
      getDataB();
    }
  }, [isOnApiRequestB]);

  /**
   * getData
   * 
   * Get @items and @count from GrahpQL Server.
   * Uses current state properties to fill query request.
   * Updates state to inform new @items and @count retreived.
   * 
   */
  function getData() {
    //set state flag
    setIsOnApiRequest(true);

    //reset
    if (isGettingFirstData) {
      setIsGettingFirstData(false);
    }

    //set ops: excluded ids
    let ops = null;
    if(lidsToRemove.current !== undefined && lidsToRemove.current.length > 0) {
      ops = {
        exclude: [{
          type: 'Int',
          values: {id: lidsToRemove.current}
        }]
      };
    }

    /*
      API Request: associationFilter
    */
    api.user.getAssociationFilter(
    graphqlServerUrl, 
    item.id, 
    search,
    page * rowsPerPage, //paginationOffset
    rowsPerPage, //paginationLimit
    ops
  )
      .then(response => {
          //Check response
          if (
              response.data &&
              response.data.data
          ) {
              //set new count
              var newCount = response.data.data.readOneUser.countFilteredRoles;

              /*
                Check: empty page
              */
              if( (newCount === (page * rowsPerPage)) && (page > 0) ) 
              {
                //update state
                setPage(page-1);
                setIsOnApiRequest(false);

                //done (getData will be invoked on hook[page])
                return;
              }
              //else

              //update state
              setCount(newCount);
              setItems(response.data.data.readOneUser.rolesFilter);
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

  /**
   * getDataB
   * 
   * Get @items and @count from GrahpQL Server.
   * Uses current state properties to fill query request.
   * Updates state to inform new @items and @count retreived.
   * 
   */
  function getDataB() {
    //set state flag
    setIsOnApiRequestB(true);

    //reset
    if(isGettingFirstDataB) {
      setIsGettingFirstDataB(false);
    }

    //set ops: only ids
    let ops = null;
    if(lidsToRemove.current !== undefined && lidsToRemove.current.length > 0) {
      ops = {
        only: [{
          type: 'Int',
          values: {id: lidsToRemove.current}
        }]
      };
    }

    /*
      API Request: countItems
    */
    api.role.getCountItems(graphqlServerUrl, searchB, ops)
      .then(response => {
        //Check response
        if (
          response.data &&
          response.data.data
        ) {

          //set new count
          var newCount = response.data.data.countRoles;

          /*
            Check: empty page
          */
          if( (newCount === (pageB * rowsPerPageB)) && (pageB > 0) ) 
          {
            //update state
            setPageB(pageB-1);
            setIsOnApiRequestB(false);

            //done (getData will be invoked on hook[page])
            return;
          }

          /*
            API Request: items
          */
          api.role.getItems(
            graphqlServerUrl,
            searchB,
            null, //orderBy
            null, //orderDirection
            pageB * rowsPerPageB, //paginationOffset
            rowsPerPageB, //paginationLimit
            ops
          )
            .then(response => {
              //check response
              if (
                response.data &&
                response.data.data &&
                response.data.data.roles) {

                /**
                 * Debug
                 */
                console.log("@@newCount: ", newCount);
                console.log("@@newItems: ", response.data.data.roles);

                //update state
                setCountB(newCount);
                setItemsB(response.data.data.roles);
                setIsOnApiRequestB(false);

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
  
  const handleSearchEnter = text => {
    setSearch(text);
  };

  const handleSearchEnterB = text => {
    setSearchB(text);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangePageB = (event, newPage) => {
    setPageB(newPage);
  };

  const handleChangeRowsPerPage = event => {
      setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleChangeRowsPerPageB = event => {
    setRowsPerPageB(parseInt(event.target.value, 10));
  };

  const handleRowClicked = (event, item) => {
    console.log("clicked: ", item);
  };

  const handleAddItem = (event, item) => {
    lidsToRemove.current.push(item.id);
    setThereAreItemsToAdd(true);

    getData();
    getDataB();

    //callback
    handleTransfer('role', item.id);
  };

  const handleRemoveItem = (event, item) => {
    for(var i=0; i<lidsToRemove.current.length; ++i)
    {
      if(lidsToRemove.current[i] === item.id) {
        lidsToRemove.current.splice(i, 1);
        break;
      }
    }

    if(lidsToRemove.current.length === 0) {
      setThereAreItemsToAdd(false);
    }

    getDataB();
    getData();

    //callback
    handleUntransfer('role', item.id);
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        {/*
          * Selectable list (A)
          */}
        <Grid item xs={12} sm={6} >
          {(item!==undefined) && (
            <Card className={classes.card}>

              {/* Toolbar */}
              <RolesToRemoveTransferViewToolbar 
                title={'Associated roles'}
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
                  <Box className={classes.listBox}>
                    <List dense component="div" role="list" >
                      {items.map(item => {
                        let key = item.id;
                        let label = item.name;
                        let sublabel = item.description;

                        return (
                          <ListItem key={key} 
                            role="listitem" 
                            button 
                            className={classes.row}
                            onClick={(event) => {
                              handleRowClicked(event, item);
                            }}
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

                                  <Grid item xs={9}>

                                    {/* Label */}
                                    {(label !== undefined && label !== null) && (
                                      <Typography variant="body1" display="block" noWrap={true}>{label}</Typography>
                                    )}
                                    
                                    {/* Sublabel */}
                                    {(sublabel !== undefined && sublabel !== null) && (
                                      <Typography variant="caption" display="block" color='textSecondary' noWrap={true}>{sublabel}<b></b> </Typography>
                                    )}
                                  </Grid>

                                  {/* Button: Add */}
                                  <Grid item xs={2}>
                                    <Grid container justify='flex-end'>
                                      <Grid item>
                                        <Tooltip title="Send to remove list">
                                          <IconButton
                                            color="primary"
                                            className={classes.iconButton}
                                            onClick={(event) => {
                                              event.stopPropagation();
                                              handleAddItem(event, item);
                                            }}
                                          >
                                            <Remove color="secondary" />
                                          </IconButton>
                                        </Tooltip>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </ListItem>
                        );
                      })}
                      <ListItem />
                    </List>
                  </Box>
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
                  rowsPerPageOptions={[10, 25, 50, 100]}
                  component="div"
                  count={count}
                  rowsPerPage={rowsPerPage}
                  labelRowsPerPage='rows'
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </Card>
          )}
        </Grid>


        {/*
          * To add list (B) 
          */}
        <Grid item xs={12} sm={6} >
          {(item!==undefined) && (
            <Card className={classes.card}>

              {/* Toolbar */}
              <RolesToRemoveTransferViewToolbar 
                title={'Roles to remove'}
                titleIcon={true}
                search={searchB}
                onSearchEnter={handleSearchEnterB}
              />

              {/* Case: no items added */}
              {(!thereAreItemsToAdd) && (
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
                            <Typography variant="body1" > No items added </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>
                </Fade>
              )}

              {/* Case: no data from search */}
              {(thereAreItemsToAdd && !isOnApiRequestB && (!areItemsReadyB || !isCountReadyB)) && (
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
              {(thereAreItemsToAdd && !isOnApiRequestB && areItemsReadyB && isCountReadyB) && (
              
                /* List */
                <Fade
                  in={true}
                  unmountOnExit
                >
                  <Box className={classes.listBox}>
                    <List dense component="div" role="list">
                      {itemsB.map(item => {
                        let key = item.id;
                        let label = item.name;
                        let sublabel = item.description;

                        return (
                          <ListItem key={key} 
                            role="listitem"
                            button
                            className={classes.row}
                            onClick={(event) => {
                              handleRowClicked(event, item);
                            }}
                          >
                            <Grid container justify='flex-end' alignItems='center'>
                              <Grid item xs={12}>
                                <Grid container justify='space-evenly' alignItems='center' alignContent='stretch' wrap='nowrap'>
                                  
                                  {/* Id */}
                                  <Grid item xs={1}>
                                    <Typography variant="caption" display="block" noWrap={true}>{item.id}</Typography>
                                  </Grid>

                                  {/* Divider */}
                                  <Divider className={classes.dividerV} orientation="vertical" />

                                  <Grid item xs={9}>

                                    {/* Label */}
                                    {(label !== undefined && label !== null) && (
                                      <Typography variant="body1" display="block" noWrap={true}>{label}</Typography>
                                    )}
                                    
                                    {/* Sublabel */}
                                    {(sublabel !== undefined && sublabel !== null) && (
                                      <Typography variant="caption" display="block" color='textSecondary' noWrap={true}>{sublabel}<b></b> </Typography>
                                    )}
                                  </Grid>

                                  {/* Button: Add */}
                                  <Grid item xs={2}>
                                    <Tooltip title="Send to associated list">
                                      <IconButton
                                        color="primary"
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          handleRemoveItem(event, item);
                                        }}
                                      >
                                        <Add color="primary" />
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
                  </Box>
                </Fade>
              )}
              {/* Case: loading */}
              {( thereAreItemsToAdd && isOnApiRequestB) && (
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
                  rowsPerPageOptions={[10, 25, 50, 100]}
                  component="div"
                  count={countB}
                  rowsPerPage={rowsPerPageB}
                  labelRowsPerPage='rows'
                  page={pageB}
                  onChangePage={handleChangePageB}
                  onChangeRowsPerPage={handleChangeRowsPerPageB}
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
RolesToAddTransferView.propTypes = {
    item: PropTypes.object.isRequired,
    idsToRemove: PropTypes.array.isRequired,
    handleTransfer: PropTypes.function.isRequired,
    handleUntransfer: PropTypes.function.isRequired,
};