import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import AssociationToAddTransferView from './associationToAddTransferView/AssociationToAddTransferView'
import AssociationToRemoveTransferView from './associationToRemoveTransferView/AssociationToRemoveTransferView'
import AssociationMenuList from './AssociationsMenuList'
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
    handleTransferToAdd,
    handleUntransferFromAdd,
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

    console.log("@@init@@: Associations IDs to ADD: ", associationIdsToAdd);

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
    <div hidden={hidden}>
      <Fade in={!hidden} timeout={500}>
        <Grid
          className={classes.root} 
          container 
          justify='flex-end'
          alignItems='flex-start'
          spacing={0}
        > 
          {/* Menu List: Associations */}
          {(!matchesDownXs) && (
            <Grid item sm={2} className={classes.menu}>
              <AssociationMenuList
                associationItems={associationItems}
                associationSelected={associationSelected}
                handleClick={handleAssociationClick}
              />
            </Grid>
          )}

          {/* Menu Tabs: Associations */}
          {(matchesDownXs) && (
            <Grid item xs={12} className={classes.menu}>
              <AssociationMenuTabs
                associationItems={associationItems}
                associationSelected={associationSelected}
                handleClick={handleAssociationClick}
              />
            </Grid>
          )}
          
          {/* ToAdd Transfer Lists */}
          <Grid item xs={11} sm={9}>
            <AssociationToAddTransferView
              modelNames={modelNames}
              item={item}
              title={associationTitle}
              titleB={associationTitle}
              associationNames={association}
              idsToAdd={getIdsToAdd()}
              handleTransfer={handleTransferToAdd}
              handleUntransfer={handleUntransferFromAdd}
            />
          </Grid>

          {/* ToRemove Transfer Lists */}
          <Grid item xs={11} sm={9}>
            <AssociationToRemoveTransferView
              modelNames={modelNames}
              item={item}
              title={associationTitle}
              titleB={associationTitle}
              associationNames={association}
              idsToAdd={getIdsToAdd()}
              handleTransfer={handleTransferToAdd}
              handleUntransfer={handleUntransferFromAdd}
            />
          </Grid>

        </Grid>
      </Fade>
    </div>
  );
}
/*
  PropTypes
*/