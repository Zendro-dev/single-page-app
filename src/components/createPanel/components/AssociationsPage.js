import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ChipsView from '../../views/chipsView/ChipsView';
import AttributesFormView from '../../views/attributesFormView/AttributesFormView'
import AssociationTypesTabs from './AssociationTypesTabs'
import CompactListView from '../../compactListView/CompactListView'
import AssociationToAddTransferView from '../../views/associationToAddTransferView/AssociationToAddTransferView'

/*
  Material-UI components
*/
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';

/*
  Styles
*/
const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
  },
  listItemText: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  menu: {
    marginTop: theme.spacing(1),
  }
}));

export default function AssociationsPage(props) {
  /*
    Styles
  */
  const classes = useStyles();

  /*
    Properties
  */
  const {
    hidden,
    associationItems,
    toOnes, 
    toManys,
    associationIdsToAdd,
    handleTransferToAdd,
    handleUntransferFromAdd,
  } = props;
  
  /*
    State
  */
  const [selectedAssociationIndex, setSelectedAssociationIndex] = React.useState(0);
  const [associationTitle, setAssociationTitle] = useState(associationItems[0].label);
  const [association, setAssociation] = useState(getAssociationNames(associationItems[0]));

  /*
    Refs
  */
  
  /*
    Hooks
  */
  useEffect(() => {

    console.log("@@init@@: Associations IDs to ADD: ", associationIdsToAdd);

    //select first association
    if(associationItems.length > 0) {
      setAssociationTitle(associationItems[0].label);
      setAssociation(getAssociationNames(associationItems[0]));
      setSelectedAssociationIndex(0);
    }

  }, []);

  /*
    Methods
  */
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

  function getAssociationNames(item) {
    if(item.type==='toMany') {
      return getToManyByName(item.key);
    } 
    
    if(item.type==='toOne') {
      return getToOneByName(item.key);
    }

    return undefined;
  }

  function getIdsToAdd() {
    //find current association excluded ids
    for(var i=0; i<associationIdsToAdd.length; ++i) {
      if(associationIdsToAdd[i].key === association.targetModelLc) {
        return associationIdsToAdd[i].ids;
      }
    }
    //if not found
    return [];
  }

  /*
    Handlers
  */
  const handleAssociationClick = (event, item) => {
    //update current association object
    setAssociationTitle(item.label);
    setAssociation(getAssociationNames(item));
  }

  /*
    Render
  */
  return (
    <div hidden={hidden}>
      <Grid
        className={classes.root} 
        container 
        justify='center'
        alignItems='flex-start'
        spacing={0}
      > 
        {/* Menu: Associations */}
        <Grid item xs={11} sm={2} className={classes.menu}>
          <List dense component="div" role="list">
            {associationItems.map((item, index) => {
              return (
                <ListItem
                  key={item.key}
                  role="listitem"
                  button
                  //selected={selectedAssociationIndex === index}
                  onClick={(event) => {
                    //update selected index
                    setSelectedAssociationIndex(index);
                    //handle
                    handleAssociationClick(event, item);
                  }}
                >
                  {/* Label */}
                  <Typography 
                    className={classes.listItemText}  
                    variant="subtitle1" 
                    display="block" 
                    noWrap={true}
                    color={selectedAssociationIndex === index ? 'primary' : 'initial'}
                  >
                    {item.label}
                  </Typography>
                </ListItem>
              );
            })}
          </List>
        </Grid>
        
        {/* ToAdd Transfer Lists */}
        <Grid item xs={11} sm={9}>
          <AssociationToAddTransferView
            title={associationTitle}
            titleB={associationTitle}
            associationNames={association}
            idsToAdd={getIdsToAdd()}
            handleTransfer={handleTransferToAdd}
            handleUntransfer={handleUntransferFromAdd}
          />
        </Grid>
      </Grid>
    </div>
  );
}
/*
  PropTypes
*/