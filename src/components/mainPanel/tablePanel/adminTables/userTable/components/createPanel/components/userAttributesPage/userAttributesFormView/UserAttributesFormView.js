import React from 'react';
import PropTypes from 'prop-types';
import StringField from './components/StringField'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Attributes from '@material-ui/icons/HdrWeakTwoTone';

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
}));

export default function UserAttributesFormView(props) {
  const classes = useStyles();
  const { valueOkStates, 
          handleFocus, handleBlur, 
          handleFieldReady, handleChange,
          handleKeyDown,
        } = props;

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

  return (
    <div className={classes.root}>
      <Grid container justify='center'>
        <Grid item xs={12}>
          <Card className={classes.card}>

            {/* Header */}
            <CardHeader
              avatar={
                <Attributes color="primary" fontSize="small" />
              }
              title={
                <Typography variant="h6">
                  User attributes
                </Typography>
              }
              subheader={getItemsOk()+' / 2 completed'}
            >
            </CardHeader>
            
            {/* 
              Fields 
            */}
            
            {/* Id */}
            <CardContent key='id' className={classes.cardContent}>
              <Typography variant="h6" display="inline">Id:</Typography>
              <Typography variant="h6" display="inline" color="textSecondary">&nbsp;{item.id}</Typography>
            </CardContent>
                        
            {/* Name */}
            <CardContent key='name' className={classes.cardContent} >
              <StringField
                itemKey='name'
                name='name'
                label='Name'
                valueOk={getValueOkStatus('name')}
                handleFocus={handleFocus}
                handleBlur={handleBlur}
                handleReady={handleFieldReady}
                handleChange={handleChange}
                handleKeyDown={handleKeyDown}
              />
            </CardContent>

            {/* Description */}
            <CardContent key='description' className={classes.cardContent} >
              <StringField
                itemKey='description'
                name='description'
                label='Description'
                valueOk={getValueOkStatus('description')}
                handleFocus={handleFocus}
                handleBlur={handleBlur}
                handleReady={handleFieldReady}
                handleChange={handleChange}
                handleKeyDown={handleKeyDown}
              />
            </CardContent>

          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
UserAttributesFormView.propTypes = {
  valueOkStates: PropTypes.array.isRequired,
  handleFocus: PropTypes.function.isRequired,
  handleBlur: PropTypes.function.isRequired,
  handleFieldReady: PropTypes.function.isRequired,
  handleChange: PropTypes.function.isRequired,
  handleKeyDown: PropTypes.function.isRequired,
};