import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

/*
  Material-UI components
*/
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';


/*
  Styles
*/
const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(0),
  },
  paper: {
    margin: theme.spacing(1),
  },
}));

export default function DetailView(props) {
  /*
    Styles
  */
  const classes = useStyles();

  /*
    Properties
  */
  const { headCells, item } = props;
  
  /*
    Render
  */
  return (
    <div className={classes.root}>
      <Grid container justify='center'>
        <Grid item xs={12}>
          <Card className={classes.paper}>

            {/* Item fields */}
            {headCells.map(head => (
              <CardContent key={head.key}>

                <Typography variant="h5">
                  {head.label}
                </Typography>
                
                <Typography color="textSecondary">
                  {item[head.name]}
                </Typography>

              </CardContent>
            ))}

          </Card>
        </Grid>
      </Grid>
    </div>
  );
}

/*
  PropTypes
*/
DetailView.propTypes = {
  item: PropTypes.object.isRequired,
  headCells: PropTypes.array.isRequired,
};