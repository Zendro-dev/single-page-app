import React, { useState, useEffect, useRef } from 'react';

/*
  Material-UI components
*/
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

/*
  Styles
*/
const useStyles = makeStyles(theme => ({
  listItemText: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

export default function AssociationsPage(props) {
  /*
    Styles
  */
  const classes = useStyles();

  /*
    Properties
  */
  const {
    associationItems,
    associationSelected,
    handleClick,
  } = props;
  
  /*
    State
  */
  
  /*
    Refs
  */
  
  /*
    Hooks
  */
  useEffect(() => {
  }, []);

  /*
    Methods
  */
  
  /*
    Handlers
  */

  /*
    Render
  */
  return (
    <div>
      <List dense component="div" role="list">
        {associationItems.map((item, index) => {
          return (
            <ListItem
              key={item.key}
              role="listitem"
              button
              //selected={selectedAssociationIndex === index}
              onClick={(event) => {
                //callback
                handleClick(event, item, index);
              }}
            >
              {/* Label */}
              <Typography
                className={classes.listItemText}
                variant="subtitle1"
                display="block"
                noWrap={true}
                color={associationSelected === index ? 'primary' : 'initial'}
              >
                {item.label}
              </Typography>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
/*
  PropTypes
*/