import React from 'react';
import { ListItem, ListItemText, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function NavItem({ label, name, ...props }) {
  const classes = useStyles();
  return (
    <ListItem button className={classes.nested} component={Link} {...props}>
      <ListItemText
        primary={
          <Typography
            id={'MainPanel-listItemText-typography-' + name}
            component="span"
            variant="body2"
            display="block"
            noWrap={true}
            color="textPrimary"
          >
            {label}
          </Typography>
        }
      />
    </ListItem>
  );
}
