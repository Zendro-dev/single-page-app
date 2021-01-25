import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Attributes from '@material-ui/icons/HdrWeakTwoTone';
import Key from '@material-ui/icons/VpnKey';
import ArrayField from './components/ArrayField'

import StringField from './components/StringField'

import IntField from './components/IntField'

import FloatField from './components/FloatField'

import DateTimeField from './components/DateTimeField'

import BoolField from './components/BoolField'

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
  },
  card: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    maxHeight: '57vh',
    overflow: 'auto',
  },
  cardB: {
    margin: theme.spacing(0),
    padding: theme.spacing(0),
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

export default function NoAssocAttributesFormView(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { item, valueOkStates } = props;

  function getItemsOk() {
    let countOk=0;
    let a = Object.entries(valueOkStates);
    for( let i=0; i<a.length; ++i ) {
      if(a[i][1] === 1) {
        countOk++;
      }
    }
    return countOk;
  }

  return (
    <div id='NoAssocAttributesFormView-div-root' className={classes.root}>
      <Grid container justify='center'>
        <Grid item xs={12}>
            
          <Card className={classes.cardB} elevation={0}>
            {/* Header */}
            <CardHeader
              avatar={
                <Attributes color="primary" fontSize="small" />
              }
              title={
                <Typography variant="h6">
                    { t('modelPanels.model') + ': No_assoc' }
                </Typography>
              }
              subheader={getItemsOk()+' / 11 ' + t('modelPanels.completed')}
            >
            </CardHeader>
          </Card>

          <Card className={classes.card}>
            {/* 
              Fields 
            */}
            {/* idField*/}
            <CardContent key='idField' className={classes.cardContent}>
              <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                <Grid item>
                  <Typography variant="h6" display="inline">idField:</Typography>
                  <Typography variant="h6" display="inline" color="textSecondary">&nbsp;{item.idField}</Typography>
                </Grid>
                {/*Key icon*/}
                <Grid item>
                  <Tooltip title={ t('modelPanels.internalId', 'Unique Identifier') }>
                    <Key fontSize="small" color="disabled" style={{ marginTop:8}} />
                  </Tooltip>
                </Grid>
              </Grid>
            </CardContent>

            {/* stringField */}
            <CardContent key='stringField' className={classes.cardContent} >
              <StringField
                itemKey='stringField'
                name='stringField'
                label='stringField'
                text={item.stringField}
                valueOk={valueOkStates.stringField}
              />
            </CardContent>

            {/* intField */}
            <CardContent key='intField' className={classes.cardContent} >
              <IntField
                itemKey='intField'
                name='intField'
                label='intField'
                text={item.intField}
                isForeignKey={false}
                valueOk={valueOkStates.intField}
              />
            </CardContent>

            {/* floatField */}
            <CardContent key='floatField' className={classes.cardContent} >
              <FloatField
                itemKey='floatField'
                name='floatField'
                label='floatField'
                text={item.floatField}
                valueOk={valueOkStates.floatField}
              />
            </CardContent>

            {/* datetimeField */}
            <CardContent key='datetimeField' className={classes.cardContent} >
              <DateTimeField
                itemKey='datetimeField'
                name='datetimeField'
                label='datetimeField'
                text={item.datetimeField}
                valueOk={valueOkStates.datetimeField}
              />
            </CardContent>

            {/* booleanField */}
            <CardContent key='booleanField' className={classes.cardContent} >
              <BoolField
                itemKey='booleanField'
                name='booleanField'
                label='booleanField'
                text={item.booleanField}
                valueOk={valueOkStates.booleanField}
              />
            </CardContent>

            {/* stringArrayField */}
            <CardContent key='stringArrayField' className={classes.cardContent} >
              <ArrayField
                itemKey='stringArrayField'
                name='stringArrayField'
                label='stringArrayField'
                text={item.stringArrayField}
                valueOk={valueOkStates.stringArrayField}
              />
            </CardContent>

            {/* intArrayField */}
            <CardContent key='intArrayField' className={classes.cardContent} >
              <ArrayField
                itemKey='intArrayField'
                name='intArrayField'
                label='intArrayField'
                text={item.intArrayField}
                valueOk={valueOkStates.intArrayField}
              />
            </CardContent>

            {/* floatArrayField */}
            <CardContent key='floatArrayField' className={classes.cardContent} >
              <ArrayField
                itemKey='floatArrayField'
                name='floatArrayField'
                label='floatArrayField'
                text={item.floatArrayField}
                valueOk={valueOkStates.floatArrayField}
              />
            </CardContent>

            {/* datetimeArrayField */}
            <CardContent key='datetimeArrayField' className={classes.cardContent} >
              <ArrayField
                itemKey='datetimeArrayField'
                name='datetimeArrayField'
                label='datetimeArrayField'
                text={item.datetimeArrayField}
                valueOk={valueOkStates.datetimeArrayField}
              />
            </CardContent>

            {/* booleanArrayField */}
            <CardContent key='booleanArrayField' className={classes.cardContent} >
              <ArrayField
                itemKey='booleanArrayField'
                name='booleanArrayField'
                label='booleanArrayField'
                text={item.booleanArrayField}
                valueOk={valueOkStates.booleanArrayField}
              />
            </CardContent>

          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
NoAssocAttributesFormView.propTypes = {
  item: PropTypes.object.isRequired,
  valueOkStates: PropTypes.object.isRequired,
};