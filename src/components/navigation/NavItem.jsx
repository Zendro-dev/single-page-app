import React from 'react';
import { ListItem, ListItemText, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function NavItem(props) {
  const classes = useStyles();
  return (
    <ListItem
      button
      className={classes.nested}
      // selected={selectedIndex === model.id}
      // onClick={(event) => {
      //   if (selectedIndex !== model.id) {
      //     handleIndexChange(event, { index: model.id, url: model.url });
      //   }
      // }}
      {...props}
    >
      <ListItemText
        primary={
          <Typography
            id={'MainPanel-listItemText-typography-' + props.name}
            component="span"
            variant="body2"
            display="block"
            noWrap={true}
            color="textPrimary"
          >
            {props.label}
          </Typography>
        }
      />
    </ListItem>
  );
}
