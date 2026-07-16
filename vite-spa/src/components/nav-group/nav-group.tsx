import React, { ReactElement, useState } from 'react';

import {
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListProps,
  Typography,
} from '@mui/material';

import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';

import { SvgIconType } from '@/types/elements';

export interface NavGroupProps extends ListProps {
  icon?: SvgIconType;
  label: string;
}

export default function NavGroup({
  icon: Icon,
  label,
  children,
  ...props
}: NavGroupProps): ReactElement {
  const [showGroup, setShowGroup] = useState(true);
  return (
    <List {...props} disablePadding>
      <Divider />
      <ListItem
        component="button"
        button
        onClick={() => setShowGroup((state) => !state)}
      >
        {Icon && (
          <ListItemIcon>
            <Icon />
          </ListItemIcon>
        )}
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
