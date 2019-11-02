import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import StringField from './components/StringField'
import IntField from './components/IntField'

/*
  Material-UI components
*/
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import CardContent from '@material-ui/core/CardContent';

/*
  Styles
*/
const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(5),
  },
  box: {
    margin: 'auto',
    overflow: 'auto',
    textAlign: 'left',
    height: '100%',
    maxHeight: '80vh'
  },
  cardContent: {
    margin: 'auto',
    width: '100%',
    maxWidth: 600,
    minWidth: 200,
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
  const { items, itemFocusStates, 
          handleFocus, handleBlur, 
          handleFieldReady } = props;

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
          <Box className={classes.box} border={1} borderColor="primary.main" borderRadius="borderRadius">
          
              {items.map((item, index) => {
                
                return (
          
                  <CardContent key={item.key} className={classes.cardContent} >

                    {/* Case: String */}
                    {(item.type === 'String') && (
                      <StringField
                        itemKey={item.key}
                        label={item.label}
                        handleChange={handleValueChange}
                        handleFocus={handleFocus}
                        handleBlur={handleBlur}
                        handleReady={handleFieldReady}
                      />
                    )}

                    {/* Case: Int */}
                    {(item.type === 'Int') && (
                      <IntField
                        itemKey={item.key}
                        label={item.label}
                        handleChange={handleValueChange}
                        handleFocus={handleFocus}
                        handleBlur={handleBlur}
                        handleReady={handleFieldReady}
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