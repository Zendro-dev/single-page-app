import { useState } from 'react';
import Link from 'next/link';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Box, Collapse, IconButton, List, Typography } from '@material-ui/core';

import {
  ExpandLess as CollapseIcon,
  ExpandMore as ExpandIcon,
  List as ModelTableIcon,
  VpnKey as KeyIcon,
} from '@material-ui/icons';

import Item from './list-link-item';
import { ParsedAssociation } from '@/types/models';

export interface AssociationLinkProps {
  association: ParsedAssociation;
  href: string;
}

export default function AssociationLink({
  association,
  href,
}: AssociationLinkProps): React.ReactElement {
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
      paddingY={4}
    >
      <Box display="flex" alignItems="center">
        <IconButton className={classes.iconButton} onClick={handleOnToggle}>
          {open ? <CollapseIcon /> : <ExpandIcon />}
        </IconButton>

        <Link href={href} passHref>
          <Box width="100%" component="a">
            <Typography component="p" variant="button" fontWeight="bold">
              {association.name}
            </Typography>
            <Typography component="p" variant="subtitle1" color="GrayText">
              {association.type}
            </Typography>
          </Box>
        </Link>
      </Box>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List className={classes.nested}>
          <Item
            label="Model Name"
            text={association.target}
            Icon={ModelTableIcon}
          />
          <Item
            label="Foreign Key"
            text={association.targetKey}
            Icon={KeyIcon}
          />
        </List>
      </Collapse>
    </Box>
  );
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      // '&:hover': {
      //   backgroundColor: theme.palette.grey[200],
      // },
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
      marginRight: theme.spacing(4),
    },
    nested: {
      marginLeft: theme.spacing(11),
    },
  })
);
