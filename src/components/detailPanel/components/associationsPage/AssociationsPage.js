import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import AssociationCompactView from './associationCompactView/AssociationCompactView'
import AssociationMenuTabs from './AssociationsMenuTabs'

/*
  Material-UI components
*/
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';

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
    Media Queries
  */
  const theme = useTheme();
  const matchesDownXs = useMediaQuery(theme.breakpoints.down('xs'));

  /*
    Properties
  */
  const {
    hidden,
    modelNames,
    item,
    associationItems,
    toOnes, 
    toManys,
    associationIdsToAdd,
    associationIdsToRemove,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleTransferToRemove,
    handleUntransferFromRemove,
  } = props;
  
  /*
    State
  */
  const [associationTitle, setAssociationTitle] = useState(associationItems[0].label);
  const [association, setAssociation] = useState(getAssociationNames(associationItems[0]));
  const [associationSelected, setAssociationSelected] = React.useState(0);

  /*
    Refs
  */
  
  /*
    Hooks
  */
  useEffect(() => {
    //select first association
    if(associationItems.length > 0) {
      setAssociationTitle(associationItems[0].label);
      setAssociation(getAssociationNames(associationItems[0]));
      setAssociationSelected(0);
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
    //find current association excluded ids to add
    for(var i=0; i<associationIdsToAdd.length; ++i) {
      if(associationIdsToAdd[i].key === association.targetModelLc) {
        return associationIdsToAdd[i].ids;
      }
    }
    //if not found
    return [];
  }

  function getIdsToRemove() {
    //find current association excluded ids to remove
    for(var i=0; i<associationIdsToRemove.length; ++i) {
      if(associationIdsToRemove[i].key === association.targetModelLc) {
        return associationIdsToRemove[i].ids;
      }
    }
    //if not found
    return [];
  }

  /*
    Handlers
  */
  const handleAssociationClick = (event, item, index) => {
    //update current association object
    setAssociationTitle(item.label);
    setAssociation(getAssociationNames(item));
    setAssociationSelected(index);
  }

  /*
    Render
  */
  return (
    <Fade in={true} timeout={500}>
      <Grid
        className={classes.root} 
        container 
        justify='center'
        alignItems='flex-start'
        spacing={0}
      > 

        {/* Menu Tabs: Associations */}
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7} className={classes.menu}>
          <AssociationMenuTabs
            associationItems={associationItems}
            associationSelected={associationSelected}
            handleClick={handleAssociationClick}
          />
        </Grid>

        {/* Compact List */}
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
          <AssociationCompactView
            modelNames={modelNames}
            item={item}
            title={associationTitle}
            titleB={associationTitle}
            associationNames={association}
            idsToAdd={getIdsToRemove()}
            handleTransfer={handleTransferToRemove}
            handleUntransfer={handleUntransferFromRemove}
          />
        </Grid>

      </Grid>
    </Fade>
  );
}
/*
  PropTypes
*/