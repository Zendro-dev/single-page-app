import { useState } from 'react';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Box, Collapse, IconButton, List, Typography } from '@material-ui/core';

import {
  ExpandLess as CollapseIcon,
  ExpandMore as ExpandIcon,
} from '@material-ui/icons';

import { SvgIconType } from '@/types/elements';

import Item from './item';

export interface KeyValue {
  key: string;
  value: string;
  icon: SvgIconType;
}

export interface KeyValueMap {
  [key: string]: Omit<KeyValue, 'key'>;
}

export interface AccordionProps {
  label: string;
  text?: string;
  items: KeyValue[] | KeyValueMap;
}

export default function Accordion({
  label,
  text,
  items,
}: AccordionProps): React.ReactElement {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleOnToggle = (): void => {
    setOpen((state) => !state);
  };

  return (
    <Box
      className={classes.root}
      component="li"
      position="relative"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Box display="flex" alignItems="center">
        <IconButton className={classes.iconButton} onClick={handleOnToggle}>
          {open ? <CollapseIcon /> : <ExpandIcon />}
        </IconButton>

        <Box className={classes.link} padding={4} width="100%">
          <Typography component="p" fontSize={15} fontWeight="bold">
            {label.toUpperCase()}
          </Typography>
          {text && (
            <Typography component="p" variant="subtitle1" color="GrayText">
              {text}
            </Typography>
          )}
        </Box>
      </Box>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List className={classes.nested}>
          {Array.isArray(items)
            ? items.map(({ key, value, icon }) => (
                <Item key={key} label={key} text={value} Icon={icon} />
              ))
            : Object.entries(items).map(([key, { value, icon }]) => (
                <Item key={key} label={key} text={value} Icon={icon} />
              ))}
        </List>
      </Collapse>
    </Box>
  );
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      '&:not(:first-child)::before': {
        content: '""',
        // display: 'block',
        position: 'absolute',
        width: '100%',
        height: 1,
        top: 0,
        clear: 'both',
        backgroundColor: theme.palette.grey[300],
      },
    },
    iconButton: {
      backgroundColor: theme.palette.grey[200],
      '&:hover': {
        backgroundColor: theme.palette.grey[400],
      },
      marginRight: theme.spacing(2),
    },
    link: {
      '&:hover': {
        backgroundColor: theme.palette.grey[200],
      },
    },
    nested: {
      marginLeft: theme.spacing(11),
    },
  })
);
