
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { blueGrey } from '@material-ui/core/colors';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import Snackbar from '../../../../../../../../../../snackbar/Snackbar';
import PropTypes from 'prop-types';
import { loadApi } from '../../../../../../../../../../../requests/requests.index.js';
import { makeCancelable } from '../../../../../../../../../../../utils'
import RolesToAddTransferViewToolbar from './components/RolesToAddTransferViewToolbar';
import RolesToAddTransferViewCursorPagination from './components/RolesToAddTransferViewCursorPagination';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import Hidden from '@material-ui/core/Hidden';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Add from '@material-ui/icons/AddCircle';
import Remove from '@material-ui/icons/RemoveCircle';
import TransferArrows from '@material-ui/icons/SettingsEthernetOutlined';
import Key from '@material-ui/icons/VpnKey';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
    [theme.breakpoints.down('xs')]: {
      minWidth: 200,
    },
    [theme.breakpoints.up('sm')]: {
      minWidth: 910,
    },
  },
  container: {
    margin: theme.spacing(0),
  },
  card: {
    margin: theme.spacing(0),
    height: 'auto',
    maxHeight: `calc(64vh + 52px)`,
    overflow: 'auto',
    position: "relative",
  },
  listBox: {
    height: 'auto',
    minHeight: 82,
    maxHeight: '33vh',
    overflowY: 'auto',
    overflowX: 'hidden'
  },
  noDataBox: {
    width: "100%",
    height: 'auto',
    minHeight: 82,
    maxHeight: '33vh',
  },
  loadingBox: {
    width: "100%",
    height: '100%',
    maxHeight: '33vh',
  },
  arrowsBox: {
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(0),
    
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(3),
    },
  },
  arrowsV: {
    transform: "rotate(90deg)",
  },
  row: {
    maxHeight: 70,
  },
}));

