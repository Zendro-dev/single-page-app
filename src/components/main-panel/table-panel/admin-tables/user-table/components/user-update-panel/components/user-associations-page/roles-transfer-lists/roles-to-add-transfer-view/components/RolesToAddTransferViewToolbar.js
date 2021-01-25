import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Grow from '@material-ui/core/Grow';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import ClearInactive from '@material-ui/icons/BackspaceOutlined';
import ClearActive from '@material-ui/icons/Backspace';
import Search from '@material-ui/icons/Search';
import Reload from '@material-ui/icons/Replay';

const useToolbarStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  headers: {
    paddingTop: theme.spacing(2),
  },
  id: {
    width: 33,
  },
  label: {
    paddingLeft: theme.spacing(2),
  },
}));

export default function RolesToAddTransferViewToolbar(props) {
  const classes = useToolbarStyles();
  const { t } = useTranslation();
  const {
      search,
      title,
      titleIcon,
      searchDisabled,
      onSearchEnter,
      onReloadClick,
  } = props;
  
  const [displayedSearch, setDisplayedSearch] = useState('');
  const [searchActive, setSearchActive] = useState(false);
  const [searchActiveB, setSearchActiveB] = useState(false);
  const searchInputRef = useRef(null);

  const delayedSetSearchActive = async (ms, status) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setSearchActive(status);
        resolve("ok");
      }, ms);
    });
  };

  const delayedSetSearchActiveB = async (ms, status) => {
    await new Promise(resolve => {
      window.setTimeout(function() {
        setSearchActiveB(status);
        resolve("ok");
      }, ms);
    });
  };

  return (
    <div>
    <Toolbar className={classes.root}>
      <Grid container>
        <Grid item xs={12}>
          <Grid container justify='space-between' alignItems='center' wrap='wrap' spacing={2}>
            
            {/* Title */}
            <Grid item xs={12} >
              <Grid container justify='flex-start' alignItems='center' wrap='wrap' spacing={2}>
                <Grid item>
                  <Typography variant="body2" display="inline" color="textSecondary">
                    {title}
                  </Typography>
                </Grid>
                {(titleIcon !== undefined && titleIcon === 1) && (
                  <Grid item>
                    <Typography variant="h6" display="inline">
                      { t('modelPanels.notAssociated') }
                    </Typography>
                  </Grid>
                )}
                {(titleIcon !== undefined && titleIcon === 2) && (
                  <Grid item>
                    <Typography variant="h6" display="inline">
                      { t('modelPanels.toAdd') }
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Grid>

            {/* SearchField */}
            <Grid item xs={12}>
              <Grid container justify='flex-end' alignItems='center' wrap='nowrap'>

                {/* Search Inactive */}
                <Fade 
                  in={!searchActive} 
                  timeout={500}
                  onExit={() => {
                    delayedSetSearchActiveB(300, true);
                  }}
                >
                  <Grid item>
                    {/* Search Icon */}
                    <Tooltip title={!searchDisabled ? t('modelPanels.showSearchBar') : ""}>
                      <span>
                        <IconButton
                          color='inherit'
                          disabled={searchDisabled ? searchDisabled : false}
                          onClick={(event) => {
                            setSearchActive(true);
                          }}
                        >
                          <Search color={!searchDisabled ? "inherit" : "disabled"} fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Grid>
                </Fade>
                {/* Search Active */}
                <Grow 
                  in={searchActiveB}
                  style={{ transformOrigin: 'right 50% 0' }}
                  mountOnEnter={true} 
                  unmountOnExit={true}
                  onEnter={() => {
                    if(searchInputRef.current) {searchInputRef.current.focus();}
                  }}
                  onExit={() => {
                    delayedSetSearchActive(300, false);
                  }}
                >
                  <Grid item>
                    {/* Search field */}
                    <TextField
                      value={displayedSearch}
                      placeholder={ t('modelPanels.search') }
                      inputRef={searchInputRef}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Tooltip title={ t('modelPanels.search') }>
                              <IconButton
                                color='inherit'
                                onClick={() => {
                                  onSearchEnter(displayedSearch);
                                }}
                              >
                                <Search color='primary' fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            {(!search) && (
                              <Tooltip title={ t('modelPanels.hideSearchBar') }>
                                <IconButton
                                  color='inherit'
                                  onClick={() => {
                                    setSearchActiveB(false);
                                  }}
                                >
                                  <ClearInactive color="inherit" fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {(search) && (
                              <Tooltip title={ t('modelPanels.clearSearch') }>
                                <IconButton
                                  onClick={() => {
                                    onSearchEnter('');
                                    setDisplayedSearch('');
                                  }}
                                >
                                  <ClearActive color="secondary" fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
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
                </Grow>

                {/* Reload Icon */}
                <Grid item>
                  <Tooltip title={ t('modelPanels.reloadList', "Reload list") }>
                    <IconButton
                      color='inherit'
                      onClick={(event) => {
                        onReloadClick();
                      }}
                    >
                      <Reload color="inherit" fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Toolbar>
    </div>
  );
};
RolesToAddTransferViewToolbar.propTypes = {
    search: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    titleIcon: PropTypes.number,
    onSearchEnter: PropTypes.func.isRequired,
    onReloadClick: PropTypes.func.isRequired,
};
