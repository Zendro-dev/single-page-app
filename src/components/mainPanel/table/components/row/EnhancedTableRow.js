import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CompactListView from '../../../../compactListView/CompactListView'
import AssociationsTabs from './components/AssociationsTabs'
import AssociationsTypesTabs from './components/AssociationTypesTabs'
import DetailView from '../../../../detailView/DetailView'

/*
  Material-UI components
*/
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';

/*
  Styles
*/
const useDetailRowStyles = makeStyles(theme => ({
  root: {
    backgroundColor: "#ffffff"
  },
  associationsRootGrid: {
    flexGrow: 1,
  },
  htabs: {
    maxWidth: '50vw',
  },
  associationTab: {
    height: 56,   //2 lines
    maxHeight: 56
  },
  vtabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  associationTypeTab: {
    height: 56,   //2 lines
    maxHeight: 56
  },
  badgePadding: {
    padding: theme.spacing(0, 2),
  },
}));
/*
  Component
*/
export default function EnhancedTableRow(props) {
  /*
    Styles
  */
  const classes = useDetailRowStyles();

  /*
    Properties
  */
  const { modelNames, item, headCells, toOnes, toManys } = props;

  /*
    State
  */
  const [ready, setReady] = useState(false);
  const [associationTypeSelected, setAssociationTypeSelected] = useState(0);
  const [associationToManySelected, setAssociationToManySelected] = useState(false);
  const [associationToOneSelected, setAssociationToOneSelected] = useState(false);
  const [association, setAssociation] = useState(undefined);
  const [associationReady, setAssociationReady] = useState(false);
  
  /*
    Effect
  */
  useEffect(() => {

    //select approtiate association type
    setAssociationTypeSelected(getInitialAssociationTypeSelected);

    //ready
    setReady(true);

    return function cleanup() { setReady(false) };
  }, []);

  useEffect(() => {

    console.log("@hook@: AssociationTypeSelected: updated: ", associationTypeSelected)

  }, [associationTypeSelected]);

  useEffect(() => {

    console.log("@hook@: associationToManySelected: updated: ", associationToManySelected)

  }, [associationToManySelected]);

  useEffect(() => {

    console.log("@hook@: associationToOneSelected: updated: ", associationToOneSelected)

  }, [associationToOneSelected]);

  useEffect(() => {

    console.log("@hook@: association: updated: ", association)

    if(association !== undefined) {
      setAssociationReady(true);
    }
    else {
      setAssociationReady(false);
    }
  }, [association]);


  /*
    Handlers
  */
  const handleAssociationTypeChange = (event, newValue) => {
    setAssociationTypeSelected(newValue);   
  };

  const handleAssociationTabClick = (event, associationType, associationIndex, associationObj) => {
    /*
      0  toOne
      1  toMany
    */
    if(associationType === 0) {
      //case: ToOne association
      setAssociationToOneSelected(associationIndex);
    }
    else if (associationType === 1) {
      //case: ToMany association
      setAssociationToManySelected(associationIndex);
    }

    setAssociation(associationObj);
  }

  /*
    Methods
  */
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

  /*
    Render
  */
  return (
    <Collapse in={ready}>
      <Card raised={false}  className={classes.root} bgcolor="text.disabled">

        {/* DetailView */}
        <DetailView item={item} headCells={headCells} />

        {/* Associations */}
        <CardContent>
          <Grid container className={classes.associationsRootGrid}>
            
            {/* Title */}
            <Grid item xs={12}>
              <Grid container justify="flex-start">
                <Grid item>
                  <Typography variant="h6" color="primary">
                    Associations
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            {/* 
              Association types tabs  |   Association tabs
              ------------------------|----------------------------
                To Manys              |   ToManys.1  ToManys.2  ...  
                To Ones               |   ToOnes.1   ToOnes.2   ...
            */}
            <Grid item xs={12}>
              <Grid
                container justify="flex-start"
                alignItems={(associationTypeSelected === 0) ? "flex-start" : "flex-end"}
                spacing={1}
              >

                <Grid item>
                  <AssociationsTypesTabs
                    toOnesLength={toOnes.length}
                    toManysLength={toManys.length}
                    associationTypeSelected={associationTypeSelected}
                    classes={classes}
                    onAssociationTypeChange={handleAssociationTypeChange}
                  />
                </Grid>

                <Grid item >
                  <AssociationsTabs
                    toOnes={toOnes}
                    toManys={toManys}
                    associationTypeSelected={associationTypeSelected}
                    associationToManySelected={associationToManySelected}
                    associationToOneSelected={associationToOneSelected}
                    classes={classes}
                    onAssociationTabClick={handleAssociationTabClick}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>

        {/* Compact List View */}
        {(associationReady) && (
          <CompactListView
            title={association.relationNameCp}
            modelNames={modelNames}
            itemId={Number(item.id)}
            associationNames={association}
          />
        )}
        
      </Card>
    </Collapse>
  )//end: return
}//end: function RoleDetailRow2()

/*
  PropTypes
*/
EnhancedTableRow.propTypes = {
  item: PropTypes.object.isRequired,
  toOnes: PropTypes.array.isRequired,
  toManys: PropTypes.array.isRequired,
  headCells: PropTypes.array.isRequired,
  modelNames: PropTypes.object.isRequired,
};