import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

export default function AssociationsPage(props) {
  const {
    associationSelected,
    handleClick,
  } = props;

  return (
    <div>
      <Tabs
        value={associationSelected}
        onChange={handleClick}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab key='roles' label='Roles' value='role' />
      </Tabs>
    </div>
  );
}
/*
  PropTypes
*/
UserAssociationsPage.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.function.isRequired,
};