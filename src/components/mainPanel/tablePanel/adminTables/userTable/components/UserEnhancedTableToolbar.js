import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Add from '@material-ui/icons/AddBox';
import Import from '@material-ui/icons/UnarchiveOutlined';
import Export from '@material-ui/icons/SaveAlt';
import ClearInactive from '@material-ui/icons/BackspaceOutlined';
import ClearActive from '@material-ui/icons/Backspace';
import Search from '@material-ui/icons/Search';

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
  },
}));

export default function UserEnhancedTableToolbar(props) {
  const classes = useToolbarStyles();
  const {
    search,
    onSearchEnter,
    handleAddClicked,
    handleBulkImportClicked,
  } = props;
  const [displayedSearch, setDisplayedSearch] = useState('');
  const exportServerUrl = useSelector(state => state.urls.exportServerUrl)

  return (
    <Toolbar className={classes.root}>
      <Grid container>
        <Grid item xs={12}>
          <Grid container justify='space-between' alignItems='center' wrap='wrap'>

            {/* Title */}
            <Grid item>
              <Typography variant="h6">
                Users
              </Typography>
            </Grid>

            {/* Actions */}
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
                            onSearchEnter(displayedSearch);
                          }
                        }}
                        onChange={event => setDisplayedSearch(event.target.value)}
                      />
                    </Grid>
                    <Grid item>
                      {/*
                        Actions
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
                                  onClick={(event) => { handleAddClicked(event) }}
                                >
                                  <Add />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                            <Grid item>
                              <Tooltip title="Import from CSV">
                                <IconButton
                                  color="primary"
                                  onClick={(event) => { handleBulkImportClicked(event) }}
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
          </Grid>
        </Grid>
      </Grid>
    </Toolbar>
  );
};
UserEnhancedTableToolbar.propTypes = {
  search: PropTypes.string.isRequired,
  onSearchEnter: PropTypes.func.isRequired,
  handleAddClicked: PropTypes.func.isRequired,
  handleBulkImportClicked: PropTypes.func.isRequired,
};
