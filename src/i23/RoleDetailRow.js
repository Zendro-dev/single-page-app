import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
//import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
//import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  card: {
    minWidth: 275,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function RoleDetailRow(props) {
  const classes = useStyles();

  return (
    /*
      Card
    */
    React.createElement(Card, {
      className: classes.card
    }, 
    /*
      Content
    */
    React.createElement(CardContent, null, 
      
      //id
      React.createElement(Typography, {
        variant: "h5",
        component: "h2"
      }, "Id"), 
      React.createElement(Typography, {
        className: classes.pos,
        color: "textSecondary"
      }, props.id),

      //name
      React.createElement(Typography, {
        variant: "h5",
        component: "h2"
      }, "Name"), 
      React.createElement(Typography, {
        className: classes.pos,
        color: "textSecondary"
      }, props.name),

      //description
      React.createElement(Typography, {
        variant: "h5",
        component: "h2"
      }, "Description"), 
      React.createElement(Typography, {
        className: classes.pos,
        color: "textSecondary"
      }, props.description),

    ))//end: React element: Card
  )//end: return
}//end: function RoleDetailRow2()