import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ListItem,
  ListItemText,
  Typography,
  ListItemIcon,
  Collapse,
  List,
  Divider,
} from '@material-ui/core';
import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from '@material-ui/icons';

// import { useTranslation } from 'react-i18next';

const GetIcon = ({ icon }) => {
  return icon === 'expandLess' ? (
    <ExpandLessIcon id={'MainPanel-listItem-icon-models-expandLess'} />
  ) : (
    <ExpandMoreIcon id={'MainPanel-listItem-icon-models-expandMore'} />
  );
};

export default function NavGroup({ icon, label, to, ...props }) {
  // const { t, i18n } = useTranslation();

  const [isOpen, setIsOpen] = useState(true);

  const handleNavGroupClick = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <ListItem
        button
        component={Link}
        to={to}
        id={'MainPanel-listItem-button-models'}
        onClick={handleNavGroupClick}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText
          primary={
            <Typography
              id={'MainPanel-listItemText-button-typography-title-models'}
              noWrap={true}
            >
              <b>{label}</b>
            </Typography>
          }
        />
        {props.children && (
          <GetIcon icon={isOpen ? 'expandLess' : 'expandMore'} />
        )}
      </ListItem>
      <Collapse
        id={'MainPanel-collapse-models'}
        in={isOpen}
        timeout="auto"
        unmountOnExit
      >
        <List
          id={'MainPanel-collapse-list-models'}
          component="div"
          disablePadding
        >
          {props.children}
        </List>
      </Collapse>
      <Divider />
    </>
  );
}
