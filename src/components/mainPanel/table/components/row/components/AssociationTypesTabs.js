import React from 'react';
import PropTypes from 'prop-types';

/*
  Material-UI components
*/
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Badge from '@material-ui/core/Badge';

export default function AssociationTypesTabs(props) {
  /*
    Properties
  */
  const {
    toOnesLength, toManysLength, associationTypeSelected,
    classes, onAssociationTypeChange,
  } = props;

  /*
    Render
  */
  return (
    <Tabs
      orientation="vertical"
      variant="scrollable"
      value={associationTypeSelected}
      className={classes.vtabs}
      onChange={onAssociationTypeChange}
    >
      <Tab
        id='tab-to-one'
        key={0}
        value={0}
        className={classes.associationTypeTab}
        label={
          <Badge 
            className={classes.badgePadding} 
            color='secondary' 
            badgeContent={toOnesLength}
          >
            To-One
          </Badge>
        }
      />
      <Tab
        id='tab-to-many'
        key={1}
        value={1}
        className={classes.associationTypeTab}
        label={
          <Badge 
            className={classes.badgePadding} 
            color={(associationTypeSelected === 1) ? 'secondary' : 'default'} 
            badgeContent={toManysLength}
          >
            To-Many
          </Badge>
        }
      />
    </Tabs>
  )
}

/*
  PropTypes
*/
AssociationTypesTabs.propTypes = {
  toOnesLength: PropTypes.number.isRequired,
  toManysLength: PropTypes.number.isRequired,
  associationTypeSelected: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired,
  onAssociationTypeChange: PropTypes.func.isRequired,
};