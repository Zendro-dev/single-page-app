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
//icons
import ClearActive from '@material-ui/icons/Backspace';
import Search from '@material-ui/icons/Search';
import Filter from '@material-ui/icons/FilterList';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    maxWidth: '300'
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
  const { handleClose } = props;

  /*
    State
  */
  const [filterActive, setFilterActive] = useState(false);


  return (
    <div>
      {/* Filter Inactive */}
      {(filterActive === false) && 
        (
          <Box 
            className={classes.root}
            border={1} 
            borderColor="primary.main" 
          >
            {/* Filter Icon */}
            <Tooltip title="Filter">
              <IconButton
                className={classes.iconButton}
                onClick={(event) => {
                  setFilterActive(true);
                }}
              >
                <Filter color="primary" fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )
      }

      {/* Filter Active */}
      {(filterActive === true) && 
        (
          <Paper 
            className={classes.root}
            elevation={1}
          >
            {/* Filter Icon */}
            <Tooltip title="Filter">
              <IconButton
                className={classes.iconButton}
              >
                <Filter color="inherit" fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* Input */}
            <InputBase className={classes.input} />

            {/* Divider */}
            <Divider className={classes.divider} orientation="vertical" />
          
            {/* Clear Icon Button */}
            <IconButton
              className={classes.iconButton}
              onClick={(event) => {
                // onSearchEnter('');
                // setDisplayedSearch('');
                setFilterActive(false);
                
                if(handleClose !== undefined) {
                  handleClose(event);
                }
              }}
            >
              <ClearActive color="secondary" fontSize="small" />
            </IconButton>
          </Paper>
        )
      }
    </div>
  );
}