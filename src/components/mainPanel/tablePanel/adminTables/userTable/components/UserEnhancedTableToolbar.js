import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Add from '@material-ui/icons/AddBox';
import Import from '@material-ui/icons/UnarchiveOutlined';
import Export from '@material-ui/icons/SaveAlt';
import ClearInactive from '@material-ui/icons/BackspaceOutlined';
import ClearActive from '@material-ui/icons/Backspace';
import Delete from '@material-ui/icons/DeleteOutline';
import Search from '@material-ui/icons/Search';

function ElevationScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

ElevationScroll.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func,
};

/*
  Styles
*/
const useToolbarStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(0),
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
    appBar: {
      marginTop: theme.spacing(7),
      marginleft: theme.spacing(3),
      marginright: theme.spacing(3),
    }
}));

export default function EnhancedTableToolbar(props) {
    /*
      Properties
    */
    const classes = useToolbarStyles();
    const {
        modelName,
        numSelected,
        search,
        title,
        onSearchEnter,
        handleAddClicked,
        handleBulkImportClicked,
    } = props;
    /*
      State
    */
    const [displayedSearch, setDisplayedSearch] = useState('');

    /*
      Store selectors
    */
   const exportServerUrl = useSelector(state => state.urls.exportServerUrl)

    /*
      Render
    */
    return (
      // <ElevationScroll {...props}>
      //   <AppBar className={classes.appBar} color='default' position='fixed'>
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            <Grid container>
                <Grid item xs={12}>
                    <Grid container justify='space-between' alignItems='center' wrap='wrap'>
            
                        {/* Title */}
                        {numSelected > 0 ?
                            (
                                /*
                                  On selection
                                */
                                <Grid item>
                                    <Typography color="inherit" variant="subtitle1">
                                        {numSelected} selected
                                    </Typography>
                                </Grid>
                            ) :
                            (
                                /*
                                  On no-selection
                                */
                                <Grid item>
                                    <Typography variant="h6">
                                        {title}
                                    </Typography>
                                </Grid>
                            )
                        }

                        {/* Actions */}
                        {numSelected > 0 ?
                            (
                                /*
                                  On selection
                                */
                                <Grid item>
                                    <Tooltip title="Delete">
                                        <IconButton aria-label="delete">
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            ) :
                            (
                                /*
                                  On no-selection
                                */
                                <Grid item>
                                    {/* Container: Search field + Actions */}
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Grid container justify="flex-end" alignItems='center' wrap='wrap'>

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
                                                <Grid item>

                                                    {/*
                                                        Actions on: no selection
                                                        - Add
                                                        - Import
                                                        - Export
                                                    */}
                                                    <Grid container>
                                                        <Grid item xs={12}>
                                                            <Grid container justify="center">
                                                                <Grid item>
                                                                    <Tooltip title="Add new user">
                                                                        <IconButton 
                                                                          color="primary"
                                                                          onClick={(event) => { handleAddClicked(event)} } 
                                                                        >
                                                                            <Add />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </Grid>
                                                                <Grid item>
                                                                    <Tooltip title="Import from CSV">
                                                                        <IconButton 
                                                                          color="primary"
                                                                          onClick={(event) => { handleBulkImportClicked(event)} } 
                                                                        >
                                                                            <Import />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </Grid>
                                                                <Grid item>
                                                                  <form action={exportServerUrl}>
                                                                    <input type="hidden" name="model" value={modelName} />
                                                                    <Tooltip title="Export to CSV">
                                                                        <IconButton color="primary" type="submit">     
                                                                          <Export />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                  </form>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>

                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            )
                        }
                    </Grid>
                </Grid>
            </Grid>
        </Toolbar>
      //   </AppBar>
      // </ElevationScroll>
    );
};

/*
  PropTypes
*/
EnhancedTableToolbar.propTypes = {
    modelName: PropTypes.string.isRequired,
    numSelected: PropTypes.number.isRequired,
    search: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    onSearchEnter: PropTypes.func.isRequired,
};
