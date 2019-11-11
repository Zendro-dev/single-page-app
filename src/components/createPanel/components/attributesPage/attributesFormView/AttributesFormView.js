import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import StringField from './components/StringField'
import IntField from './components/IntField'

/*
  Material-UI components
*/
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
//icons
import NewRecord from '@material-ui/icons/NoteAddTwoTone';
import Attributes from '@material-ui/icons/HdrWeakTwoTone';

/*
  Styles
*/
const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2),
  },
  card: {
    margin: theme.spacing(1),
    maxHeight: '77vh',
    overflow: 'auto',
  },
  cardContent: {
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
    minWidth: 200,
  },
  ibox: {
    padding: theme.spacing(2),
  },
}));

export default function AttributesFormView(props) {
  /*
    Styles
  */
  const classes = useStyles();

  /*
    Properties
  */
  const { modelNames, items, valueOkStates, 
          handleFocus, handleBlur, 
          handleFieldReady, handleChange,
          handleKeyDown,
        } = props;

  /*
    Hooks
  */
  useEffect(() => {
    console.log("@@- items: ", items);

  }, []);

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

  function getValueOkStatus(key) {
    let it = undefined;

    //find index
    if(valueOkStates.length > 0) {
      it = valueOkStates.find(itemHasKey, {key:key});
    }
    //return status
    if(it !== undefined) {
      return it.valueOk;
    } else {
      return 0;
    }
  }

  function getItemsOk() {
    let countOk=0;
    if(valueOkStates.length > 0) {
      for(var i=0; i<valueOkStates.length; ++i)
      {
        if(valueOkStates[i].valueOk === 1) {
          countOk++;
        }
      }
    }
    return countOk;
  }

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
          <Card className={classes.card} 
            //elevation={0}
          >
            {/* Header */}
            <CardHeader
              avatar={
                <Attributes color="primary" fontSize="small" />
              }
              title={
                <Typography variant="h6">
                  {modelNames.nameCp+" attributes"}
                </Typography>
              }
              subheader={getItemsOk()+' / '+items.length+' completed'}
            >
            </CardHeader>
            
            {/* Fields */}
            {items.map((item, index) => {
              var valueOk = getValueOkStatus(item.key);
              
              return (
                <CardContent key={item.key} className={classes.cardContent} >

                  {/* Case: String */}
                  {(item.type === 'String') && (
                    <StringField
                      itemKey={item.key}
                      name={item.name}
                      label={item.label}
                      valueOk={valueOk}
                      handleChange={handleValueChange}
                      handleFocus={handleFocus}
                      handleBlur={handleBlur}
                      handleReady={handleFieldReady}
                      handleChange={handleChange}
                      handleKeyDown={handleKeyDown}
                    />
                  )}

                  {/* Case: Int */}
                  {(item.type === 'Int') && (
                    <IntField
                      itemKey={item.key}
                      name={item.name}
                      label={item.label}
                      valueOk={valueOk}
                      handleChange={handleValueChange}
                      handleFocus={handleFocus}
                      handleBlur={handleBlur}
                      handleReady={handleFieldReady}
                      handleChange={handleChange}
                      handleKeyDown={handleKeyDown}
                    />
                  )}

                </CardContent>
              );
            })}

          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

/*
  PropTypes
*/
AttributesFormView.propTypes = {
  items: PropTypes.array.isRequired,
};