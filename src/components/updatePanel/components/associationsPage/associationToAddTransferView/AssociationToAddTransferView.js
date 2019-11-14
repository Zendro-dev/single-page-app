import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import api from '../../../../../requests/index';
import AssociationToAddTransferViewToolbar from './components/AssociationToAddTransferViewToolbar';


/*
  Material-UI components
*/
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
//icons
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
    height: '67vh',
    maxHeight: '67vh',
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
  line: {
    display: "inline",
  },
  row: {
    maxHeight: 70,
  },
  idCell: {
    minWidth: 50,
  },
  dividerV: {
    height: 50,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  rowPopover: {
    pointerEvents: 'none',
  },
}));

export default function AssociationToAddTransferView(props) {
  /*
    Styles
  */
  const classes = useStyles();
  /*
    Properties
  */
  const {
    modelNames,
    item,
    title,
    titleB,
    associationNames, //current
    idsToAdd,
    handleTransfer,
    handleUntransfer,
  } = props;

  /*
    State A (selectable list)
  */
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  //table
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [isOnApiRequest, setIsOnApiRequest] = useState(true);
  const [isPendingApiRequest, setIsPendingApiRequest] = useState(false);
  const [isGettingFirstData, setIsGettingFirstData] = useState(true); //to avoid repeat initial fetch
  const [isCountReady, setIsCountReady] = useState(false);
  const [areItemsReady, setAreItemsReady] = useState(false);

  /*
    State B (to add list)
  */
  const [itemsB, setItemsB] = useState([]);
  const [countB, setCountB] = useState(0);
  const [searchB, setSearchB] = useState('');
  const [selectedItemsB, setSelectedItemsB] = useState([]);
  //table
  const [pageB, setPageB] = useState(0);
  const [rowsPerPageB, setRowsPerPageB] = useState(100);
  const [isOnApiRequestB, setIsOnApiRequestB] = useState(true);
  const [isPendingApiRequestB, setIsPendingApiRequestB] = useState(false);
  const [isGettingFirstDataB, setIsGettingFirstDataB] = useState(true); //to avoid repeat initial fetch
  const [isCountReadyB, setIsCountReadyB] = useState(false);
  const [areItemsReadyB, setAreItemsReadyB] = useState(false);

  /*
    State
  */
  const [thereAreItemsToAdd, setThereAreItemsToAdd] = useState(false);

  /*
    Refs
  */
  const itemHeights = useRef([]);
  const lidsToAdd = useRef([]);
  const lidsAssociated = useRef(undefined); //contains name & records ids of current associaton, owned by current item.

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
      
      //concat items
      lidsToAdd.current.concat(idsToAdd);

      //update state
      setThereAreItemsToAdd(true);

      //get data B
      getDataB();
    } else {
      //update state
      setIsGettingFirstDataB(false);
    }


    //get data
    if(associationNames !== undefined){
      //get data A 
      getData(); 
    } else {
      //update state
      setIsGettingFirstData(false);
    }
  }, []);

  useEffect(() => {
    //update state
    if(items.length > 0) { 
      setAreItemsReady(true); 
    } else { 
      setAreItemsReady(false); 
    }

  }, [items]);

  useEffect(() => {
    //update state
    if(itemsB.length > 0) { 
      setAreItemsReadyB(true); 
    } else { 
      setAreItemsReadyB(false); 
    }

  }, [itemsB]);

  useEffect(() => {
    if(count === 0) {
      //update state
      setIsCountReady(false);

    } else {
      //update state
      setIsCountReady(true);
    }
  }, [count]);

  useEffect(() => {
    if(countB === 0) {
      //update state
      setIsCountReadyB(false);

    } else {
      //update state
      setIsCountReadyB(true);
    }
  }, [countB]);

  useEffect(() => {
    //return on init
    if(isGettingFirstData) return;

    if(page === 0) {
      //get data
      if (!isOnApiRequest) { getData(); } else { setIsPendingApiRequest(true); }
    } else {
      //update state
      setPage(0); //search will occur or hook[page]
    }
  }, [search]);

  useEffect(() => {
    //return on init
    if(isGettingFirstDataB) return;

    if(page === 0) {
      //get data
      if (!isOnApiRequestB) { getDataB(); } else { setIsPendingApiRequestB(true); }
    } else {
      //update state
      setPageB(0); //search will occur or hook[page]
    }
  }, [searchB]);

  useEffect(() => {
    //return on init
    if(isGettingFirstData) return;

    //get data
    if (!isOnApiRequest) { getData(); } else { setIsPendingApiRequest(true); }
  }, [page]);

  useEffect(() => {
    //return on init
    if(isGettingFirstDataB) return;

    //get data
    if (!isOnApiRequestB) { getDataB(); } else { setIsPendingApiRequestB(true); }
  }, [pageB]);

  useEffect(() => {
    //return on init
    if(isGettingFirstData) return;

    if(page !== 0) {
      //update state
      setPage(0);
    } else {
      //get data
      if (!isOnApiRequest) { getData(); } else { setIsPendingApiRequest(true); }
    }
  }, [rowsPerPage]);

  useEffect(() => {
    //return on init
    if(isGettingFirstDataB) return;

    if(pageB !== 0) {
      //update state
      setPageB(0);
    } else {
      //get data
      if (!isOnApiRequestB) { getDataB(); } else { setIsPendingApiRequestB(true); }
    }
  }, [rowsPerPageB]);

  useEffect(() => {
    if (!isOnApiRequest && isPendingApiRequest) {
      //reset
      setIsPendingApiRequest(false);

      //get data  
      getData();
    }
  }, [isOnApiRequest]);
  useEffect(() => {
    if (!isOnApiRequestB && isPendingApiRequestB) {
      //reset
      setIsPendingApiRequestB(false);

      //get data  
      getDataB();
    }
  }, [isOnApiRequestB]);


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
    //set state flag
    setIsOnApiRequest(true);

    //reset
    if (isGettingFirstData) {
      setIsGettingFirstData(false);
    }

    //if ids associated needs to be fetched.
    if(lidsAssociated.current === undefined || lidsAssociated.current.associationName !== associationNames.targetModelLc) {
      /**
       * Debug
       */
      console.log("@@- Getting ids associated first -@@");
        
      /*
        API Request: associatedIds
      */
      api[modelNames.name].getAssociatedIds(graphqlServerUrl, modelNames, item.id, associationNames)
      .then(response => {
        //Check response
        if (
          response.data &&
          response.data.data
        ) {
          //set ids
          let idso = response.data.data[`readOne${modelNames.nameCp}`][`${associationNames.targetModelPlLc}Filter`];
          lidsAssociated.current = idso.map(function(item){ return item.id});

          /**
           * Debug
           */
          console.log("@@lidsToAdd.current: ", idso.map(function(item){ return item.id}));
          console.log("@@lidsAssociated.current: ", lidsAssociated.current);
          console.log("@@lidsToAdd.current: ", lidsToAdd.current);

          //set ops: excluded ids: toAddIds + associatedIds
          let ops = null;
          let exIds = [];
          if(lidsToAdd.current !== undefined && lidsToAdd.current.length > 0) {
            exIds = lidsToAdd.current;
          }
          if(lidsAssociated.current !== undefined && lidsAssociated.current.length > 0) {
            exIds = exIds.concat(lidsAssociated.current);
          }
          if(exIds.length > 0) {
            ops = {
              exclude: [{
                type: 'Int',
                values: {id: lidsToAdd.current.concat(lidsAssociated.current)}
              }]
            };
          }
          console.log("@@ops: ", ops);

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
                    console.log("error3.1");

                    //done
                    return;
                  }
                })
                .catch(err => {

                  //error
                  console.log("error3.2");

                  //done
                  return;
                });

              //done
              return;

            } else {

              //error
              console.log("error2.1")

              //done
              return;
            }
          })
          .catch(err => {

            //error
            console.log("error2.2: ", err)

            //done
            return;
          });

        } else {
          //error
          console.log("error1.1")

          //done
          return;
        }
      })
      .catch(err => {

        //error
        console.log("error1.2");

        //done
        return;
      });

    }//end: if lisdAssociated needs to be fetched
    else { //do getData directly
      /**
       * Debug
       */
      console.log("@@- Getting data directly -@@");

      /**
       * Debug
       */
      console.log("@@lidsAssociated.current: ", lidsAssociated.current);
      console.log("@@lidsToAdd.current: ", lidsToAdd.current);
      
      //set ops: excluded ids: toAddIds + associatedIds
      let ops = null;
      let exIds = [];
      if(lidsToAdd.current !== undefined && lidsToAdd.current.length > 0) {
        exIds = lidsToAdd.current;
      }
      if(lidsAssociated.current !== undefined && lidsAssociated.current.length > 0) {
        exIds = exIds.concat(lidsAssociated.current);
      }
      if(exIds.length > 0) {
        ops = {
          exclude: [{
            type: 'Int',
            values: {id: lidsToAdd.current.concat(lidsAssociated.current)}
          }]
        };
      }
      console.log("@@ops: ", ops);

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

    }//end: else: do getData directly
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
    if(lidsToAdd.current !== undefined && lidsToAdd.current.length > 0) {
      ops = {
        only: [{
          type: 'Int',
          values: {id: lidsToAdd.current}
        }]
      };
    }

    /*
      API Request: countItems
    */
    api[associationNames.targetModelLc].getCountItems(associationNames.targetModelLc, graphqlServerUrl, searchB, ops)
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
          api[associationNames.targetModelLc].getItems(
            associationNames.targetModelLc,
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
                response.data.data[associationNames.relationName]) {

                /**
                 * Debug
                 */
                console.log("@@newCount: ", newCount);
                console.log("@@newItems: ", response.data.data[associationNames.relationName]);

                //update state
                setCountB(newCount);
                setItemsB(response.data.data[associationNames.relationName]);
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
  
  /*
      Handlers
  */
  /**
   * On search text enter handler.
   * 
   * @param {String} value New search text value.
   */
  const handleSearchEnter = text => {
    setSearch(text);
  }
  const handleSearchEnterB = text => {
    setSearchB(text);
  }

  const handleChangePage = (event, newPage) => {
    //update state
    setPage(newPage);
  };
  const handleChangePageB = (event, newPage) => {
    //update state
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
  }

  const handleAddItem = (event, item) => {
    //push id to add
    lidsToAdd.current.push(item.id);

    //update state
    setThereAreItemsToAdd(true);

    //get data A
    getData();
    //get data B
    getDataB();

    //callback
    handleTransfer(associationNames.targetModelLc, item.id);
  }

  const handleRemoveItem = (event, item) => {
    
    //find
    for(var i=0; i<lidsToAdd.current.length; ++i)
    {
      if(lidsToAdd.current[i] === item.id) {
        //remove
        lidsToAdd.current.splice(i, 1);
        break;
      }
    }

    if(lidsToAdd.current.length === 0) {
      //update state
      setThereAreItemsToAdd(false);
    }
    
    //get data B
    getDataB();
    //get data A
    getData();

    //callback
    handleUntransfer(associationNames.targetModelLc, item.id);
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        {/*
          * Selectable list (A)
          */}
        <Grid item xs={12} sm={6} >
          {(associationNames!==undefined) && (
            <Card className={classes.card}>

              {/* Toolbar */}
              <AssociationToAddTransferViewToolbar 
                title={title + " "}
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
                  <Box className={classes.listBox}>
                    <List dense component="div" role="list" >
                      {items.map(item => {
                        let key = item.id;
                        let label = (associationNames.label !== 'id') ? item[associationNames.label] : null;
                        let sublabel = (associationNames.sublabel !== 'id' && 
                                        associationNames.sublabel !== associationNames.label) ? 
                                          item[associationNames.sublabel] : null;

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
                                        <Tooltip title="Add to chosen list">
                                          <IconButton
                                            color="primary"
                                            className={classes.iconButton}
                                            onClick={(event) => {
                                              event.stopPropagation();
                                              handleAddItem(event, item);
                                            }}
                                          >
                                            <Add color="primary" />
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
          {(associationNames!==undefined) && (
            <Card className={classes.card}>

              {/* Toolbar */}
              <AssociationToAddTransferViewToolbar 
                title={titleB + " to add"}
                titleIcon={true}
                search={searchB}
                associationNames={associationNames}
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
                        let label = (associationNames.label !== 'id') ? item[associationNames.label] : null;
                        let sublabel = (associationNames.sublabel !== 'id' && 
                                        associationNames.sublabel !== associationNames.label) ? 
                                          item[associationNames.sublabel] : null;

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
                                    <Tooltip title="Remove from chosen list">
                                      <IconButton
                                        color="primary"
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          handleRemoveItem(event, item);
                                        }}
                                      >
                                        <Remove color="secondary" />
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
AssociationToAddTransferView.propTypes = {
    title: PropTypes.string,
    associationNames: PropTypes.object,
};