export default function RolesToAddTransferView(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const {
    item,
    idsToAdd,
    handleTransfer,
    handleUntransfer,
    handleClickOnRoleRow,
  } = props;

  /*
    State Table A (available)
  */
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(-1);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isOnApiRequest, setIsOnApiRequest] = useState(false);
  const [areItemsReady, setAreItemsReady] = useState(false);
  const [dataTrigger, setDataTrigger] = useState(false);
  const isPendingApiRequestRef = useRef(false);
  const isOnApiRequestRef = useRef(false);
  const isGettingFirstDataRef = useRef(true);
  const pageRef = useRef(0);
  const rowsPerPageRef = useRef(10);
  const lastFetchTime = useRef(null);
  const isCountingRef = useRef(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const pageInfo = useRef({startCursor: null, endCursor: null, hasPreviousPage: false, hasNextPage: false});
  const paginationRef = useRef({first: rowsPerPage, after: null, last: null, before: null, includeCursor: false});
  const isForwardPagination = useRef(true);
  const isCursorPaginating = useRef(false);
  const cancelableCountingPromises = useRef([]);

  /*
    State B (to add list)
  */
  const [itemsB, setItemsB] = useState([]);
  const [countB, setCountB] = useState(-1);
  const [searchB, setSearchB] = useState('');
  const [pageB, setPageB] = useState(0);
  const [rowsPerPageB, setRowsPerPageB] = useState(10);
  const [isOnApiRequestB, setIsOnApiRequestB] = useState(false);
  const [areItemsReadyB, setAreItemsReadyB] = useState(false);
  const [dataTriggerB, setDataTriggerB] = useState(false);
  const isPendingApiRequestRefB = useRef(false);
  const isOnApiRequestRefB = useRef(false);
  const isGettingFirstDataRefB = useRef(true);
  const pageRefB = useRef(0);
  const rowsPerPageRefB = useRef(10);
  const lastFetchTimeB = useRef(null);
  const isCountingRefB = useRef(false);
  const [hasPreviousPageB, setHasPreviousPageB] = useState(false);
  const [hasNextPageB, setHasNextPageB] = useState(false);
  const pageInfoB = useRef({startCursor: null, endCursor: null, hasPreviousPage: false, hasNextPage: false});
  const paginationRefB = useRef({first: rowsPerPage, after: null, last: null, before: null, includeCursor: false});
  const isForwardPaginationB = useRef(true);
  const isCursorPaginatingB = useRef(false);
  const cancelableCountingPromisesB = useRef([]);

  const [thereAreItemsToAdd, setThereAreItemsToAdd] = useState((idsToAdd && Array.isArray(idsToAdd) && idsToAdd.length > 0));
  const lidsToAdd = useRef((idsToAdd && Array.isArray(idsToAdd)) ? Array.from(idsToAdd) : []);

  const cancelablePromises = useRef([]);

  const graphqlServerUrl = useSelector(state => state.urls.graphqlServerUrl)
  const lastModelChanged = useSelector(state => state.changes.lastModelChanged);
  const lastChangeTimestamp = useSelector(state => state.changes.lastChangeTimestamp);
  const maxRecordLimit = useSelector(state => state.limits.maxRecordLimit);

  const lref = useRef(null);
  const lrefB = useRef(null);
  const [lh, setLh] = useState(82);
  const [lhB, setLhB] = useState(82);

  //snackbar
  const variant = useRef('info');
  const errors = useRef([]);
  const content = useRef((key, message) => (
    <Snackbar id={key} message={message} errors={errors.current}
    variant={variant.current} />
  ));
  const actionText = useRef(t('modelPanels.gotIt', "Got it"));
  const action = useRef((key) => (
    <>
      <Button color='inherit' variant='text' size='small' 
      onClick={() => { closeSnackbar(key) }}>
        {actionText.current}
      </Button>
    </> 
  ));

  //snackbar
  const variantB = useRef('info');
  const errorsB = useRef([]);
  const contentB = useRef((key, message) => (
    <Snackbar id={key} message={message} errors={errorsB.current}
    variant={variantB.current} />
  ));
  const actionTextB = useRef(t('modelPanels.gotIt', "Got it"));
  const actionB = useRef((key) => (
    <>
      <Button color='inherit' variant='text' size='small' 
      onClick={() => { closeSnackbar(key) }}>
        {actionTextB.current}
      </Button>
    </> 
  ));

  //snackbar (for: getCount)
  const variantC = useRef('info');
  const errorsC = useRef([]);
  const contentC = useRef((key, message) => (
    <Snackbar id={key} message={message} errors={errorsC.current}
    variant={variantC.current} />
  ));
  const actionTextC = useRef(t('modelPanels.gotIt', "Got it"));
  const actionC = useRef((key) => (
    <>
      <Button color='inherit' variant='text' size='small' 
      onClick={() => { closeSnackbar(key) }}>
        {actionTextC.current}
      </Button>
    </> 
  ));

  //snackbar (for: getCountB)
  const variantD = useRef('info');
  const errorsD = useRef([]);
  const contentD = useRef((key, message) => (
    <Snackbar id={key} message={message} errors={errorsD.current}
    variant={variantD.current} />
  ));
  const actionTextD = useRef(t('modelPanels.gotIt', "Got it"));
  const actionD = useRef((key) => (
    <>
      <Button color='inherit' variant='text' size='small' 
      onClick={() => { closeSnackbar(key) }}>
        {actionTextD.current}
      </Button>
    </> 
  ));


  /**
    * Callbacks:
    *  showMessage
    *  showMessageB
    *  showMessageC
    *  showMessageD
    *  configurePagination
    *  configurePaginationB
    *  onEmptyPage
    *  onEmptyPageB
    *  clearRequestGetData
    *  clearRequestGetDataB
    *  getCount
    *  getCountB
    *  getData
    *  getDataB
    */

  /**
   * showMessage
   * 
   * Show the given message in a notistack snackbar.
   * 
   */
  const showMessage = useCallback((message, withDetail) => {
    enqueueSnackbar( message, {
      variant: variant.current,
      preventDuplicate: false,
      persist: true,
      action: !withDetail ? action.current : undefined,
      content: withDetail ? content.current : undefined,
    });
  },[enqueueSnackbar]);

  /**
   * showMessageB
   * 
   * Show the given message in a notistack snackbar.
   * 
   */
  const showMessageB = useCallback((message, withDetail) => {
    enqueueSnackbar( message, {
      variant: variantB.current,
      preventDuplicate: false,
      persist: true,
      action: !withDetail ? actionB.current : undefined,
      content: withDetail ? contentB.current : undefined,
    });
  },[enqueueSnackbar]);

  /**
   * showMessageC
   * 
   * Show the given message in a notistack snackbar.
   * 
   */
  const showMessageC = useCallback((message, withDetail) => {
    enqueueSnackbar( message, {
      variant: variantC.current,
      preventDuplicate: false,
      persist: true,
      action: !withDetail ? actionC.current : undefined,
      content: withDetail ? contentC.current : undefined,
    });
  },[enqueueSnackbar]);

  /**
   * showMessageD
   * 
   * Show the given message in a notistack snackbar.
   * 
   */
  const showMessageD = useCallback((message, withDetail) => {
    enqueueSnackbar( message, {
      variant: variantD.current,
      preventDuplicate: false,
      persist: true,
      action: !withDetail ? actionD.current : undefined,
      content: withDetail ? contentD.current : undefined,
    });
  },[enqueueSnackbar]);


  /**
   * configurePagination
   * 
   * Set the configuration needed to perform a reload of data
   * in the given mode.
   */
  const configurePagination = useCallback((mode) => {
    switch(mode) {
      case "reset":
        //reset page info attributes
        pageInfo.current = {startCursor: null, endCursor: null, hasPreviousPage: false, hasNextPage: false};
        //set direction
        isForwardPagination.current = true;
        //set pagination attributes
        paginationRef.current = {
          first: rowsPerPageRef.current,
          after: null,
          last: null,
          before: null,
          includeCursor: false,
        }
        break;
      
      case "reload":
        //set direction
        isForwardPagination.current = true;
        //set pagination attributes
        paginationRef.current = {
          first: rowsPerPageRef.current,
          after: pageInfo.current.startCursor,
          last: null,
          before: null,
          includeCursor: true,
        }
        break;

      case "firstPage":
        //set direction
        isForwardPagination.current = true;
        //set pagination attributes
        paginationRef.current = {
          first: rowsPerPageRef.current,
          after: null,
          last: null,
          before: null,
          includeCursor: false,
        }
        break;

      case "lastPage":
        //set direction
        isForwardPagination.current = false;
        //set pagination attributes
        paginationRef.current = {
          first: null,
          after: null,
          last: rowsPerPageRef.current,
          before: null,
          includeCursor: false,
        }
        break;

      case "nextPage":
        //set direction
        isForwardPagination.current = true;
        //set pagination attributes
        paginationRef.current = {
          first: rowsPerPageRef.current,
          after: pageInfo.current.endCursor,
          last: null,
          before: null,
          includeCursor: false,
        }
        break;

      case "previousPage":
        //set direction
        isForwardPagination.current = false;
        //set pagination attributes
        paginationRef.current = {
          first: null,
          after: null,
          last: rowsPerPageRef.current,
          before: pageInfo.current.startCursor,
          includeCursor: false,
        }
        break;

      default: //reset
        //reset page info attributes
        pageInfo.current = {startCursor: null, endCursor: null, hasPreviousPage: false, hasNextPage: false};
        //set direction
        isForwardPagination.current = true;
        //set pagination attributes
        paginationRef.current = {
          first: rowsPerPageRef.current,
          after: null,
          last: null,
          before: null,
          includeCursor: false,
        }
        break;
    }
  }, []);

  /**
   * configurePaginationB
   * 
   * Set the configuration needed to perform a reload of data
   * in the given mode.
   */
  const configurePaginationB = useCallback((mode) => {
    switch(mode) {
      case "reset":
        //reset page info attributes
        pageInfoB.current = {startCursor: null, endCursor: null, hasPreviousPage: false, hasNextPage: false};
        //set direction
        isForwardPaginationB.current = true;
        //set pagination attributes
        paginationRefB.current = {
          first: rowsPerPageRefB.current,
          after: null,
          last: null,
          before: null,
          includeCursor: false,
        }
        break;
      
      case "reload":
        //set direction
        isForwardPaginationB.current = true;
        //set pagination attributes
        paginationRefB.current = {
          first: rowsPerPageRefB.current,
          after: pageInfoB.current.startCursor,
          last: null,
          before: null,
          includeCursor: true,
        }
        break;

      case "firstPage":
        //set direction
        isForwardPaginationB.current = true;
        //set pagination attributes
        paginationRefB.current = {
          first: rowsPerPageRefB.current,
          after: null,
          last: null,
          before: null,
          includeCursor: false,
        }
        break;

      case "lastPage":
        //set direction
        isForwardPaginationB.current = false;
        //set pagination attributes
        paginationRefB.current = {
          first: null,
          after: null,
          last: rowsPerPageRefB.current,
          before: null,
          includeCursor: false,
        }
        break;

      case "nextPage":
        //set direction
        isForwardPaginationB.current = true;
        //set pagination attributes
        paginationRefB.current = {
          first: rowsPerPageRefB.current,
          after: pageInfoB.current.endCursor,
          last: null,
          before: null,
          includeCursor: false,
        }
        break;

      case "previousPage":
        //set direction
        isForwardPaginationB.current = false;
        //set pagination attributes
        paginationRefB.current = {
          first: null,
          after: null,
          last: rowsPerPageRefB.current,
          before: pageInfoB.current.startCursor,
          includeCursor: false,
        }
        break;

      default: //reset
        //reset page info attributes
        pageInfoB.current = {startCursor: null, endCursor: null, hasPreviousPage: false, hasNextPage: false};
        //set direction
        isForwardPaginationB.current = true;
        //set pagination attributes
        paginationRefB.current = {
          first: rowsPerPageRefB.current,
          after: null,
          last: null,
          before: null,
          includeCursor: false,
        }
        break;
    }
  }, []);

  const onEmptyPage = useCallback((pi) => {
    //case: forward
    if(isForwardPagination.current) {
      if(pi && pi.hasPreviousPage) {
        //configure
        isOnApiRequestRef.current = false;
        isCursorPaginating.current = false;
        setIsOnApiRequest(false);
        configurePagination('previousPage');
        
        //reload
        setDataTrigger(prevDataTrigger => !prevDataTrigger);
        return;
      }
    } else {//case: backward
      if(pi && pi.hasNextPage) {
        //configure
        isOnApiRequestRef.current = false;
        isCursorPaginating.current = false;
        setIsOnApiRequest(false);
        configurePagination('nextPage');
        
        //reload
        setDataTrigger(prevDataTrigger => !prevDataTrigger);
        return;
      }
    }

    //update pageInfo
    pageInfo.current = pi;
    setHasPreviousPage(pageInfo.current.hasPreviousPage);
    setHasNextPage(pageInfo.current.hasNextPage);

    //configure pagination (default)
    configurePagination('reload');

    //ok
    setItems([]);

    //ends request
    isOnApiRequestRef.current = false;
    isCursorPaginating.current = false;
    setIsOnApiRequest(false);
    return;

  }, [configurePagination]);

  const onEmptyPageB = useCallback((pi) => {
    //case: forward
    if(isForwardPaginationB.current) {
      if(pi && pi.hasPreviousPage) {
        //configure
        isOnApiRequestRefB.current = false;
        isCursorPaginatingB.current = false;
        setIsOnApiRequestB(false);
        configurePaginationB('previousPage');
        
        //reload
        setDataTriggerB(prevDataTriggerB => !prevDataTriggerB);
        return;
      } 
    } else {//case: backward
      if(pi && pi.hasNextPage) {
        //configure
        isOnApiRequestRefB.current = false;
        isCursorPaginatingB.current = false;
        setIsOnApiRequestB(false);
        configurePaginationB('nextPage');
        
        //reload
        setDataTriggerB(prevDataTriggerB => !prevDataTriggerB);
        return;
      }
    }

    //update pageInfo
    pageInfoB.current = pi;
    setHasPreviousPageB(pageInfoB.current.hasPreviousPage);
    setHasNextPageB(pageInfoB.current.hasNextPage);

    //configure pagination (default)
    configurePaginationB('reload');

    //ok
    setItemsB([]);

    //ends request
    isOnApiRequestRefB.current = false;
    isCursorPaginatingB.current = false;
    setIsOnApiRequestB(false);
    return;

  }, [configurePaginationB]);

  const clearRequestGetData = useCallback(() => {
    //configure pagination
    configurePagination('reset');
          
    setItems([]);
    isOnApiRequestRef.current = false;
    setIsOnApiRequest(false);
  },[configurePagination]);

  const clearRequestGetDataB = useCallback(() => {
    //configure pagination
    configurePaginationB('reset');
  
    setItemsB([]);
    isOnApiRequestRefB.current = false;
    setIsOnApiRequestB(false);
  },[configurePaginationB]);


  /**
   * getCount
   * 
   * Get @count from GrahpQL Server.
   * Uses current state properties to fill query request.
   * Updates state to inform new @count retreived.
   * 
   */
  const getCount = useCallback(async () => {
    //return if there is an active count operation
    if(isCountingRef.current) return;

    cancelCountingPromises();
    isCountingRef.current = true;
    errorsC.current = [];

    let ops = null;
    if(lidsToAdd.current && lidsToAdd.current.length > 0) {
      ops = {
        exclude: [{
          type: 'Int',
          values: {"id": lidsToAdd.current}
        }]
      };
    }    

    /*
      API Request: api.user.getNotAssociatedRolesCount
    */
    let api = await loadApi("user");
    if(!api) {
      let newError = {};
      let withDetails=true;
      variantC.current='error';
      newError.message = t('modelPanels.messages.apiCouldNotLoaded', "API could not be loaded");
      newError.details = t('modelPanels.messages.seeConsoleError', "Please see console log for more details on this error");
      errorsC.current.push(newError);
      showMessageC(newError.message, withDetails);
      return;
    }

    let cancelableApiReq = makeCancelable(api.user.getNotAssociatedRolesCount(graphqlServerUrl, item.id, search, ops));
    cancelableCountingPromises.current.push(cancelableApiReq);
    await cancelableApiReq
      .promise
      .then(
      //resolved
      (response) => {
        //delete from cancelables
        cancelableCountingPromises.current.splice(cancelableCountingPromises.current.indexOf(cancelableApiReq), 1);
        
        //check: response data
        if(response.message === 'ok') {
          //check: graphql errors
          if(response.graphqlErrors) {
            let newError = {};
            let withDetails=true;
            variantC.current='info';
            newError.message = t('modelPanels.errors.data.e3', 'fetched with errors.');
            newError.locations=[{model: 'user', association: 'roles', table:'A', method: 'getCount()', request: 'api.user.getNotAssociatedRolesCount'}];
            newError.path=['update', `id:${item.id}`, 'add', 'roles'];
            newError.extensions = {graphQL:{data:response.data, errors:response.graphqlErrors}};
            errorsC.current.push(newError);
            console.log("Error: ", newError);

            showMessageC(newError.message, withDetails);
          }
        } else { //not ok
          //show error
          let newError = {};
          let withDetails=true;
          variantC.current='error';
          newError.message = t(`modelPanels.errors.data.${response.message}`, 'Error: '+response.message);
          newError.locations=[{model: 'user', association: 'roles', table:'A', method: 'getCount()', request: 'api.user.getNotAssociatedRolesCount'}];
          newError.path=['update', `id:${item.id}`, 'add', 'roles'];
          newError.extensions = {graphqlResponse:{data:response.data, errors:response.graphqlErrors}};
          errorsC.current.push(newError);
          console.log("Error: ", newError);

          showMessageC(newError.message, withDetails);
          return;
        }

          //ok
          setCount(response.value);
          isCountingRef.current = false;

          return;
      },
      //rejected
      (err) => {
        if(err.isCanceled) return;
        else throw err;
      })
      //error
      .catch((err) => { //error: on api.user.getNotAssociatedRolesCount
        if(err.isCanceled) {
          return;
        } else {
          //show error
          let newError = {};
          let withDetails=true;
          variantC.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'user', association: 'roles', table:'A', method: 'getCount()', request: 'api.user.getNotAssociatedRolesCount'}];
          newError.path=['update', `id:${item.id}`, 'add', 'roles'];
          newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
          errorsC.current.push(newError);
          console.log("Error: ", newError);

          showMessageC(newError.message, withDetails);
          return;
        }
      });
  }, [graphqlServerUrl, showMessageC, t, item.id, search]);

  /**
   * getData
   * 
   * Get @items from GrahpQL Server.
   * Uses current state properties to fill query request.
   * Updates state to inform new @items retreived.
   * 
   */
  const getData = useCallback(async () => {
    updateHeights();
    isOnApiRequestRef.current = true;
    setIsOnApiRequest(true);
    Boolean(dataTrigger); //avoid warning
    errors.current = [];

    //count (async)
    getCount();

    let ops = null;
    if(lidsToAdd.current && lidsToAdd.current.length > 0) {
      ops = {
        exclude: [{
          type: 'Int',
          values: {"id": lidsToAdd.current}
        }]
      };
    }    

    let variables = {
      pagination: {...paginationRef.current}
    };
    /*
      API Request: api.user.getNotAssociatedRoles
    */
    let api = await loadApi("user");
    if(!api) {
      let newError = {};
      let withDetails=true;
      variant.current='error';
      newError.message = t('modelPanels.messages.apiCouldNotLoaded', "API could not be loaded");
      newError.details = t('modelPanels.messages.seeConsoleError', "Please see console log for more details on this error");
      errors.current.push(newError);
      showMessage(newError.message, withDetails);
      clearRequestGetData();
      return;
    }

    let cancelableApiReq = makeCancelable(api.user.getNotAssociatedRoles(
      graphqlServerUrl,
      item.id,
      search,
      variables,
      ops,
      maxRecordLimit ? Math.floor(maxRecordLimit/2) : 5, //batch size
    ));
    cancelablePromises.current.push(cancelableApiReq);
    await cancelableApiReq
      .promise
      .then(
      //resolved
      (response) => {
        //delete from cancelables
        cancelablePromises.current.splice(cancelablePromises.current.indexOf(cancelableApiReq), 1);
        
        //check: response data
        if(response.message === 'ok') {
          //check: graphql errors
          if(response.graphqlErrors) {
            let newError = {};
            let withDetails=true;
            variant.current='info';
            newError.message = t('modelPanels.errors.data.e3', 'fetched with errors.');
            newError.locations=[{model: 'user', association: 'roles', table:'A', method: 'getData()', request: 'api.user.getNotAssociatedRoles'}];
            newError.path=['update', `id:${item.id}`, 'add', 'roles'];
            newError.extensions = {graphQL:{data:response.data, errors:response.graphqlErrors}};
            errors.current.push(newError);
            console.log("Error: ", newError);

            showMessage(newError.message, withDetails);
          }
        } else {
          //show error
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t(`modelPanels.errors.data.${response.message}`, 'Error: '+response.message);
          newError.locations=[{model: 'user', association: 'roles', table:'A', method: 'getData()', request: 'api.user.getNotAssociatedRoles'}];
          newError.path=['update', `id:${item.id}`, 'add', 'roles'];
          newError.extensions = {graphqlResponse:{data:response.data, errors:response.graphqlErrors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestGetData();
          return;
        }

          //get items
          let its = response.value.edges.map(o => o.node);
          let pi = response.value.pageInfo;
          
          /*
            Check: empty page
          */
          if( its.length === 0 ) 
          {
            onEmptyPage(pi);
            return;
          }

          //update pageInfo
          pageInfo.current = pi;
          setHasPreviousPage(pageInfo.current.hasPreviousPage);
          setHasNextPage(pageInfo.current.hasNextPage);

          //configure pagination (default)
          configurePagination('reload');

          //ok
          setItems([...its]);

          //ends request
          isOnApiRequestRef.current = false;
          isCursorPaginating.current = false;
          setIsOnApiRequest(false);
          return;
      },
      //rejected
      (err) => {
        if(err.isCanceled) return;
        else throw err;
      })
      //error
      .catch((err) => { //error: on api.user.getNotAssociatedRoles
        if(err.isCanceled) {
          return;
        } else {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'user', association: 'roles', table:'A', method: 'getData()', request: 'api.user.getNotAssociatedRoles'}];
          newError.path=['update', `id:${item.id}`, 'add', 'roles'];
          newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          clearRequestGetData();
          return;
        }
      });
  }, [graphqlServerUrl, showMessage, clearRequestGetData, getCount, t, item.id, dataTrigger, search, configurePagination, onEmptyPage, maxRecordLimit]);

  /**
   * getCountB
   * 
   * Get @count from GrahpQL Server.
   * Uses current state properties to fill query request.
   * Updates state to inform new @count retreived.
   * 
   */
  const getCountB = useCallback(async () => {
    //return if there is an active count operation
    if(isCountingRefB.current) return;

    cancelCountingPromisesB();
    isCountingRefB.current = true;
    errorsD.current = [];

    //set ops: only ids
    let ops = null;
    if(lidsToAdd.current && lidsToAdd.current.length > 0) {
      ops = {
        only: [{
          type: 'Int',
          values: {"id": lidsToAdd.current}
        }]
      };
    } else {
      isCountingRefB.current = false;
      return;
    }

    /*
      API Request: api.role.getCountItems
    */
    let api = await loadApi("role");
    if(!api) {
      let newError = {};
      let withDetails=true;
      variantD.current='error';
      newError.message = t('modelPanels.messages.apiCouldNotLoaded', "API could not be loaded");
      newError.details = t('modelPanels.messages.seeConsoleError', "Please see console log for more details on this error");
      errorsD.current.push(newError);
      showMessageD(newError.message, withDetails);
      return;
    }

    let cancelableApiReq = makeCancelable(api.role.getCountItems(graphqlServerUrl, searchB, ops));
    cancelableCountingPromisesB.current.push(cancelableApiReq);
    await cancelableApiReq
      .promise
      .then(
      //resolved
      (response) => {
        //delete from cancelables
        cancelableCountingPromisesB.current.splice(cancelableCountingPromisesB.current.indexOf(cancelableApiReq), 1);
        //check: response
        if(response.message === 'ok') {
          //check: graphql errors
          if(response.graphqlErrors) {
            let newError = {};
            let withDetails=true;
            variantD.current='info';
            newError.message = t('modelPanels.errors.data.e3', 'fetched with errors.');
            newError.locations=[{model: 'user', association: 'roles', table:'B', method: 'getCountB()', request: 'api.role.getCountItems'}];
            newError.path=['update', `id:${item.id}`, 'add', 'roles'];          
            newError.extensions = {graphQL:{data:response.data, errors:response.graphqlErrors}};
            errorsD.current.push(newError);
            console.log("Error: ", newError);

            showMessageD(newError.message, withDetails);
          }
        } else { //not ok
          //show error
          let newError = {};
          let withDetails=true;
          variantD.current='error';
          newError.message = t(`modelPanels.errors.data.${response.message}`, 'Error: '+response.message);
          newError.locations=[{model: 'user', association: 'roles', table:'B', method: 'getCountB()', request: 'api.role.getCountItems'}];
          newError.path=['update', `id:${item.id}`, 'add', 'roles'];          
          newError.extensions = {graphqlResponse:{data:response.data, errors:response.graphqlErrors}};
          errorsD.current.push(newError);
          console.log("Error: ", newError);
 
          showMessageD(newError.message, withDetails);
          return;
        }

        //ok
        setCountB(response.value);
        isCountingRefB.current = false;
      return;
    },
    //rejected
    (err) => {
      if(err.isCanceled) return;
      else throw err;
    })
    //error
    .catch((err) => { //error: on api.role.getCountItems
      if(err.isCanceled) {
        return;
      } else {
        let newError = {};
        let withDetails=true;
        variantD.current='error';
        newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
        newError.locations=[{model: 'user', association: 'roles', table:'B', method: 'getCountB()', request: 'api.role.getCountItems'}];
        newError.path=['update', `id:${item.id}`, 'add', 'roles'];
        newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
        errorsD.current.push(newError);
        console.log("Error: ", newError);

        showMessageD(newError.message, withDetails);
        return;
      }
    });
  }, [graphqlServerUrl, showMessageD, t, item.id, searchB]);

  /**
   * getDataB
   * 
   * Get @items from GrahpQL Server.
   * Uses current state properties to fill query request.
   * Updates state to inform new @items retreived.
   * 
   */
  const getDataB = useCallback(async () => {
    updateHeights();
    isOnApiRequestRefB.current = true;
    setIsOnApiRequestB(true);
    Boolean(dataTriggerB); //avoid warning
    errorsB.current = [];

    //count (async)
    getCountB();

    //set ops: only ids
    let ops = null;
    if(lidsToAdd.current && lidsToAdd.current.length > 0) {
      ops = {
        only: [{
          type: 'Int',
          values: {"id": lidsToAdd.current}
        }]
      };
    } else {
      clearRequestGetDataB();
      setThereAreItemsToAdd(false);
      return;
    }

    let variables = {
      pagination: {...paginationRefB.current}
    };
    /*
      API Request: api.role.getItems
    */
    let api = await loadApi("role");
    if(!api) {
      let newError = {};
      let withDetails=true;
      variantB.current='error';
      newError.message = t('modelPanels.messages.apiCouldNotLoaded', "API could not be loaded");
      newError.details = t('modelPanels.messages.seeConsoleError', "Please see console log for more details on this error");
      errorsB.current.push(newError);
      showMessageB(newError.message, withDetails);
      clearRequestGetDataB();
      return;
    }

    let cancelableApiReq = makeCancelable(api.role.getItems(
      graphqlServerUrl,
      searchB,
      null, //orderBy
      null, //orderDirection
      variables,
      ops
    ));
    cancelablePromises.current.push(cancelableApiReq);
    await cancelableApiReq
      .promise
      .then(
      //resolved
      (response) => {
        //delete from cancelables
        cancelablePromises.current.splice(cancelablePromises.current.indexOf(cancelableApiReq), 1);
        //check: response
        if(response.message === 'ok') {
          //check: graphql errors
          if(response.graphqlErrors) {
            let newError = {};
            let withDetails=true;
            variantB.current='info';
            newError.message = t('modelPanels.errors.data.e3', 'fetched with errors.');
            newError.locations=[{model: 'user', association: 'roles', table:'B', method: 'getDataB()', request: 'api.role.getItems'}];
            newError.path=['update', `id:${item.id}`, 'add', 'roles'];
            newError.extensions = {graphQL:{data:response.data, errors:response.graphqlErrors}};
            errorsB.current.push(newError);
            console.log("Error: ", newError);

            showMessageB(newError.message, withDetails);
          }
        } else { //not ok
          //show error
          let newError = {};
          let withDetails=true;
          variantB.current='error';
          newError.message = t(`modelPanels.errors.data.${response.message}`, 'Error: '+response.message);
          newError.locations=[{model: 'user', association: 'roles', table:'B', method: 'getDataB()', request: 'api.role.getItems'}];
          newError.path=['update', `id:${item.id}`, 'add', 'roles'];
          newError.extensions = {graphqlResponse:{data:response.data, errors:response.graphqlErrors}};
          errorsB.current.push(newError);
          console.log("Error: ", newError);
 
          showMessageB(newError.message, withDetails);
          clearRequestGetDataB();
          return;
        }
        
        //get items
        let its = response.value.edges.map(o => o.node);
        let pi = response.value.pageInfo;
        /*
          Check: empty page
        */
        if( its.length === 0 ) 
        {
          onEmptyPageB(pi);
          return;
        }

        //update pageInfo
        pageInfoB.current = pi;
        setHasPreviousPageB(pageInfoB.current.hasPreviousPage);
        setHasNextPageB(pageInfoB.current.hasNextPage);

        //configure pagination (default)
        configurePaginationB('reload');
          
        //ok
        setItemsB([...its]);

        //ends request
        isOnApiRequestRefB.current = false;
        isCursorPaginatingB.current = false;
        setIsOnApiRequestB(false);
        return;
      },
      //rejected
      (err) => {
        if(err.isCanceled) return;
        else throw err;
      })
      //error
      .catch((err) => { //error: on api.role.getItems
        if(err.isCanceled) {
          return;
        } else {
          let newError = {};
          let withDetails=true;
          variantB.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'user', association: 'roles', table:'B', method: 'getDataB()', request: 'api.role.getItems'}];
          newError.path=['update', `id:${item.id}`, 'add', 'roles'];
          newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
          errorsB.current.push(newError);
          console.log("Error: ", newError);

          showMessageB(newError.message, withDetails);
          clearRequestGetDataB();
          return;
        }
      });
  }, [graphqlServerUrl, showMessageB, clearRequestGetDataB, t, item.id, dataTriggerB, searchB, getCountB, configurePaginationB, onEmptyPageB]);

  /**
   * Effects
   */
  useEffect(() => {

    //cleanup on unmounted.
    return function cleanup() {
      cancelablePromises.current.forEach(p => p.cancel());
      cancelablePromises.current = [];
      cancelableCountingPromises.current.forEach(p => p.cancel());
      cancelableCountingPromises.current = [];
      cancelableCountingPromisesB.current.forEach(p => p.cancel());
      cancelableCountingPromisesB.current = [];
    };
  }, []);
  
  useEffect(() => {
    if (!isOnApiRequestRef.current) {
      getData();
    } 
    else { 
      isPendingApiRequestRef.current = true; 
    }
  }, [getData]);

  useEffect(() => {
    if (!isOnApiRequestRefB.current) {
      getDataB();
    } 
    else { 
      isPendingApiRequestRefB.current = true; 
    }
  }, [getDataB]);

  useEffect(() => {
    /*
     * Handle changes 
     */
    
    /*
     * Checks
     */
    if(!lastModelChanged) {
      return;
    }
    if(!lastChangeTimestamp || !lastFetchTime.current || !lastFetchTimeB.current) {
      return;
    }
    let isNewChangeOnA = (lastFetchTime.current<lastChangeTimestamp);
    let isNewChangeOnB = (lastFetchTimeB.current<lastChangeTimestamp);
    if(!isNewChangeOnA && !isNewChangeOnB) {
      return;
    }

    /*
     * Update timestamps
     */
    lastFetchTime.current = Date.now();
    lastFetchTimeB.current = Date.now();

    /*
     * Case 1: 
     * The relation 'roles' for this item was updated.
     * That is to say that the current item was associated or dis-associated with some 'roles', 
     * from this relation (in another place).
     * 
     * Actions:
     * - remove any associated internalId from idsToAdd[]
     * - update associatedIds[].
     * - reload both transfer tables.
     * - return
     */
    if(lastModelChanged.user&&
        lastModelChanged.user[String(item.id)]&&
        lastModelChanged.user[String(item.id)].changedAssociations&&
        lastModelChanged.user[String(item.id)].changedAssociations.role_to_user&&
        (lastModelChanged.user[String(item.id)].changedAssociations.role_to_user.added ||
         lastModelChanged.user[String(item.id)].changedAssociations.role_to_user.removed)) {
          
          //remove any associated internalId from idsToAdd[] & update counts
          let idsAdded = lastModelChanged.user[String(item.id)].changedAssociations.role_to_user.idsAdded;
          if(idsAdded) {
            idsAdded.forEach( (idAdded) => {
              //remove from lidsToAdd
              let iof = lidsToAdd.current.indexOf(idAdded);
              if(iof !== -1) { 
                lidsToAdd.current.splice(iof, 1);
                if(lidsToAdd.current.length === 0) {
                  setThereAreItemsToAdd(false);
                }
                handleUntransfer('roles', idAdded);
                //decrement B
                setCountB(countB-1);
              }
              //decrement A
              setCount(count-1);
            });
          }

          //update count for each dis-associated internalId from idsToAdd[]
          let idsRemoved = lastModelChanged.user[String(item.id)].changedAssociations.role_to_user.idsRemoved;
          if(idsRemoved) {
            //increment A
            setCount(count+idsRemoved.length);

          }

          //will count A
          cancelCountingPromises();
          isCountingRef.current = false;
          //will count B
          cancelCountingPromisesB();
          isCountingRefB.current = false;

          //strict contention
          if (!isOnApiRequestRef.current && !isCursorPaginating.current) {
            //configure A
            configurePagination('reload');
            //reload A
            setDataTrigger(prevDataTrigger => !prevDataTrigger);
          } else {
            getCount();
          }
          //strict contention
          if (!isOnApiRequestRefB.current && !isCursorPaginatingB.current) {
            //configure B
            configurePaginationB('reload');
            //reload B
            setDataTriggerB(prevDataTriggerB => !prevDataTriggerB);
          } else {
            getCountB();
          }
          return;
    }//end: Case 1

    /*
     * Case 2: 
     * The relation 'roles' for this item was updated from the target model (in the peer relation).
     * That is to say that this current item was associated or dis-associated with some 'role',
     * but this action happened on the peer relation, identified by 'role_to_user'.
     * 
     * Conditions:
     * A: the current item internalId is in the removedIds of the updated 'role'.
     * B: the current item internalId is in the addedIds of the updated 'role'.
     * 
     * Actions:
     * if A:
     * - update associatedIds[].
     * - reload both transfer tables.
     * - return
     * 
     * else if B:
     * - remove the internalId of the 'role' from idsToAdd[].
     * - update associatedIds[].
     * - reload both transfer tables.
     * - return
     */
    if(lastModelChanged.role) {
      let oens = Object.entries(lastModelChanged.role);
      oens.forEach( (entry) => {
        if(entry[1].changedAssociations&&
          entry[1].changedAssociations.role_to_user) {

            //case A: this item was removed from peer relation.
            if(entry[1].changedAssociations.role_to_user.removed) {
              let idsRemoved = entry[1].changedAssociations.role_to_user.idsRemoved;
              if(idsRemoved) {
                let iof = idsRemoved.indexOf(item.id);
                if(iof !== -1) {

                  //increment A
                  setCount(count+1);

                  //will count A
                  cancelCountingPromises();
                  isCountingRef.current = false;
                  //will count B
                  cancelCountingPromisesB();
                  isCountingRefB.current = false;

                  //strict contention reload
                  if (!isOnApiRequestRef.current && !isCursorPaginating.current) {
                    //configure A
                    configurePagination('reload');
                    //reload A
                    setDataTrigger(prevDataTrigger => !prevDataTrigger);
                  } else {
                    getCount();
                  }
                  //strict contention reload
                  if (!isOnApiRequestRefB.current && !isCursorPaginatingB.current) {
                    //configure B
                    configurePaginationB('reload');
                    //reload B
                    setDataTriggerB(prevDataTriggerB => !prevDataTriggerB);
                  } else {
                    getCountB();
                  }
                  return;
                }
              }
            }//end: case A

            //case B: this item was added on peer relation.
            if(entry[1].changedAssociations.role_to_user.added) {
              let idsAdded = entry[1].changedAssociations.role_to_user.idsAdded;
              if(idsAdded) {
                let iof = idsAdded.indexOf(item.id);
                if(iof !== -1) {
                  //remove changed item from lidsToAdd
                  let idAdded = entry[1].newItem.id;
                  let iofB = lidsToAdd.current.indexOf(idAdded);
                  if(iofB !== -1) {
                    lidsToAdd.current.splice(iofB, 1);
                    if(lidsToAdd.current.length === 0) {
                      setThereAreItemsToAdd(false);
                    }
                    //decrement B
                    setCountB(countB-1);
                  }
                  handleUntransfer('roles', idAdded);
                  //decrement A
                  setCount(count-1);

                  //will count A
                  cancelCountingPromises();
                  isCountingRef.current = false;
                  //will count B
                  cancelCountingPromisesB();
                  isCountingRefB.current = false;

                  //strict contention
                  if (!isOnApiRequestRef.current && !isCursorPaginating.current) {
                    //configure A
                    configurePagination('reload');
                    //reload A
                    setDataTrigger(prevDataTrigger => !prevDataTrigger);
                  } else {
                    getCount();
                  }
                  //strict contention
                  if (!isOnApiRequestRefB.current && !isCursorPaginatingB.current) {
                    //configure B
                    configurePaginationB('reload');
                    //reload B
                    setDataTriggerB(prevDataTriggerB => !prevDataTriggerB);
                  } else {
                    getCountB();
                  }
                  return;
                }
              }
            }//end: case B
        }
      })
    }//end: Case 2

    /*
     * Case 3: 
     * The attributes of some 'role' were modified or the item was deleted.
     * 
     * Conditions:
     * A: the item was modified and is currently displayed in any of the lists.
     * B: the item was deleted and is currently displayed in any of the lists or associated ids.
     * 
     * Actions:
     * if A:
     * - update the list with the new item.
     * - return
     * 
     * if B:
     * - remove the deleted internalId from idsToAdd[]
     * - update associatedIds[].
     * - reload both transfer tables.
     * - return
     */
    if(lastModelChanged.role) {

      let oens = Object.entries(lastModelChanged.role);
      oens.forEach( (entry) => {
        //case A: updated
        if(entry[1].op === "update"&&entry[1].newItem) {
          let idUpdated = entry[1].item.id;
          
          //lookup item on table A
          let nitemsA = Array.from(items);
          let iofA = nitemsA.findIndex((item) => item.id===idUpdated);
          if(iofA !== -1) {
            //set new item
            nitemsA[iofA] = entry[1].newItem;
            setItems(nitemsA);
          }

          //lookup item on table B
          let nitemsB = Array.from(itemsB);
          let iofB = nitemsB.findIndex((item) => item.id===idUpdated);
          if(iofB !== -1) {
            //set new item
            nitemsB[iofB] = entry[1].newItem;
            setItemsB(nitemsB);
          }

          return;
        }

        //case B: deleted
        if(entry[1].op === "delete") {
          let idRemoved = entry[1].item.id;

          //lookup item on table A
          let iofA = items.findIndex((item) => item.id===idRemoved);
          if(iofA !== -1) {
            //decrement A
            setCount(count-1);
          }

          //lookup item on table B
          let iofB = itemsB.findIndex((item) => item.id===idRemoved);
          if(iofB !== -1) {
            //decrement B
            setCountB(countB-1);
          }

          //lookup item on ids to add
          let iofD = lidsToAdd.current.indexOf(idRemoved);
          //remove deleted item from lidsToAdd
          if(iofD !== -1) {
            lidsToAdd.current.splice(iofD, 1);
            if(lidsToAdd.current.length === 0) {
              setThereAreItemsToAdd(false);
            }
            if(iofB === -1) {
              //decrement B
              setCountB(countB-1);
            }
          }
          handleUntransfer('roles', idRemoved);


          //will count A
          cancelCountingPromises();
          isCountingRef.current = false;
          //will count B
          cancelCountingPromisesB();
          isCountingRefB.current = false;

          //strict contention
          if (!isOnApiRequestRef.current && !isCursorPaginating.current) {
            //configure A
            configurePagination('reload');
            //reload A
            setDataTrigger(prevDataTrigger => !prevDataTrigger);
          } else {
            getCount();
          }
          //strict contention
          if (!isOnApiRequestRefB.current && !isCursorPaginatingB.current) {
            //configure B
            configurePaginationB('reload');
            //reload B
            setDataTriggerB(prevDataTriggerB => !prevDataTriggerB);
          } else {
            getCountB();
          }
          return;
        }
      });
    }//end: Case 3
  }, [lastModelChanged, lastChangeTimestamp, items, itemsB, item.id, handleUntransfer, getCount, count, getCountB, countB, configurePagination, configurePaginationB]);

  useEffect(() => {
    //return if this flag is set
    if(isGettingFirstDataRef.current) { 
      isGettingFirstDataRef.current = false; 
      return; 
    } 
    else {
      //get data from the new page
      pageRef.current = page;
      if (!isOnApiRequestRef.current) {
        setDataTrigger(prevDataTrigger => !prevDataTrigger); 
      } 
      else { 
        isPendingApiRequestRef.current = true; 
      }
    }
  }, [page]);

  useEffect(() => {
    //return on first render
    if(isGettingFirstDataRefB.current) { 
      isGettingFirstDataRefB.current = false; 
      return; 
    } 
    else {
      //get data from the new page
      pageRefB.current = pageB;
      if (!isOnApiRequestRefB.current) {
        setDataTriggerB(prevDataTriggerB => !prevDataTriggerB); 
      } 
      else { 
        isPendingApiRequestRefB.current = true; 
      }
    }
  }, [pageB]);

  useEffect(() => {
    //update ref
    rowsPerPageRef.current = rowsPerPage;

    //check strict contention
    if(isOnApiRequestRef.current || isCursorPaginating.current) { return; }
    //set strict contention
    isCursorPaginating.current = true;
    
    //configure pagination
    configurePagination('reset');
    //reload    
    setDataTrigger(prevDataTrigger => !prevDataTrigger);
  }, [rowsPerPage, configurePagination]);

  useEffect(() => {
    //update ref
    rowsPerPageRefB.current = rowsPerPageB;

    //check strict contention
    if(isOnApiRequestRefB.current || isCursorPaginatingB.current) { return; }
    //set strict contention
    isCursorPaginatingB.current = true;
    
    //configure pagination
    configurePaginationB('reset');
    //reload    
    setDataTriggerB(prevDataTriggerB => !prevDataTriggerB);
  }, [rowsPerPageB, configurePaginationB]);

  useEffect(() => {
    if (!isOnApiRequest && isPendingApiRequestRef.current) {
      isPendingApiRequestRef.current = false;
      //configure
      configurePagination('reload');
      //reload
      setDataTrigger(prevDataTrigger => !prevDataTrigger);
    }
    updateHeights();
  }, [isOnApiRequest, configurePagination]);

  useEffect(() => {
    if (!isOnApiRequestB && isPendingApiRequestRefB.current) {
      isPendingApiRequestRefB.current = false;
      //configure
      configurePaginationB('reload');
      //reload
      setDataTriggerB(prevDataTriggerB => !prevDataTriggerB);
    }
    updateHeights();
  }, [isOnApiRequestB, configurePaginationB]);

  useEffect(() => {
    if(Array.isArray(items) && items.length > 0) { 
      setAreItemsReady(true); 
    } else { 
      setAreItemsReady(false); 
    }
    lastFetchTime.current = Date.now();
  }, [items]);

  useEffect(() => {
    if(Array.isArray(itemsB) && itemsB.length > 0) { 
      setAreItemsReadyB(true); 
    } else { 
      setAreItemsReadyB(false); 
    }
    lastFetchTimeB.current = Date.now();
  }, [itemsB]);

  /**
   * Utils
   */
  function cancelCountingPromises() {
    cancelableCountingPromises.current.forEach(p => p.cancel());
    cancelableCountingPromises.current = [];    
  }

  function cancelCountingPromisesB() {
    cancelableCountingPromisesB.current.forEach(p => p.cancel());
    cancelableCountingPromisesB.current = [];    
  }

