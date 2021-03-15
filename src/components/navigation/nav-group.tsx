import React, { PropsWithChildren, ReactElement, useState } from 'react';

import {
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core';

import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from '@material-ui/icons';

import { SvgIconType } from '@/types/elements';

export interface NavGroupProps {
  icon: SvgIconType;
  label: string;
}

export default function NavGroup({
  icon: Icon,
  label,
  children,
}: PropsWithChildren<NavGroupProps>): ReactElement {
  const [showGroup, setShowGroup] = useState(true);
  return (
    <List disablePadding>
      <Divider />
      <ListItem
        component="button"
        button
        onClick={() => setShowGroup((state) => !state)}
      >
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
        <ListItemText
          primary={<Typography fontWeight="bold">{label}</Typography>}
        />
        {children && (showGroup ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
      </ListItem>
      <Collapse in={showGroup} timeout="auto" unmountOnExit>
        <List disablePadding>{children}</List>
      </Collapse>
    </List>
  );
}
