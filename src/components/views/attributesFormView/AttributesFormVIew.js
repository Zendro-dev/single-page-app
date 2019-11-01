import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { VariableSizeList as List } from 'react-window';
import StringField from './components/StringField'
import IntField from './components/IntField'

/*
  Material-UI components
*/
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

/*
  Styles
*/
const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(10),
  },
  card: {
    margin: 'auto',
    overflow: 'auto',
    textAlign: 'center',
    height: '100%',
    maxHeight: '80vh'
  },
  cardContent: {
    margin: 'auto',
  }
}));

export default function CreateView(props) {
  /*
    Styles
  */
  const classes = useStyles();

  /*
    Properties
  */
  const { items } = props;
  
  /*
    State
  */


  /*
    Hooks
  */
  useEffect(() => {
    console.log("@@- items: ", items);
  }, []);

  /*
    Handlers
  */
  const handleValueChange = (event, value) => {
    console.log("@@- handleValueChange: ", value);
  }

  /*
    Render
  */
  return (
    <div className={classes.root}>
      <Grid container justify='center'>
        <Grid item xs={12}>
          <Box className={classes.card}>
            
          
              {items.map(item => {
                return (
          
                  <CardContent key={item.key} >

                    {/* Case: String */}
                    {(item.type === 'String') && (
                      <StringField
                        label={item.label}
                        handleChange={handleValueChange}
                      />
                    )}

                    {/* Case: Int */}
                    {(item.type === 'Int') && (
                      <IntField
                        label={item.label}
                        handleChange={handleValueChange}
                      />
                    )}

                  </CardContent>
            
                );
              })}
           
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

/*
  PropTypes
*/
CreateView.propTypes = {
  items: PropTypes.array.isRequired,
};