function updateHeights() {
  if(lref.current) {
    let h =lref.current.clientHeight;
    setLh(h);
  }
  if(lrefB.current) {
    let hb =lrefB.current.clientHeight;
    setLhB(hb);
  }
}


  function reloadDataA() {
    //configure A
    configurePagination('reload');
    //reload A
    setDataTrigger(prevDataTrigger => !prevDataTrigger);
  }

  function reloadDataB() {
    //configure B
    configurePaginationB('reload');    
    //reload B
    setDataTriggerB(prevDataTriggerB => !prevDataTriggerB);
  }

  /**
   * Handlers
   */

  /*
   * Search handlers
   */
  const handleSearchEnter = text => {
    if(text !== search)
    {
      if(page !== 0) {
        isGettingFirstDataRef.current = true; //avoids to get data on [page] effect
        setPage(0);
      }

      setCount(-1);
      //will count
      cancelCountingPromises();
      isCountingRef.current = false;

      setSearch(text);
    }
  };

  const handleSearchEnterB = text => {
    if(text !== searchB)
    {
      if(pageB !== 0) {
        isGettingFirstDataRefB.current = true; //avoids to get data on [pageB] effect
        setPageB(0);
      }
      setCountB(-1);
      //will count
      cancelCountingPromisesB();
      isCountingRefB.current = false;

      setSearchB(text);
    }
  };

  /*
   * Pagination handlers
   */

  const handleFirstPageButtonClick = (event) => {
    //strict contention
    if (isOnApiRequestRef.current || isCursorPaginating.current) { return; }
    //set strict contention
    isCursorPaginating.current = true;
    //configure A
    configurePagination('firstPage');
    //reload A
    setDataTrigger(prevDataTrigger => !prevDataTrigger);
  };

  const handleFirstPageButtonClickB = (event) => {
    //strict contention
    if (isOnApiRequestRefB.current || isCursorPaginatingB.current) { return; }
    //set strict contention
    isCursorPaginatingB.current = true;
    //configure B
    configurePaginationB('firstPage');
    //reload B
    setDataTriggerB(prevDataTriggerB => !prevDataTriggerB);
  };

  const handleLastPageButtonClick = (event) => {
    //strict contention
    if (isOnApiRequestRef.current || isCursorPaginating.current) { return; }
    //set strict contention
    isCursorPaginating.current = true;
    //configure A
    configurePagination('lastPage');
    //reload A
    setDataTrigger(prevDataTrigger => !prevDataTrigger);
  };

  const handleLastPageButtonClickB = (event) => {
    //strict contention
    if (isOnApiRequestRefB.current || isCursorPaginatingB.current) { return; }
    //set strict contention
    isCursorPaginatingB.current = true;
    //configure B
    configurePaginationB('lastPage');
    //reload B
    setDataTriggerB(prevDataTriggerB => !prevDataTriggerB);
  };

  const handleNextButtonClick = (event) => {
    //strict contention
    if (isOnApiRequestRef.current || isCursorPaginating.current) { return; }
    //set strict contention
    isCursorPaginating.current = true;
    //configure A
    configurePagination('nextPage');
    //reload A
    setDataTrigger(prevDataTrigger => !prevDataTrigger);
  };

  const handleNextButtonClickB = (event) => {
    //strict contention
    if (isOnApiRequestRefB.current || isCursorPaginatingB.current) { return; }
    //set strict contention
    isCursorPaginatingB.current = true;
    //configure B
    configurePaginationB('nextPage');
    //reload B
    setDataTriggerB(prevDataTriggerB => !prevDataTriggerB);
  };

  const handleBackButtonClick = (event) => {
    //strict contention
    if (isOnApiRequestRef.current || isCursorPaginating.current) { return; }
    //set strict contention
    isCursorPaginating.current = true;
    //configure A
    configurePagination('previousPage');
    //reload A
    setDataTrigger(prevDataTrigger => !prevDataTrigger);
  };

  const handleBackButtonClickB = (event) => {
    //strict contention
    if (isOnApiRequestRefB.current || isCursorPaginatingB.current) { return; }
    //set strict contention
    isCursorPaginatingB.current = true;
    //configure B
    configurePaginationB('previousPage');

    //reload B
    setDataTriggerB(prevDataTriggerB => !prevDataTriggerB);
  };


