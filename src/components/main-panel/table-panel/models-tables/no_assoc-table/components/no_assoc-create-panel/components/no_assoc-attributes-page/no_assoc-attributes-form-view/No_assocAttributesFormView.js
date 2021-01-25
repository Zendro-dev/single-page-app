import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Attributes from '@material-ui/icons/HdrWeakTwoTone';
import Key from '@material-ui/icons/VpnKey';
import Tooltip from '@material-ui/core/Tooltip';
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
    margin: theme.spacing(0),
    maxHeight: '70vh',
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
}));

export default function NoAssocAttributesFormView(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { valueOkStates,
          valueAjvStates,
          handleSetValue,
        } = props;

  function getItemsOk() {
    let countOk=0;
    let a = Object.entries(valueOkStates);
    for(let i=0; i<a.length; ++i) {
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
            {/*
              Internal ID
            */}
            {/* idField */}
            <CardContent key='idField' className={classes.cardContent} >
              <Grid container alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
                <Grid item>

                  <StringField
                    itemKey='idField'
                    name='idField'
                    label='idField'
                    valueOk={valueOkStates.idField}
                    valueAjv={valueAjvStates.idField}
                    autoFocus={true}
                    handleSetValue={handleSetValue}
                  />

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
                valueOk={valueOkStates.stringField}
                valueAjv={valueAjvStates.stringField}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* intField */}
            <CardContent key='intField' className={classes.cardContent} >
              <IntField
                itemKey='intField'
                name='intField'
                label='intField'
                valueOk={valueOkStates.intField}
                valueAjv={valueAjvStates.intField}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* floatField */}
            <CardContent key='floatField' className={classes.cardContent} >
              <FloatField
                itemKey='floatField'
                name='floatField'
                label='floatField'
                valueOk={valueOkStates.floatField}
                valueAjv={valueAjvStates.floatField}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* datetimeField */}
            <CardContent key='datetimeField' className={classes.cardContent} >
              <DateTimeField
                itemKey='datetimeField'
                name='datetimeField'
                label='datetimeField'
                valueOk={valueOkStates.datetimeField}
                valueAjv={valueAjvStates.datetimeField}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* booleanField */}
            <CardContent key='booleanField' className={classes.cardContent} >
              <BoolField
                itemKey='booleanField'
                name='booleanField'
                label='booleanField'
                valueOk={valueOkStates.booleanField}
                valueAjv={valueAjvStates.booleanField}
                handleSetValue={handleSetValue}
              />
            </CardContent>

            {/* stringArrayField */}
            <CardContent key='stringArrayField' className={classes.cardContent} >
              <ArrayField
                itemKey='stringArrayField'
                name='stringArrayField'
                label='stringArrayField'
                valueOk={valueOkStates.stringArrayField}
                valueAjv={valueAjvStates.stringArrayField}
                handleSetValue={handleSetValue}
                arrayType='String'
              />
            </CardContent>

            {/* intArrayField */}
            <CardContent key='intArrayField' className={classes.cardContent} >
              <ArrayField
                itemKey='intArrayField'
                name='intArrayField'
                label='intArrayField'
                valueOk={valueOkStates.intArrayField}
                valueAjv={valueAjvStates.intArrayField}
                handleSetValue={handleSetValue}
                arrayType='Int'
              />
            </CardContent>

            {/* floatArrayField */}
            <CardContent key='floatArrayField' className={classes.cardContent} >
              <ArrayField
                itemKey='floatArrayField'
                name='floatArrayField'
                label='floatArrayField'
                valueOk={valueOkStates.floatArrayField}
                valueAjv={valueAjvStates.floatArrayField}
                handleSetValue={handleSetValue}
                arrayType='Float'
              />
            </CardContent>

            {/* datetimeArrayField */}
            <CardContent key='datetimeArrayField' className={classes.cardContent} >
              <ArrayField
                itemKey='datetimeArrayField'
                name='datetimeArrayField'
                label='datetimeArrayField'
                valueOk={valueOkStates.datetimeArrayField}
                valueAjv={valueAjvStates.datetimeArrayField}
                handleSetValue={handleSetValue}
                arrayType='DateTime'
              />
            </CardContent>

            {/* booleanArrayField */}
            <CardContent key='booleanArrayField' className={classes.cardContent} >
              <ArrayField
                itemKey='booleanArrayField'
                name='booleanArrayField'
                label='booleanArrayField'
                valueOk={valueOkStates.booleanArrayField}
                valueAjv={valueAjvStates.booleanArrayField}
                handleSetValue={handleSetValue}
                arrayType='Boolean'
              />
            </CardContent>
                        
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
NoAssocAttributesFormView.propTypes = {
  valueOkStates: PropTypes.object.isRequired,
  valueAjvStates: PropTypes.object.isRequired,
  handleSetValue: PropTypes.func.isRequired,
};