import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ChipsView from '../../views/chipsView/ChipsView';
import AttributesFormView from '../../views/attributesFormView/AttributesFormView'
import AssociationTypesTabs from './AssociationTypesTabs'
import CompactListView from '../../compactListView/CompactListView'
import AssociationSelectableView from '../../views/associationSelectableView/AssociationSelectableView'

/*
  Material-UI components
*/
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

/*
  Styles
*/
const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
  },
  noDataBox: {
    width: "100%",
    height: 112,
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
  const {
    items,
    toOnes, 
    toManys, 
    valueOkStates,
    hidden,
    handleFieldChange,
    handleOkStateUpdate,
  } = props;
  
  /*
    State
  */
  const [itemFocusStates, setItemFocusStates] = useState(items.map(function(item){ return {key: item.key, focus: false}}));
  const [toManyFocusStates, setToManyFocusStates] = useState(getToManyItems().map(function(item){ return {key: item.key, focus: false}}));
  const [toOneFocusStates, setToOneFocusStates] = useState(getToOneItems().map(function(item){ return {key: item.key, focus: false}}));
  //state: tabsMenuB
  const [associationTypeSelected, setAssociationTypeSelected] = useState(0);
  //state: associations table view
  const [associationTitle, setAssociationTitle] = useState('');
  const [association, setAssociation] = useState(undefined);

  /*
    Refs
  */
  const fieldRefs = useRef([]);
  const searchAllowed = useRef(true);

  /*
    Hooks
  */
  useEffect(() => {

    console.log("toManys: ", toManys);

    //select approtiate association type
    setAssociationTypeSelected(getInitialAssociationTypeSelected);

  }, []);

  useEffect(() => {

    console.log("new: associationTypeSelected: ", associationTypeSelected);

  }, [associationTypeSelected]);

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

  function getInitialAssociationTypeSelected() {
    /*
      0  toOne
      1  toMany
    */

    if (toOnes.length === toManys.length) {
      return 0;
    }
    else {
      return (toOnes.length > 0) ? 0 : 1;
    }
  }

  function setFocusOnIndex(index) {

    console.log("///setFocusOnIndex: ", index);

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

  function getToManyItems() {
    return toManys.map(function(item, index){ return {key: item.targetModelLc, name: item.relationName, label: item.relationNameCp }});
  }

  function getToOneItems() {
    return toOnes.map(function(item, index){ return {key: item.targetModelLc, name: item.relationName, label: item.relationNameCp }});
  }

  function getToManyByName(name) {
    for(var i=0; i<toManys.length; ++i) {
      if(toManys[i].targetModelLc === name) {
        return toManys[i];
      }
    }

    return undefined;
  }

  function getToOneByName(name) {
    for(var i=0; i<toOnes.length; ++i) {
      if(toOnes[i].targetModelLc === name) {
        return toOnes[i];
      }
    }

    return undefined;
  }

  /*
    Handlers
  */
  const handleChipClick = (event, item) => {

    console.log("@@%%%_ handleChipClick: item: ", item);


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

  const handleToManyChipClick = (event, item) => {
    let key = item.key;

    /*
      Set focus on respective field (set selected)
    */
    //make new focus state object
    let o = {key: key, focus: true};
    let i = -1;
    //find index
    if(toManyFocusStates.length > 0) {
      i = toManyFocusStates.findIndex(itemHasKey, {key:key});
    }
    //update state
    if(i !== -1) {
      let newToManyFocusStates = Array.from(toManyFocusStates);
      newToManyFocusStates[i] = o;
      setToManyFocusStates(newToManyFocusStates);
    }

    /*
      Update current association object
    */
   console.log("##clicked item: ", item);
    console.log("##clicked assoc: ", getToManyByName(key));
    setAssociationTitle(item.label);
    setAssociation(getToManyByName(key));
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

    //callback
    handleOkStateUpdate(value, key);
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
    /*
      Enter
    */
    if(event.key === 'Enter') {
        //callback
        handleOkStateUpdate(value, key);
    }
  }

  const handleAssociationTypeChange = (event, newValue) => {
    setAssociationTypeSelected(newValue);   
  };

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
    <div hidden={hidden}>
      <Grid
        className={classes.root} 
        container justify='center' 
        alignItems='flex-start'
        spacing={3}
      > 
        {/* Tabs: Associations Types */}
        <Grid item xs={2}>
        <AssociationTypesTabs 
          toOnesLength={toOnes.length}
          toManysLength={toManys.length}
          associationTypeSelected={associationTypeSelected}
          onAssociationTypeChange={handleAssociationTypeChange}
        />
        </Grid>

        {/* Chips View: ToOnes & ToManys */}
        <Grid item xs={2}>

          {/* <ChipsView
            items={items}
            itemFocusStates={itemFocusStates}
            valueOkStates={valueOkStates}
            deletable={false}
            handleClick={handleChipClick}
            onGetSearchAllowed={onGetSearchAllowed}
          /> */}


          {/* ToOnes */}
          {(toOnes.length > 0) ? (
            <ChipsView
              hidden={associationTypeSelected !== 0}
              items={getToOneItems()}
              itemFocusStates={toOneFocusStates}
              valueOkStates={valueOkStates}
              deletable={false}
              handleClick={handleChipClick}
              onGetSearchAllowed={onGetSearchAllowed}
            />
          ):(
            <div hidden={associationTypeSelected !== 0}>
              <Grid container>
                <Grid item xs={12}>
                  <Grid className={classes.noDataBox} container justify="center" alignItems="center">
                    <Grid item>
                      <Typography variant="body1" > There are not to-one associations </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          )}

          {/* ToManys */}
          {(toManys.length > 0) ? (
            <ChipsView
              hidden={associationTypeSelected !== 1}
              items={getToManyItems()}
              itemFocusStates={toManyFocusStates}
              valueOkStates={valueOkStates}
              deletable={false}
              handleClick={handleToManyChipClick}
              onGetSearchAllowed={onGetSearchAllowed}
            />
          ):(
            <div hidden={associationTypeSelected !== 1}>
              <Grid container>
                <Grid item xs={12}>
                  <Grid className={classes.noDataBox} container justify="center" alignItems="center">
                    <Grid item>
                      <Typography variant="body1" > There are not to-many associations </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          )}
          

          
        </Grid>

        {/* Associations Compact List B */}
        <Grid item xs={6}>
          <Grid container
            container justify='center' 
            alignItems='flex-start'
            wrap='wrap'
            spacing={1}
          >
            <Grid item xs={12} xl={6}>
              {(association !== undefined) && (
                <AssociationSelectableView
                  title={associationTitle}
                  associationNames={association}
                />
              )}
            </Grid>

            {/* <Grid item xs={12} lg={6}>
              <CompactListView
              />
            </Grid> */}


          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

/*
  PropTypes
*/
AttributesPage.propTypes = {
  items: PropTypes.array.isRequired,
};