const handleChangeRowsPerPage = event => {
  if(event.target.value !== rowsPerPage)
  {
    if(page !== 0) {
      isGettingFirstDataRef.current = true; //avoids to get data on [page] effect
      setPage(0);
    }

    setRowsPerPage(parseInt(event.target.value, 10));
  }
};

const handleChangeRowsPerPageB = event => {
  if(event.target.value !== rowsPerPageB)
  {
    if(pageB !== 0) {
      isGettingFirstDataRefB.current = true; //avoids to get data on [pageB] effect
      setPageB(0);
    }
    setRowsPerPageB(parseInt(event.target.value, 10));
  }
};

const handleReloadClick = (event) => {
  //check strict contention
  if(isOnApiRequestRef.current || isCursorPaginating.current) { return; }
  //set strict contention
  isCursorPaginating.current = true;
  //configure pagination
  configurePagination('reset');
  //reload
  setDataTrigger(prevDataTrigger => !prevDataTrigger);
};
const handleReloadClickB = (event) => {
  //check strict contention
  if(isOnApiRequestRefB.current || isCursorPaginatingB.current) { return; }
  //set strict contention
  isCursorPaginatingB.current = true;
  //configure pagination
  configurePaginationB('reset');
  //reload
  setDataTriggerB(prevDataTriggerB => !prevDataTriggerB);
};

  /*
   * Items handlers
   */
  const handleRowClicked = (event, item) => {
    handleClickOnRoleRow(event, item);
  };

  const handleAddItem = (event, item) => {
    if(lidsToAdd.current.indexOf(item.id) === -1) {
      lidsToAdd.current.push(item.id);
      setThereAreItemsToAdd(true);
      
      //decrement count A
      setCount(count-1);
      //will count A
      cancelCountingPromises();
      isCountingRef.current = false;
      //reload A
      reloadDataA();

      //increment count B
      if(countB > 0) setCountB(countB+1);
      //will count B
      cancelCountingPromisesB();
      isCountingRefB.current = false;
      //configure B
      configurePaginationB('reset');
      //reload B
      setDataTriggerB(prevDataTriggerB => !prevDataTriggerB);
      handleTransfer('roles', item.id);
    }
  };

  const handleRemoveItem = (event, item) => {
    let iof = lidsToAdd.current.indexOf(item.id);
    if(iof !== -1) { 
      lidsToAdd.current.splice(iof, 1);

      if(lidsToAdd.current.length === 0) {
        setThereAreItemsToAdd(false);
      }

      //increment count A
      setCount(count+1);
      //will count A
      cancelCountingPromises();
      isCountingRef.current = false;
      //configure A
      configurePaginationB('reset');
      //reload A
      setDataTrigger(prevDataTrigger => !prevDataTrigger);

      //decrement count B
      if(countB > 0) setCountB(countB-1);
      //will count B
      cancelCountingPromisesB();
      isCountingRefB.current = false;
      //reload B
      reloadDataB();
      handleUntransfer('roles', item.id);
    }
  };

  return (
    <div className={classes.root}>
      <Grid className={classes.container} container spacing={0} alignItems='flex-start' justify='center'>
        {/*
          * Selectable list (A)
          */}
        <Grid item xs={12} sm={5} >
          {(item!==undefined) && (
            <Card className={classes.card}>

              {/* Toolbar */}
              <RolesToAddTransferViewToolbar
                title={'Roles'}
                titleIcon={1}
                search={search}
                onSearchEnter={handleSearchEnter}
                onReloadClick={handleReloadClick}
              />

              {/* Case: no data */}
              {(!isOnApiRequest && (!areItemsReady)) && (
                /* Label */
                <Fade
                  in={true}
                  unmountOnExit
                >
                  <div id='RolesToAddTransferView-div-noDataA'>
                    <Grid container>
                      <Grid item xs={12}>
                        <Grid className={classes.noDataBox} container justify="center" alignItems="center">
                          <Grid item>
                            <Typography variant="body2" >{ t('modelPanels.noData') }</Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>
                </Fade>
              )}

              {/* Case: data ready */}
              {(!isOnApiRequest && areItemsReady) && (
              
                /* List */
                <Fade
                  in={true}
                  unmountOnExit
                >
                  <Box className={classes.listBox} ref={lref}>
                    <List id='RolesToAddTransferView-list-listA'
                    dense component="div" role="list" >
                      {items.map(it => {
                        let key = it.id;
                        let label = it.name;
                        let sublabel = undefined;
                        
                        return (
                          <ListItem 
                            id={'RolesToAddTransferView-listA-listItem-'+it.id}
                            key={key} 
                            role="listitem" 
                            button 
                            className={classes.row}
                            onClick={(event) => {
                              handleRowClicked(event, it);
                            }}
                          >
                            <ListItemAvatar>
                              <Tooltip title={ 'role' }>
                                <Avatar>{"role".slice(0,1)}</Avatar>
                              </Tooltip>
                            </ListItemAvatar>

                            <ListItemText
                              primary={
                                <React.Fragment>
                                  {/* id*/}
                                  <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                                    <Grid item>
                                      <Tooltip title={ 'id' }>
                                        <Typography 
                                        id={'RolesToAddTransferView-listA-listItem-id-'+it.id}
                                        variant="body1" display="block" noWrap={true}>{it.id}</Typography>
                                      </Tooltip>
                                    </Grid>
                                    {/*Key icon*/}
                                    <Grid item>
                                      <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                                        <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
                                      </Tooltip>
                                    </Grid>
                                  </Grid>
                                </React.Fragment>
                              }
                              secondary={
                                <React.Fragment>
                                  {/* Label */}
                                  {(label) && (
                                    <Tooltip title={ 'name' }>
                                      <Typography component="span" variant="body1" display="inline" color="textPrimary">{label}</Typography>
                                    </Tooltip>
                                  )}
                                  
                                  {/* Sublabel */}
                                  {(sublabel) && (
                                    <Tooltip title={ 'id' }>
                                      <Typography component="span" variant="body2" display="inline" color='textSecondary'>{" — "+sublabel} </Typography>
                                    </Tooltip>
                                  )}
                                </React.Fragment>
                              }
                            />
                            {/* Button: Add */}
                            <ListItemSecondaryAction>
                              <Tooltip title={ t('modelPanels.transferToAdd') }>
                                <IconButton
                                  id={'RolesToAddTransferView-listA-listItem-'+it.id+'-button-add'}
                                  color="primary"
                                  className={classes.iconButton}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    handleAddItem(event, it);
                                  }}
                                >
                                  <Add htmlColor="#4CAF50" />
                                </IconButton>
                              </Tooltip>
                            </ListItemSecondaryAction>
                          </ListItem>
                        );
                      })}
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
                        <Box height={lh}>
                          <Grid container className={classes.loadingBox} justify="center" alignItems="center">
                            <Grid item>
                              <CircularProgress color='primary' disableShrink />
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                    </Grid>
                  </div>
                </Fade>
              )}

              {/* Pagination */}
              <RolesToAddTransferViewCursorPagination
                count={count}
                rowsPerPageOptions={(count <=10) ? [] : (count <=50) ? [5, 10, 25, 50] : [5, 10, 25, 50, 100]}
                rowsPerPage={(count <=10) ? '' : rowsPerPage}
                labelRowsPerPage = { t('modelPanels.rows', 'Rows') }
                hasNextPage={hasNextPage}
                hasPreviousPage={hasPreviousPage}
                handleFirstPageButtonClick={handleFirstPageButtonClick}
                handleLastPageButtonClick={handleLastPageButtonClick}
                handleNextButtonClick={handleNextButtonClick}
                handleBackButtonClick={handleBackButtonClick}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
            />
            </Card>
          )}
        </Grid>

        {/*
          * Arrows
          */}
        <Hidden xsDown>
          <Grid item xs={1} >
            <Grid container className={classes.arrowsBox} justify='center'>
              <TransferArrows
                color="primary"
                fontSize="large"
                component={svgProps => {
                  return (
                    <svg {...svgProps}>
                      <defs>
                        <linearGradient id="gradient1">
                          <stop offset="30%" stopColor={(itemsB&&itemsB.length>0) ? "#3F51B5" : blueGrey[200]} />
                          <stop offset="70%" stopColor={(items&&items.length>0) ? "#4CAF50" : blueGrey[200]} />
                        </linearGradient>
                      </defs>
                      {React.cloneElement(svgProps.children[0], {
                        fill: 'url(#gradient1)',
                      })}
                    </svg>
                  );
                }}
              />
            </Grid>
          </Grid>
        </Hidden>
        <Hidden smUp>
          <Grid item xs={1} >
            <Grid container className={classes.arrowsBox} justify='center'>
              <TransferArrows
                className={classes.arrowsV}
                color="primary"
                fontSize="large"
                component={svgProps => {
                  return (
                    <svg {...svgProps}>
                      <defs>
                        <linearGradient id="gradient1b">
                          <stop offset="30%" stopColor={(itemsB&&itemsB.length>0) ? "#3F51B5" : blueGrey[200]} />
                          <stop offset="70%" stopColor={(items&&items.length>0) ? "#4CAF50" : blueGrey[200]} />
                        </linearGradient>
                      </defs>
                      {React.cloneElement(svgProps.children[0], {
                        fill: 'url(#gradient1b)',
                      })}
                    </svg>
                  );
                }}
              />
            </Grid>
          </Grid>
        </Hidden>

        {/*
          * To add list (B) 
          */}
        <Grid item xs={12} sm={5} >
          {(item!==undefined) && (
            <div>
            <Card className={classes.card}>

              {/* Toolbar */}
              <RolesToAddTransferViewToolbar 
                title={'Roles'}
                titleIcon={2}
                search={searchB}
                onSearchEnter={handleSearchEnterB}
                onReloadClick={handleReloadClickB}
              />

              {/* Case: no items added */}
              {(!thereAreItemsToAdd) && (
                /* Label */
                <Fade
                  in={true}
                  unmountOnExit
                >
                  <div id='RolesToAddTransferView-div-noItemsB'>
                    <Grid container>
                      <Grid item xs={12}>
                        <Grid className={classes.noDataBox} container justify="center" alignItems="center">
                          <Grid item>
                            <Typography variant="body2" >{ t('modelPanels.noItemsToAdd', 'No records marked for association') }</Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>
                </Fade>
              )}

              {/* Case: no data from search */}
              {(thereAreItemsToAdd && !isOnApiRequestB && (!areItemsReadyB)) && (
                /* Label */
                <Fade
                  in={true}
                  unmountOnExit
                >
                  <div id='RolesToAddTransferView-div-noDataB'>
                    <Grid container>
                      <Grid item xs={12}>
                        <Grid className={classes.noDataBox} container justify="center" alignItems="center">
                          <Grid item>
                            <Typography variant="body2" >{ t('modelPanels.noData') }</Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>
                </Fade>
              )}

              {/* Case: data ready */}
              {(thereAreItemsToAdd && !isOnApiRequestB && areItemsReadyB) && (
              
                /* List */
                <Fade
                  in={true}
                  unmountOnExit
                >
                  <Box className={classes.listBox} ref={lrefB}>
                    <List id='RolesToAddTransferView-list-listB'
                      dense component="div" role="list">
                      {itemsB.map(it => {
                        let key = it.id;
                        let label = it.name;
                        let sublabel = undefined;

                        
                        return (
                          <ListItem 
                            id={'RolesToAddTransferView-listB-listItem-'+it.id}
                            key={key} 
                            role="listitem"
                            button
                            className={classes.row}
                            onClick={(event) => {
                              handleRowClicked(event, it);
                            }}
                          >
                            <ListItemAvatar>
                              <Tooltip title={ 'role' }>
                                <Avatar>{"role".slice(0,1)}</Avatar>
                              </Tooltip>
                            </ListItemAvatar>

                            <ListItemText
                              primary={
                                <React.Fragment>
                                  {/* id*/}
                                  <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                                    <Grid item>
                                      <Tooltip title={ 'id' }>
                                        <Typography 
                                        id={'RolesToAddTransferView-listB-listItem-id-'+it.id}
                                        variant="body1" display="block" noWrap={true}>{it.id}</Typography>
                                      </Tooltip>
                                    </Grid>
                                    {/*Key icon*/}
                                    <Grid item>
                                      <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                                        <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
                                      </Tooltip>
                                    </Grid>
                                  </Grid>
                                </React.Fragment>
                              }
                              secondary={
                                <React.Fragment>
                                  {/* Label */}
                                  {(label) && (
                                    <Tooltip title={ 'name' }>
                                      <Typography component="span" variant="body1" display="inline" color="textPrimary">{label}</Typography>
                                    </Tooltip>
                                  )}
                                  
                                  {/* Sublabel */}
                                  {(sublabel) && (
                                    <Tooltip title={ 'id' }>
                                      <Typography component="span" variant="body2" display="inline" color='textSecondary'>{" — "+sublabel} </Typography>
                                    </Tooltip>
                                  )}
                                </React.Fragment>
                              }
                            />
                            {/* Button: Remove */}
                            <ListItemSecondaryAction>
                              <Tooltip title={ t('modelPanels.untransferToAdd') }>
                                <IconButton
                                  id={'RolesToAddTransferView-listB-listItem-'+it.id+'-button-remove'}
                                  color="primary"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    handleRemoveItem(event, it);
                                  }}
                                >
                                  <Remove color="primary" />
                                </IconButton>
                              </Tooltip>
                            </ListItemSecondaryAction>
                          </ListItem>
                        );
                      })}
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
                        <Box height={lhB}>
                          <Grid container className={classes.loadingBox} justify="center" alignItems="center">
                            <Grid item>
                              <CircularProgress color='primary' disableShrink />
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                    </Grid>
                  </div>
                </Fade>
              )}

              {/* Pagination */}
                
              <RolesToAddTransferViewCursorPagination
                count={countB}
                rowsPerPageOptions={(countB <=10) ? [] : (countB <=50) ? [5, 10, 25, 50] : [5, 10, 25, 50, 100]}
                rowsPerPage={(countB <=10) ? '' : rowsPerPageB}
                labelRowsPerPage = { t('modelPanels.rows', 'Rows') }
                hasNextPage={hasNextPageB}
                hasPreviousPage={hasPreviousPageB}
                handleFirstPageButtonClick={handleFirstPageButtonClickB}
                handleLastPageButtonClick={handleLastPageButtonClickB}
                handleNextButtonClick={handleNextButtonClickB}
                handleBackButtonClick={handleBackButtonClickB}
                handleChangeRowsPerPage={handleChangeRowsPerPageB}
              />
            </Card>
            </div>
          )}
        </Grid>
      </Grid>
    </div>
  );
}
RolesToAddTransferView.propTypes = {
  item: PropTypes.object.isRequired,
  idsToAdd: PropTypes.array.isRequired,
  handleTransfer: PropTypes.func.isRequired,
  handleUntransfer: PropTypes.func.isRequired,
  handleClickOnRoleRow: PropTypes.func.isRequired,
};