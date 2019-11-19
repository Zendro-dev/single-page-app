import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import api from '../../../../../../../../../../requests/index';
import RoleCompactViewToolbar from './components/RoleCompactViewToolbar';
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

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2),
    minWidth: 200,
  },
  card: {
    margin: theme.spacing(1),
    height: '70vh',
    maxHeight: '70vh',
    overflow: 'auto',
  },
  listBox: {
    height: '39vh',
    maxHeight: '39vh',
    overflowY: 'auto',
    overflowX: 'hidden'
  },
  noDataBox: {
    width: "100%",
    height: '39vh',
    maxHeight: '39vh',
  },
  loadingBox: {
    width: "100%",
    height: '39vh',
    maxHeight: '39vh',
  },
  row: {
    maxHeight: 70,
  },
  id: {
    width: 50,
  },
  dividerV: {
    height: 50,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

export default function RoleCompactView(props) {
  const classes = useStyles();
  const {
    item,
  } = props;

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

  const graphqlServerUrl = useSelector(state => state.urls.graphqlServerUrl)

  useEffect(() => {
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
    if(count === 0) {
      setIsCountReady(false);

    } else {
      setIsCountReady(true);
    }
  }, [count]);

  useEffect(() => {
    if(isGettingFirstData) return;

    if(page === 0) {
      if (!isOnApiRequest) { getData(); } else { setIsPendingApiRequest(true); }
    } else {
      setPage(0);
    }
  }, [search]);

  useEffect(() => {
    if(isGettingFirstData) return;

    if (!isOnApiRequest) { getData(); } else { setIsPendingApiRequest(true); }
  }, [page]);

  useEffect(() => {
    if(isGettingFirstData) return;

    if(page !== 0) {
      setPage(0);
    } else {
      if (!isOnApiRequest) { getData(); } else { setIsPendingApiRequest(true); }
    }
  }, [rowsPerPage]);

  useEffect(() => {
    if (!isOnApiRequest && isPendingApiRequest) {
      setIsPendingApiRequest(false);

      getData();
    }
  }, [isOnApiRequest]);

  /**
   * getData
   * 
   * Get @items and @count from GrahpQL Server.
   * Uses current state properties to fill query request.
   * Updates state to inform new @items and @count retreived.
   * 
   */
  function getData() {
    setIsOnApiRequest(true);

    if (isGettingFirstData) {
      setIsGettingFirstData(false);
    }

    /*
      API Request: associationFilter
    */
    api.userB.getAssociationFilter(
      graphqlServerUrl,
      item.id,
      'roles',
      'name',
      'description',
      search,
      page * rowsPerPage, //paginationOffset
      rowsPerPage, //paginationLimit
    )
      .then(response => {
          if (
              response.data &&
              response.data.data
          ) {
              /**
               * Debug
               */
              console.log("newData: ", response.data.data);

              //update state
              setCount(response.data.data.readOneUser.countFilteredRoles);
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

  const handleSearchEnter = text => {
    setSearch(text);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
      setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleRowClicked = (event, item) => {
    console.log("clicked: ", item);
  }

  return (
    <div className={classes.root}>
      <Grid container>
        {/*
          * Compact List
          */}
        <Grid item xs={12} >
          {(item!==undefined) && (
            <Card className={classes.card}>

              {/* Toolbar */}
              <RoleCompactViewToolbar 
                title='Roles'
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
                      {items.map(it => {
                         let key = it.id;
                         let label = it.name;
                         let sublabel = it.description;

                        return (
                          <ListItem key={key} 
                            role="listitem" 
                            button 
                            className={classes.row}
                            onClick={(event) => {
                              handleRowClicked(event, it);
                            }}
                          >
                            <Grid container justify='center' alignItems='center'>
                              <Grid item xs={12}>
                                <Grid container justify='flex-start' alignItems='center' wrap='nowrap'>
                                  
                                  {/* Id */}
                                  <Grid item>
                                    <Typography className={classes.id} variant="caption" display="block" noWrap={true}>{it.id}</Typography>
                                  </Grid>

                                  {/* Divider */}
                                  <Grid item>
                                    <Divider className={classes.dividerV} orientation="vertical" />
                                  </Grid>

                                  <Grid item xs={10}>

                                    {/* Label */}
                                    {(label !== undefined && label !== null) && (
                                      <Typography variant="body1" display="block" noWrap={true}>{label}</Typography>
                                    )}
                                    
                                    {/* Sublabel */}
                                    {(sublabel !== undefined && sublabel !== null) && (
                                      <Typography variant="caption" display="block" color='textSecondary' noWrap={true}>{sublabel}<b></b> </Typography>
                                    )}
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
      </Grid>
    </div>
  );
}
RoleCompactView.propTypes = {
  item: PropTypes.object.isRequired,
};