import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
}));

export default function RoleToUserTabsA(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { 
    value, 
    handleChange,
  } = props;

  return (
    <div className={classes.root}>
      <Tabs 
        value={value} 
        onChange={(event, newValue)=> {
          if (handleChange !== undefined) {
            handleChange(event, newValue);
          }
        }}>
        <Tab id='RoleToUserUpdatePanel-tabsA-button-attributes' value={0} label={ t('modelPanels.attributes') } />
        <Tab id='RoleToUserUpdatePanel-tabsA-button-associations' value={1} label={ t('modelPanels.associations') } />
      </Tabs>
      
      {/* Divider */}
      <Divider orientation="horizontal" />
    </div>
  );
}
RoleToUserTabsA.propTypes = {
  value: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
};
