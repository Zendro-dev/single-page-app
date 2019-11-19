import React from 'react';
import PropTypes from 'prop-types';
import UserAttributesFormView from './userAttributesFormView/UserAttributesFormView'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
  },
}));

export default function UserAttributesPage(props) {
  const classes = useStyles();
  const {
    item,
    valueOkStates,
  } = props;

  return (
    <Fade in={true} timeout={500}>
      <Grid
        className={classes.root} 
        container justify='center' 
        alignItems='flex-start'
        spacing={0}
      > 
        {/* Attributes Form View */}
        <Grid item xs={12} sm={10} md={9} lg={8} xl={7}>
          <UserAttributesFormView
            item={item}
            valueOkStates={valueOkStates}
          />
        </Grid>
      </Grid>
    </Fade>
  );
}
UserAttributesPage.propTypes = {
  item: PropTypes.object.isRequired,
  valueOkStates: PropTypes.array.isRequired,
};