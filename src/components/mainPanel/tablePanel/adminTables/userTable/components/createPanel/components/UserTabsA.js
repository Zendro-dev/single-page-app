import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  actions: {
    height:'100%',
  },
  buttonR: {
    marginRight: theme.spacing(1),
  }
}));

export default function UserTabsA(props) {
  const classes = useStyles();
  const { 
    value, 
    handleChange,
  } = props;

  return (
    <div className={classes.root}>
      <Grid container justify='center'>
        <Grid item xs={12}>

          {/* Menú */}
          <Grid container justify='center'>

            <Grid container justify='center'>
              <Grid item xs={12}>
                {/* Divider */}
                <Divider orientation="horizontal" />
              </Grid>
            </Grid>
            
            {/* Tabs */}
            <Grid item xs={12}>
              <Tabs
                value={value}
                onChange={(event, newValue) => {
                  if (handleChange !== undefined) {
                    handleChange(event, newValue);
                  }
                }}>
                <Tab value={0} label="Attributes" />
                <Tab value={1} label="Associations" />
              </Tabs>
            </Grid>
          </Grid>

          <Grid container justify='center'>
            <Grid item xs={12}>
              {/* Divider */}
              <Divider orientation="horizontal" />
            </Grid>
          </Grid>

        </Grid>
      </Grid>

    </div>
  );
}
UserTabsA.propTypes = {
  value: PropTypes.number.isRequired,
  handleChange: PropTypes.function.isRequired,
};
