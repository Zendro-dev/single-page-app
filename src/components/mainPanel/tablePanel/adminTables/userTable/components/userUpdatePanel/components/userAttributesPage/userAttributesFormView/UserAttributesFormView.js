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
  const { item, 
          valueOkStates, 
          handleBlur, 
          handleFieldReady, 
          handleChange,
          handleKeyDown,
        } = props;

  function itemHasKey(item, index) {
    if(item !== undefined) {
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
            
            {/* Id */}
            <CardContent key='id' className={classes.cardContent}>
              <Typography variant="h6" display="inline">Id:</Typography>
              <Typography variant="h6" display="inline" color="textSecondary">&nbsp;{item.id}</Typography>
            </CardContent>
                        
            {/* Email */}
            <CardContent key='email' className={classes.cardContent} >
              <StringField
                itemKey='email'
                name='email'
                label='Email'
                text={item.email}
                valueOk={getValueOkStatus('email')}
                handleBlur={handleBlur}
                handleReady={handleFieldReady}
                handleChange={handleChange}
                handleKeyDown={handleKeyDown}
              />
            </CardContent>

            {/* Password */}
            <CardContent key='password' className={classes.cardContent}>
              <StringField
                itemKey='password'
                name='password'
                label='Password'
                text={item.password}
                valueOk={getValueOkStatus('password')}
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
  item: PropTypes.object.isRequired,
  valueOkStates: PropTypes.array.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleFieldReady: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleKeyDown: PropTypes.func.isRequired,
};

