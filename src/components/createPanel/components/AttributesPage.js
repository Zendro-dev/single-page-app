import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ChipsView from '../../views/chipsView/ChipsView';
import AttributesFormView from '../../views/attributesFormView/AttributesFormView'
import ConfirmationDialog from './ConfirmationDialog'

/*
  Material-UI components
*/
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

/*
  Styles
*/
const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
  },
}));

export default function AttributesPage(props) {
  /*
    Styles
  */
  const classes = useStyles();

  /*
    Properties
  */
  const { items, handleClose } = props;
  
  /*
    State
  */
  const [itemFocusStates, setItemFocusStates] = useState(items.map(function(item){ return {key: item.key, focus: false}}));
  const [valueOkStates, setValueOkStates] = useState(items.map(function(item){ return {key: item.key, value: '', valueOk: 0}}));
  //state: confirmation dialog
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationTitle, setConfirmationTitle] = useState('');
  const [confirmationText, setConfirmationText] = useState('');
  const [confirmationAcceptText, setConfirmationAcceptText] = useState('');
  const [confirmationRejectText, setConfirmationRejectText] = useState('');
  
  /*
    Refs
  */
  const fieldRefs = useRef([]);
  const searchAllowed = useRef(true);
  //refs: confirmation dialog
  const handleAccept = useRef(undefined);
  const handleReject = useRef(undefined);


  /*
    Hooks
  */
  useEffect(() => {

    //set focus on first item
    setFocusOnIndex(0);

  }, []);

  useEffect(() => {

    console.log("##-NEW valueOkStates: ", valueOkStates);

  }, [valueOkStates]);

  /*
    Methods
  */
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
    let it = items.find(itemHasKey, {key: key});
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

  function setFocusOnIndex(index) {
    //find index ref
    let i = -1;
    if(fieldRefs.current.length > 0 && items.length > 0) {
      i = fieldRefs.current.findIndex(itemHasKey, {key: items[index].key}); 
    }
    if(i !== -1) {
      //set focus
      fieldRefs.current[i].inputRef.current.focus();
      
      //scroll
      fieldRefs.current[i].textFieldRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
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

  function doSave() {
    console.log("##: on.DoSave() :##")
  }

  /*
    Handlers
  */
  const handleChipClick = (event, item) => {
    /*
      Set focus on respective field
    */
    //find index ref
    let i = -1;
    if(fieldRefs.current.length > 0) {
      i = fieldRefs.current.findIndex(itemHasKey, {key: item.key}); 
    }
    if(i !== -1) {
      //set focus
      fieldRefs.current[i].inputRef.current.focus();
      
      //scroll
      //last item
      fieldRefs.current[i].textFieldRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  const handleChipDelete = (event, item) => {
    console.log("@- chip delete: item: ", item);
  }

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

  const handleFieldFocus = (event, value, key) => {
    /*
      Handle: focus state
    */
    //make new focus state object
    let o = {key: key, focus: true};
    let i = -1;
    //find index
    if(itemFocusStates.length > 0) {
      i = itemFocusStates.findIndex(itemHasKey, {key:key});
    }
    //update state
    if(i !== -1) {
      let newItemFocusStates = Array.from(itemFocusStates);
      newItemFocusStates[i] = o;
      setItemFocusStates(newItemFocusStates);
      
      //update ref
      searchAllowed.current = false;
    }
  }

  const handleFieldBlur = (event, value, key) => {
    /*
      Handle: focus state
    */
    //make new focus state object
    let o = {key: key, focus: false};
    let i = -1;
    //find index
    if(itemFocusStates.length > 0) {
      i = itemFocusStates.findIndex(itemHasKey, {key:key});
    }
    //update state
    if(i !== -1) {
      let newItemFocusStates = Array.from(itemFocusStates);
      newItemFocusStates[i] = o;
      setItemFocusStates(newItemFocusStates);
      
      //update ref
      searchAllowed.current = true;
    }

    /*
      Handle: valueOk state
    */
    //make new valueOk state object
    o = {key: key, value: value, valueOk: getAcceptableStatus(key, value)};
    i = -1;
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

  const handleFieldReady = (key, textFieldRef, inputRef) => {
    /*
      Update refs array
    */
    //make new ref object
    let o = {key: key, textFieldRef: textFieldRef, inputRef: inputRef};
    //find index ref
    let i = -1;
    if(fieldRefs.current.length > 0) {
      i = fieldRefs.current.findIndex(itemHasKey, {key: key}); 
    }
    //if ref already exists
    if(i !== -1) {
      //update ref
      fieldRefs.current[i] = o;
    } else {
      //push new ref
      fieldRefs.current.push(o);
    }
  }

  const handleFieldsKeyDown = (event, value, key) => {
    
    console.log("EVENT: bubbles: ", event.bubbles);

    /*
      Enter
    */
    if(event.key === 'Enter') {
        handleOkState(value, key);
    }
  }

  const handleOkState = (value, key) => {
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
        doSave();
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
     doSave();
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
          //callback: close
          handleClose(event);
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
      //callback: close
      handleClose(event);
    }
  }

  const handleConfirmationAccept = (event) => {
    //run ref
    handleAccept.current();
  }

  const handleConfirmationReject = (event) => {
    //run ref
    handleReject.current();
  }

  const onGetSearchAllowed = () => {
    if(searchAllowed !== undefined) {
      return searchAllowed.current;
    } else {
      return false;
    }
  }

  /*
    Render
  */
  return (
    <div>
      <Grid
        className={classes.root} 
        container justify='center' 
        alignItems='flex-start'
        spacing={3}
      > 
        <Grid item xs={3}>
          <ChipsView
            items={items}
            itemFocusStates={itemFocusStates}
            valueOkStates={valueOkStates}
            deletable={false}
            handleClick={handleChipClick}
            handleDelete={handleChipDelete}
            onGetSearchAllowed={onGetSearchAllowed}
          />
        </Grid>

        <Grid item xs={6}>
          <AttributesFormView
            items={items}
            valueOkStates={valueOkStates}
            handleFocus={handleFieldFocus}
            handleBlur={handleFieldBlur}
            handleFieldReady={handleFieldReady}
            handleChange={handleFieldChange}
            handleKeyDown={handleFieldsKeyDown}
            handleCancel={handleCancel}
            handleSave={handleSave}
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
  );
}

/*
  PropTypes
*/
AttributesPage.propTypes = {
  items: PropTypes.array.isRequired,
};