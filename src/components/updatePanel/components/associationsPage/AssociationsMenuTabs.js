import React, { useState, useEffect, useRef } from 'react';

/*
  Material-UI components
*/
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

/*
  Styles
*/
const useStyles = makeStyles(theme => ({
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
    console.log("items: ", associationItems);
  }, []);

  /*
    Methods
  */
  const handleChange = (event, newValue) => {
    //callback
    handleClick(event, associationItems[newValue], newValue);
  };
  
  /*
    Handlers
  */

  /*
    Render
  */
  return (
    <div>
      <Tabs
        value={associationSelected}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
      >
        {associationItems.map((item, index) => {
          return (
            <Tab key={item.key} label={item.label} value={index} />
          )
        })}
      </Tabs>
    </div>
  );
}
/*
  PropTypes
*/