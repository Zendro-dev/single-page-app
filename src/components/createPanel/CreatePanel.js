import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AttributesPage from './components/AttributesPage'
import AssociationsPage from './components/AssociationsPage'
import TabsA from './components/TabsA'
import ConfirmationDialog from './components/ConfirmationDialog'

/*
  Material-UI components
*/
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Hidden from '@material-ui/core/Hidden';


/*
  Styles
*/
const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3),
  },
  card: {
    margin: theme.spacing(0),
    overflowX: 'auto',
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DetailView(props) {
  /*
    Styles
  */
  const classes = useStyles();

  /*
    Properties
  */
  const { 
    headCells,
    toOnes,
    toManys,
    handleClose 
  } = props;
  
  /*
    State
  */
  const [open, setOpen] = useState(true);
  //state: tabsMenuA
  const [tabsValue, setTabsValue] = useState(0);
  //state: headCells
  const [valueOkStates, setValueOkStates] = useState(getEditableItems().map(function(item){ return {key: item.key, value: '', valueOk: 0}}));
  //state: confirmation dialog
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationTitle, setConfirmationTitle] = useState('');
  const [confirmationText, setConfirmationText] = useState('');
  const [confirmationAcceptText, setConfirmationAcceptText] = useState('');
  const [confirmationRejectText, setConfirmationRejectText] = useState('');

  /*
    Refs
  */
  //refs: confirmation dialog
  const handleAccept = useRef(undefined);
  const handleReject = useRef(undefined);
  const associationIdsToAdd = useRef(getAssociationsItems().map(function(item){ return {key: item.key, ids: []}}));

  /*
    Hooks
  */
  useEffect(() => {

    console.log("#Create Panel: init");

    return function cleanup() {
      console.log("##Create Pane: end");
    }

  }, []);

  useEffect(() => {
    console.log("##- new: tabsValue: ", tabsValue);

  }, [tabsValue]);

  useEffect(() => {

    console.log("##-NEW valueOkStates: ", valueOkStates);

  }, [valueOkStates]);
  
  /*
    Methods
  */
  function getAssociationsItems() {
    //toManys
    let itemsToManys = toManys.map(function(item, index){ 
      return {
        key: item.targetModelLc, 
        name: item.relationName, 
        label: item.relationNameCp }
      });
    //toOnes
    let itemsToOnes = toOnes.map(function(item, index){ 
      return {
        key: item.targetModelLc, 
        name: item.relationName, 
        label: item.relationNameCp }
      });
    //retrun concat  
    return itemsToOnes.concat(itemsToManys);
  }

  function getEditableItems() {

    let its = Array.from(headCells);

    /*
      Remove no editable items:
        - name: id
    */
    for(var i=0; i<its.length; ++i)
    {
      if(its[i].name.toLowerCase() === 'id') {
        //remove item
        its.splice(i, 1);
      }
    }

    return its;
  }

  function itemHasKey(item, index) {
    if(item !== undefined) {
      return item.key === this.key;
    } else {
      return false;
    }
  }

  function getAcceptableStatus(key, value) {
    /*
      For now, just context validations are done
      to ensure that in future, this function can
      be used to enforce acceptable conditions
      retrieved from model specs.

      status codes:
        1: acceptable
        0: unknown/not tested yet (this is set on initial render)/empty
      -1: not acceptable 
    */
    
    /*
      Check 1: item exists with itemKey
    */
    let it = headCells.find(itemHasKey, {key: key});
    if(it === undefined) {
      return -1;
    }

    /*
      Check 2: null or undefined value
    */
    if(value === null || value === undefined) {
      return -1;
    }

    /*
      Check 3 (last): empty
    */
    if(value.trim() === '') {
      return 0;
    }

    return 1;
  }

  function areThereAcceptableFields() {
    for(var i=0; i<valueOkStates.length; ++i) {
      if(valueOkStates[i].valueOk === 1) {
        return true;
      }
    }
    return false;
  }

  function areThereNotAcceptableFields() {
    for(var i=0; i<valueOkStates.length; ++i) {
      if(valueOkStates[i].valueOk === -1) {
        return true;
      }
    }
    return false;
  }

  function areThereIncompleteFields() {
    for(var i=0; i<valueOkStates.length; ++i) {
      if(valueOkStates[i].valueOk === 0) {
        return true;
      }
    }
    return false;
  }

  function doSave(event) {
    console.log("##: on.DoSave(): states: ", valueOkStates);
    
    //close
    onClose(event);
  }

  function getAssociationItems() {
    //toManys
    let itemsToManys = toManys.map(function(item, index){ 
      return {
        key: item.targetModelLc, 
        name: item.relationName, 
        label: item.relationNameCp,
        type: 'toMany'
       }
    });
    //toOnes
    let itemsToOnes = toOnes.map(function(item, index){ 
      return {
        key: item.targetModelLc, 
        name: item.relationName, 
        label: item.relationNameCp,
        type: 'toOne'
      }
    });
    //return concat  
    return itemsToOnes.concat(itemsToManys);
  }

  /*
    Handlers
  */
  const handleTabsChange = (event, newValue) => {
    setTabsValue(newValue);
  };

  const handleFieldChange = (event, value, key) => {
    /*
      Handle: valueOk state (reset)
    */
    //make new valueOk state object
    let o = {key: key, value: value, valueOk: 0};
    let i = -1;
    //find index
    if(valueOkStates.length > 0) {
      i = valueOkStates.findIndex(itemHasKey, {key:key});
    }
    //update state
    if(i !== -1) {
      let newValueOkStates = Array.from(valueOkStates);
      newValueOkStates[i] = o;
      setValueOkStates(newValueOkStates);
    }
  }

  const handleOkStateUpdate = (value, key) => {
    //make new valueOk state object
    let o = {key: key, value: value, valueOk: getAcceptableStatus(key, value)};
    let i = -1;
    //find index
    if(valueOkStates.length > 0) {
      i = valueOkStates.findIndex(itemHasKey, {key:key});
    }
    //update state
    if(i !== -1) {
      let newValueOkStates = Array.from(valueOkStates);
      newValueOkStates[i] = o;
      setValueOkStates(newValueOkStates);
    }
  }

  const handleSave = (event) => {
    console.log("##- on.handleSave: values: ", valueOkStates);

    /*
      Check: not-acceptable fields
    */
  if(areThereNotAcceptableFields()) {
      /*
        Show confirmation dialog
      */
      //set state
      setConfirmationTitle("Some fields are not valid! ");
      setConfirmationText("To continue, please validate these fields.")
      setConfirmationAcceptText("I UNDERSTAND");
      setConfirmationRejectText("");
      //set refs
      handleAccept.current = () => {
        console.log("#. accepting .#");
        //hide
        setConfirmationOpen(false);
      }
      handleReject.current = undefined;

      //show
      setConfirmationOpen(true);

      //done
      return;
  }

    /*
      Check: incomplete fields
    */
    if(areThereIncompleteFields()) {
      /*
        Show confirmation dialog
      */
      //set state
      setConfirmationTitle("Some fields are incomplete, want to continue anyway?");
      setConfirmationText("If you are sure that this is correct, please continue.")
      setConfirmationAcceptText("YES, SAVE THE FORM");
      setConfirmationRejectText("BACK TO THE FORM");
      //set refs
      handleAccept.current = () => {
        console.log("#. accepting .#");
        //do save
        doSave(event);
        //hide
        setConfirmationOpen(false);
      }
      handleReject.current = () => {
        console.log("#. cancelling .#");
        //hide
        setConfirmationOpen(false);
      }

      //show
      setConfirmationOpen(true);

  } else {
    //do save
    doSave(event);
  }

  }

  const handleCancel = (event) => {
    console.log("##- on.handleCancel: values: ", valueOkStates);
    /*
      Check: acceptable fields
    */
    if(areThereAcceptableFields()) {
        /*
          Show confirmation dialog
        */
        //set state
        setConfirmationTitle("The information already captured will be lost!");
        setConfirmationText("Some fields are already completed, if you continue, the information already captured will be lost, are you sure you want to continue?")
        setConfirmationAcceptText("YES, CONTINUE");
        setConfirmationRejectText("BACK TO THE FORM");
        //set refs
        handleAccept.current = () => {
          console.log("#. accepting .#");
          //hide
          setConfirmationOpen(false);
          onClose(event);
        }
        handleReject.current = () => {
          console.log("#. cancelling .#");
          //hide
          setConfirmationOpen(false);
        }

        //show
        setConfirmationOpen(true);

        //done
        return;
    } else {
      onClose(event);
    }
  }

  const onClose = (event) => {
    //update state
    setOpen(false);
    //callback: close
    handleClose(event);
  }

  const handleConfirmationAccept = (event) => {
    //run ref
    handleAccept.current();
  }

  const handleConfirmationReject = (event) => {
    //run ref
    handleReject.current();
  }
  

  const handleTransferToAdd = (associationKey, itemId) => {
    //find association key entry
    for(var i=0; i<associationIdsToAdd.current.length; ++i) {
      if(associationIdsToAdd.current[i].key === associationKey) {
        //push new id
        associationIdsToAdd.current[i].ids.push(itemId);
        //done
        return;
      }
    }
  }

  const handleUntransferFromAdd =(associationKey, itemId) => {
    //find association key entry
    for(var i=0; i<associationIdsToAdd.current.length; ++i) {
      if(associationIdsToAdd.current[i].key === associationKey) {
        //find
        for(var j=0; j<associationIdsToAdd.current[i].ids.length; ++j)
        {
          if(associationIdsToAdd.current[i].ids[j] === itemId) {
            //remove
            associationIdsToAdd.current[i].ids.splice(j, 1);
            //done
            return;
          }
        }
      }
    }
  }

  /*
    Render
  */
  return (
    
    <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            New Item
          </Typography>
        </Toolbar>
      </AppBar>

      <div className={classes.root}>
        <Grid container justify='center'>
          <Grid item xs={12}>
            
            {/* TabsA: Menú */}
            <TabsA
              value={tabsValue}
              handleChange={handleTabsChange}
              handleCancel={handleCancel}
              handleSave={handleSave}
            />
              
            {/* Attributes Page [0] */}
            <AttributesPage
              hidden={tabsValue !== 0}
              items={getEditableItems()}
              valueOkStates={valueOkStates}
              handleFieldChange={handleFieldChange}
              handleOkStateUpdate={handleOkStateUpdate}
            />

            {/* Associations Page [1] */}
            <AssociationsPage
              hidden={tabsValue !== 1}
              associationItems={getAssociationItems()}
              toOnes={toOnes}
              toManys={toManys}
              associationIdsToAdd={associationIdsToAdd.current}
              handleTransferToAdd={handleTransferToAdd}
              handleUntransferFromAdd={handleUntransferFromAdd}
            />

          </Grid>
        </Grid>

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          open={confirmationOpen}
          title={confirmationTitle}
          text={confirmationText}
          acceptText={confirmationAcceptText}
          rejectText={confirmationRejectText}
          handleAccept={handleConfirmationAccept}
          handleReject={handleConfirmationReject}
        />
      </div>

    </Dialog>
  );
}

/*
  PropTypes
*/