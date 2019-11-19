import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import api from '../../../../../requests/index'
import UserEnhancedTableHead from './components/UserEnhancedTableHead'
import UserEnhancedTableToolbar from './components/UserEnhancedTableToolbar'
import UserCreatePanel from './components/userCreatePanel/UserCreatePanel'
import UserUpdatePanel from './components/userUpdatePanel/UserUpdatePanel'
import UserDetailPanel from './components/userDetailPanel/UserDetailPanel'
import UserDeleteConfirmationDialog from './components/UserDeleteConfirmationDialog'
import UserUploadFileDialog from './components/UserUploadFileDialog'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Delete from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import SeeInfo from '@material-ui/icons/VisibilityTwoTone';

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(7),
    },
    paper: {
        overflowX: 'auto',
    },
    tableWrapper: {
      height: '65vh',
      maxHeight: '65vh',
      overflow: 'auto',
    },
    loading: {
      height: '65vh',
      maxHeight: '65vh',
    },
    noData: {
      height: '65vh',
      maxHeight: '65vh',
    },
}));

export default function UserEnhancedTable() {
  const classes = useStyles();

  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [isOnApiRequest, setIsOnApiRequest] = useState(true);
  const [isPendingApiRequest, setIsPendingApiRequest] = useState(false);
  const [isGettingFirstData, setIsGettingFirstData] = useState(true);
 
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateItem, setUpdateItem] = useState(undefined);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [detailItem, setDetailItem] = useState(undefined);
  const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false);
  const [deleteConfirmationItem, setDeleteConfirmationItem] = useState(undefined);
  const [uploadFileDialogOpen, setUploadFileDialogOpen] = useState(false);

  const graphqlServerUrl = useSelector(state => state.urls.graphqlServerUrl)

  useEffect(() => {
      getData();
  }, []);

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

    if(page === 0) {
      if (!isOnApiRequest) { getData(); } else { setIsPendingApiRequest(true); }
    } else {
      setPage(0);
    }
  }, [order]);

  useEffect(() => {
    if(isGettingFirstData) return;

    if(page === 0) {
      if (!isOnApiRequest) { getData(); } else { setIsPendingApiRequest(true); }
    } else {
      setPage(0);
    }
  }, [orderBy]);

  useEffect(() => {
    if(isGettingFirstData) return;

    if(page === 0) {
      if (!isOnApiRequest) { getData(); } else { setIsPendingApiRequest(true); }
    } else {
      setPage(0);
    }
  }, [rowsPerPage]);

  useEffect(() => {
    if(isGettingFirstData) return;

    if (!isOnApiRequest) { getData(); } else { setIsPendingApiRequest(true); }
  }, [page]);

  useEffect(() => {      
    if (!isOnApiRequest && isPendingApiRequest) {
      setIsPendingApiRequest(false);
      getData();
    }
  }, [isOnApiRequest]);

  useEffect(() => {
    if (updateItem !== undefined) {
      setUpdateDialogOpen(true);
    }
  }, [updateItem]);

  useEffect(() => {
    if (detailItem !== undefined) {
      setDetailDialogOpen(true);
    }
  }, [detailItem]);

  useEffect(() => {
    if (deleteConfirmationItem !== undefined) {
      setDeleteConfirmationDialogOpen(true);
    }
  }, [deleteConfirmationItem]);

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
      
      if(isGettingFirstData) {
        setIsGettingFirstData(false);
      }

      /*
        API Request: countItems
      */
      api.userB.getCountItems(graphqlServerUrl, search)
        .then(response => {
          if(
            response.data &&
            response.data.data
          ) {
            var newCount = response.data.data.countUsers;

            /*
              Check: empty page
            */
            if((newCount === (page * rowsPerPage)) && (page > 0)) {
              setPage(page - 1);
              setIsOnApiRequest(false);
              return;
            }

            /*
              API Request: items
            */
            api.userB.getItems(
              graphqlServerUrl,
              search,
              orderBy,
              order,
              page * rowsPerPage, //paginationOffset
              rowsPerPage, //paginationLimit
            )
              .then(response => {
                if (
                  response.data &&
                  response.data.data &&
                  response.data.data.users) {

                  /**
                   * Debug
                   */
                  console.log("@@newCount: ", newCount);
                  console.log("@@newItems: ", response.data.data.users);

                  //set new data
                  setIsOnApiRequest(false);
                  setCount(newCount);
                  setItems(response.data.data.users);
                  return;

                } else {

                  //error
                  console.log("error1");
                  return;
                }
              })
              .catch(err => {

                //error
                console.log("error2");
                return;
              });

            return;

          } else {

            //error
            console.log("error3")
            return;
          }
        })
      .catch(err => {

        //error
        console.log("error4: ", err)
        return;
      });
  }//end: getData()

  function doDelete(event, item) {
    /*
      API Request: deleteItem
    */
    api.userB.deleteItem(graphqlServerUrl, item.id)
      .then(response => {
        if(
          response.data &&
          response.data.data
        ) {
          /**
            * Debug
            */
          console.log(">> mutation.delete response: ", response.data.data);
          getData();
          return;

        } else {

          //error
          console.log("error3")
          return;
        }
      })
      .catch(err => {

        //error
        console.log("error4: ", err)
        return;
      });
  }

  const handleSearchEnter = text => {
    setSearch(text);
  }

  const handleRequestSort = (event, property) => {
    const isDesc = (order === 'desc');
    setOrder(isDesc ? 'asc' : 'desc');

    if (orderBy !== property) {
      setOrderBy(property);
    }
  };

  const handleClickOnRow = (event, item) => {
    setDetailItem(item);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleCreateClicked = (event) => {
    setCreateDialogOpen(true);
  }

  const handleBulkImportClicked = (event) => {
    setUploadFileDialogOpen(true);
  }

  const handleUpdateClicked = (event, item) => {
    setUpdateItem(item);
  }

  const handleDeleteClicked = (event, item) => {
    setDeleteConfirmationItem(item);
  }

  const handleCreateDialogClose = (event) => {
    delayedCloseCreatePanel(event, 500);
  }

  const delayedCloseCreatePanel = async (event, ms) => {
    await new Promise(resolve => {
      //set timeout
      window.setTimeout(function() {
        setCreateDialogOpen(false);
        resolve("ok");
      }, ms);
    });
  };

  const handleUpdateDialogClose = (event) => {
    delayedCloseUpdatePanel(event, 500);
  }

  const delayedCloseUpdatePanel = async (event, ms) => {
    await new Promise(resolve => {
      //set timeout
      window.setTimeout(function() {
        setUpdateDialogOpen(false);
        setUpdateItem(undefined);
        resolve("ok");
      }, ms);
    });
  };

  const handleDetailDialogClose = (event) => {
    delayedCloseDetailPanel(event, 500);
  }

  const delayedCloseDetailPanel = async (event, ms) => {
    await new Promise(resolve => {
      //set timeout
      window.setTimeout(function() {
        setDetailDialogOpen(false);
        setDetailItem(undefined);
        resolve("ok");
      }, ms);
    });
  };

  const handleDeleteConfirmationReject = (event) => {
    delayedCloseDeleteConfirmation(event, 500);
  }

  const delayedCloseDeleteConfirmation = async (event, ms) => {
    await new Promise(resolve => {
      //set timeout
      window.setTimeout(function() {
        setDeleteConfirmationDialogOpen(false);
        setDeleteConfirmationItem(undefined);
        resolve("ok");
      }, ms);
    });
  };

  const handleBulkUploadCancel = (event) => {
    delayedCloseBulkUploadDialog(event, 500);
  }

  const handleBulkUploadDone = (event) => {
    delayedCloseBulkUploadDialog(event, 500);
    getData();
  }

  const delayedCloseBulkUploadDialog = async (event, ms) => {
    await new Promise(resolve => {
      //set timeout
      window.setTimeout(function() {
        setUploadFileDialogOpen(false);
        resolve("ok");
      }, ms);
    });
  };

  const handleDeleteConfirmationAccept = (event, item) => {
    doDelete(event, item);
    delayedCloseDeleteConfirmation(event, 500);
  }

  const handleCreateOk = () => {
    getData();
  }

  return (
    <div className={classes.root}>
      <Grid container justify='center'>
        <Grid item xs={12} md={11} lg={10}>
          <Paper className={classes.paper}>

            {/* Toolbar */}
            <UserEnhancedTableToolbar
              search={search}
              onSearchEnter={handleSearchEnter}
              handleAddClicked={handleCreateClicked}
              handleBulkImportClicked={handleBulkImportClicked}
            />

            {/* Table */}
            <div className={classes.tableWrapper}>
              <Table stickyHeader size='medium'>

                {/* Table Head */}
                <UserEnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={count}
                  onRequestSort={handleRequestSort}
                />

                {/* Table Body */}

                {/* Case: show table body */}
                {(!isOnApiRequest && count > 0) && (
                  <Fade
                    in={true}
                    unmountOnExit
                  >
                    <TableBody>
                      {
                        items.map((item, index) => {
                          return ([
                            /*
                              Table Row
                            */
                            <TableRow
                              hover
                              onClick={event => handleClickOnRow(event, item)}
                              role="checkbox"
                              tabIndex={-1}
                              key={item.id}
                            >

                              {/* SeeInfo icon */}
                              <TableCell padding="checkbox">
                                <Tooltip title="View all info">
                                  <IconButton
                                    color="primary"
                                    onClick={event => {
                                      event.stopPropagation();
                                      handleClickOnRow(event, item);
                                    }}
                                  >
                                    <SeeInfo />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>

                              {/*
                                Actions:
                                - Edit
                                - Delete
                              */}
                              <TableCell padding='checkbox' align='center'>
                                <Tooltip title="Edit">
                                  <IconButton
                                    color="primary"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      handleUpdateClicked(event, item);
                                    }}
                                  >
                                    <Edit fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>

                              <TableCell padding='checkbox' align='center'>
                                <Tooltip title="Delete">
                                  <IconButton
                                    color="secondary"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      handleDeleteClicked(event, item);
                                    }}
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>

                              {/* Item fields */}

                              {/* id */}
                              <TableCell
                                key='id'
                                align='right'
                                padding="default"
                              >
                                {item.id}
                              </TableCell>

                              {/* email */}
                              <TableCell
                                key='email'
                                align='left'
                                padding="default"
                              >
                                {item.email}
                              </TableCell>

                              {/* password */}
                              <TableCell
                                key='password'
                                align='left'
                                padding="default"
                              >
                                {item.password}
                              </TableCell>
                            </TableRow>,
                          ]);
                        })
                      }
                    </TableBody>
                  </Fade>
                )}

                {/* Case: loading */}
                {(isOnApiRequest) && (
                  <Fade
                    in={true}
                    unmountOnExit
                  >
                    <TableBody>
                      <TableRow className={classes.loading}>
                        <TableCell colSpan={3 + 3}>
                          <Grid container>
                            <Grid item xs={12}>
                              <Grid container justify="center">
                                <Grid item>
                                  <CircularProgress color='primary' disableShrink />
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Fade>
                )}

                {/* Case: No data */}
                {(!isOnApiRequest && count === 0) && (
                  <Fade
                    in={true}
                    unmountOnExit
                  >
                    <TableBody>
                      <TableRow className={classes.noData}>
                        <TableCell colSpan={3 + 3}>
                          <Grid container>
                            <Grid item xs={12}>
                              <Grid container justify="center">
                                <Grid item>
                                  <Typography variant="body1" > No data to display </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Fade>
                )}
              </Table>
            </div>

            {/*
              Pagination
            */}
            <TablePagination
              rowsPerPageOptions={[10, 25, 50, 100]}
              component="div"
              count={count}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Dialog: Create Panel */}
      {(createDialogOpen) && (
        <UserCreatePanel
          handleClose={handleCreateDialogClose}
          handleOk={handleCreateOk}
        />
      )}

      {/* Dialog: Update Panel */}
      {(updateDialogOpen) && (
        <UserUpdatePanel
          item={updateItem}
          handleClose={handleUpdateDialogClose}
          handleOk={handleCreateOk}
        />
      )}

      {/* Dialog: Detail Panel */}
      {(detailDialogOpen) && (
        <UserDetailPanel
          item={detailItem}
          dialog={true}
          handleClose={handleDetailDialogClose}
        />
      )}

      {/* Dialog: Delete Confirmation */}
      {(deleteConfirmationDialogOpen) && (
        <UserDeleteConfirmationDialog
          item={deleteConfirmationItem}
          handleAccept={handleDeleteConfirmationAccept}
          handleReject={handleDeleteConfirmationReject}
        />
      )}

      {/* Dialog: Upload File */}
      {(uploadFileDialogOpen) && (
        <UserUploadFileDialog
          handleCancel={handleBulkUploadCancel}
          handleDone={handleBulkUploadDone}
        />
      )}
    </div>
  );
}