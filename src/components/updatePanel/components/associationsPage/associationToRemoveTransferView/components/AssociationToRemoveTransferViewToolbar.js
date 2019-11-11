import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';

/*
  Material-UI components
*/
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';

import ListItemIcon from '@material-ui/core/ListItemIcon';

/*
  Icons
*/
import ClearInactive from '@material-ui/icons/BackspaceOutlined';
import ClearActive from '@material-ui/icons/Backspace';
import Search from '@material-ui/icons/Search';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import AddList from '@material-ui/icons/AddToPhotosTwoTone';
import DeleteList from '@material-ui/icons/DeleteTwoTone';

/*
  Styles
*/
const useToolbarStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(2),
        margin: theme.spacing(0),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    headers: {
      paddingLeft: theme.spacing(0),
      paddingRight: theme.spacing(0),
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(0),
    },
    dividerV: {
      height: 30,
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
}));

export default function AssociationToAddTransferViewToolbar(props) {
  /*
    Properties
  */
  const classes = useToolbarStyles();
  const {
      search,
      title,
      titleIcon,
      associationNames,
      onSearchEnter,
  } = props;
  
  /*
    State
  */
  const [displayedSearch, setDisplayedSearch] = useState('');

  /*
    Render
  */
  return (
    <div>
    <Toolbar className={classes.root}>
      <Grid container>
        <Grid item xs={12}>
          <Grid container justify='space-between' alignItems='center' wrap='wrap' spacing={2}>
            
            {/* Title */}
            <Grid item xs={12} >
              <Grid container justify='flex-start' alignItems='center' wrap='nowrap' spacing={2}>
                {(titleIcon !== undefined) && (
                  <Grid item>
                    <DeleteList color="secondary" fontSize="small" />
                  </Grid>
                )}
                
                <Grid item>
                  <Typography variant="h6">
                    {title}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>


            {/* SearchField + Actions */}
            <Grid item xs={12}>
              <Grid container justify='flex-end' alignItems='center' wrap='nowrap'>
                <Grid item>
                  {/* Search field */}
                  <TextField
                    id="search-field"
                    value={displayedSearch}
                    placeholder="Search"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Tooltip title="Search">
                            <Search color="inherit" fontSize="small" />
                          </Tooltip>
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Clear search">
                            <span>
                              {(!search) && (
                                <IconButton
                                  disabled={true}
                                >
                                  <ClearInactive color="inherit" fontSize="small" />
                                </IconButton>
                              )}
                              {(search) && (
                                <IconButton
                                  onClick={() => {
                                    onSearchEnter('');
                                    setDisplayedSearch('');
                                  }}
                                >
                                  <ClearActive color="secondary" fontSize="small" />
                                </IconButton>
                              )}
                            </span>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                    onKeyPress={event => {
                      if (event.key === 'Enter') {
                        console.log('Enter key pressed, value: ', displayedSearch);
                        onSearchEnter(displayedSearch);
                      }
                    }}
                    onChange={event => setDisplayedSearch(event.target.value)}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Headers */}
            <Grid item xs={12} className={classes.headers}>
              <Grid container justify='flex-start' alignItems='center' wrap='nowrap'>

                {/* Id */}
                <Grid item xs={1}>
                  <Typography className={classes.fieldId} variant="caption" display="block" noWrap={true}><b>id</b></Typography>
                </Grid>
                
                {/* Label */}
                <Grid item xs={9}>
                  <Typography variant="caption" display="block" noWrap={true}>
                    <b>&nbsp;&nbsp;{associationNames.label}</b></Typography>
                </Grid>
              
              </Grid>
            </Grid>

            <Grid container justify='center' alignItems='center' wrap='wrap'>
              <Grid item xs={12}>
              {/* Divider */}
              <Divider orientation="horizontal" />
              </Grid>
            </Grid>

          </Grid>
        </Grid>
      </Grid>
    </Toolbar>
    </div>
  );
};

/*
  PropTypes
*/
AssociationToAddTransferViewToolbar.propTypes = {
    search: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    onSearchEnter: PropTypes.func.isRequired,
};
