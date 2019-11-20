import React from 'react';
import PropTypes from 'prop-types';
import StringField from './components/StringField'
import DateField from './components/DateField'
import TimeField from './components/TimeField'
import BoolField from './components/BoolField'
import DateTimeField from './components/DateTimeField'
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
          handleBlur, 
          handleFieldReady, 
          handleChange,
          handleKeyDown,
        } = props;

  function itemHasKey(item, index) {
    if (item !== undefined) {
      return item.key === this.key;
    } else {
      return false;
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
                        
            {/* Email */}
            <CardContent key='email' className={classes.cardContent} >
              <StringField
                itemKey='email'
                name='email'
                label='Email'
                valueOk={getValueOkStatus('email')}
                //autoFocus={true}
                handleBlur={handleBlur}
                handleReady={handleFieldReady}
                handleChange={handleChange}
                handleKeyDown={handleKeyDown}
              />
            </CardContent>

            {/* Password */}
            <CardContent key='password' className={classes.cardContent} >
              <StringField
                itemKey='password'
                name='password'
                label='Password'
                valueOk={getValueOkStatus('password')}
                handleBlur={handleBlur}
                handleReady={handleFieldReady}
                handleChange={handleChange}
                handleKeyDown={handleKeyDown}
              />
            </CardContent>

            {/* Date test */}
            <CardContent key='date' className={classes.cardContent} >
              <DateField
                itemKey='date'
                name='date'
                label='Date'
                text='2019-11-20'
                valueOk={1}
                autoFocus={false}
                handleBlur={handleBlur}
                handleReady={handleFieldReady}
                handleChange={handleChange}
                handleKeyDown={handleKeyDown}
              />
            </CardContent>

            {/* Time test */}
            <CardContent key='time' className={classes.cardContent} >
              <TimeField
                itemKey='time'
                name='time'
                label='Time'
                //text='2019-11-20'
                valueOk={1}
                autoFocus={true}
                handleBlur={handleBlur}
                handleReady={handleFieldReady}
                handleChange={handleChange}
                handleKeyDown={handleKeyDown}
              />
            </CardContent>

            {/* DateTime test */}
            <CardContent key='datetime' className={classes.cardContent} >
              <DateTimeField
                itemKey='datetime'
                name='datetime'
                label='Datetime'
                //text='2019-11-20'
                valueOk={1}
                autoFocus={true}
                handleBlur={handleBlur}
                handleReady={handleFieldReady}
                handleChange={handleChange}
                handleKeyDown={handleKeyDown}
              />
            </CardContent>

            {/* Bool test */}
            <CardContent key='bool' className={classes.cardContent} >
              <BoolField
                itemKey='bool'
                name='bool'
                label='Bool'
                //text='2019-11-20'
                valueOk={0}
                autoFocus={true}
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
  handleBlur: PropTypes.func.isRequired,
  handleFieldReady: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleKeyDown: PropTypes.func.isRequired,
};