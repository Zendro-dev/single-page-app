import React, { useState, useEffect, useRef, forwardRef } from 'react';

/*
  Material-UI components
*/
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Box from '@material-ui/core/Box';
import Grow from '@material-ui/core/Grow';
import Fade from '@material-ui/core/Fade';
//icons
import ClearActive from '@material-ui/icons/Backspace';
import Search from '@material-ui/icons/Search';
import Filter from '@material-ui/icons/FilterList';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(.25),
    paddingBottom: theme.spacing(.25),
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0),
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

export default function ChipsViewSearchBar(props) {
  /*
    Style
  */
  const classes = useStyles();

  /*
    Properties
  */
  const { 
    value, searchActive, handleValueChange,
    handleOpen, handleClose,
  } = props;

  /*
    State
  */

  /*
    Hooks
  */

  return (
    <div>
      {/* Filter Inactive */}
      {(searchActive === undefined || searchActive === false) && 
        (
          <Fade in={true} timeout={500}>
            <Box 
              className={classes.root}
              border={0} 
              borderColor="primary.main" 
            >
              {/* Filter Icon */}
              <Tooltip title="Filter">
                <IconButton
                  className={classes.iconButton}
                  onClick={(event) => {
                    //run callback
                    if(handleOpen !== undefined) {
                      handleOpen(event);
                    }
                  }}
                >
                  <Filter color="primary" fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Fade>
        )
      }

      {/* Filter Active */}
      {(searchActive !== undefined && searchActive === true) && 
        (
          <Grow 
            in={true}
            style={{ transformOrigin: '0 50% 0' }} 
          >
            <Paper 
              className={classes.root}
              elevation={1}
            >

              {/* Input */}
              <InputBase 
                className={classes.input} 
                autoFocus={true}
                value={value}
                onChange={(event) => {
                  //run callback
                  if(handleValueChange !== undefined) {
                    handleValueChange(event, event.target.value);
                  }
                }}
              />

              {/* Divider */}
              <Divider className={classes.divider} orientation="vertical" />
            
              {/* Clear Icon Button */}
              <IconButton
                className={classes.iconButton}
                onClick={(event) => {
                  //run callback
                  if(handleClose !== undefined) {
                    handleClose(event);
                  }
                }}
              >
                <ClearActive color="secondary" fontSize="small" />
              </IconButton>
            </Paper>
          </Grow>
        )
      }
    </div>
  );
}