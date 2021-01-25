import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useTranslation } from 'react-i18next';

export default function RoleToUserAssociationsMenuTabs(props) {
  const { t } = useTranslation();
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
        <Tab id='RoleToUserUpdatePanel-tabsA-button-noAssociations' 
          key='no-associations' label={ t('modelPanels.noAssociations') } value='no-associations' />
      </Tabs>
    </div>
  );
}
RoleToUserAssociationsMenuTabs.propTypes = {
  associationSelected: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};