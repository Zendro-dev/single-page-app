import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Fade from '@material-ui/core/Fade';
import Add from '@material-ui/icons/AddBox';
import Import from '@material-ui/icons/UnarchiveOutlined';
import Export from '@material-ui/icons/SaveAlt';
import ClearInactive from '@material-ui/icons/BackspaceOutlined';
import ClearActive from '@material-ui/icons/Backspace';
import Search from '@material-ui/icons/Search';
import Reload from '@material-ui/icons/Replay';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import TableIcon from '@material-ui/icons/ViewComfyTwoTone';
import ChartIcon from '@material-ui/icons/InsertChartTwoTone';
import { grey } from '@material-ui/core/colors';

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
  },
  downloadsMenuItem: {
    margin: theme.spacing(0),
  },
  downloadsMenu: {
    marginTop: '48px',
  },
  formButton: {
    width: '100%',
    margin: theme.spacing(0),
  },
  textButton: {
    width: '100%',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    justifyContent: 'flex-start',
    '&:hover': {
      backgroundColor: grey[200]
    }
  },
  actionButton: {
    margin: theme.spacing(2),
  },
}));

export default function RoleToUserEnhancedTableToolbar(props) {
  const classes = useToolbarStyles();
  const { t } = useTranslation();
  const {
    permissions,
    search,
    showToggleButtons,
    toggleButtonValue,
    onSearchEnter,
    onReloadClick,
    handleAddClicked,
    handleBulkImportClicked,
    handleCsvTemplateClicked,
    handleToggleButtonValueChange,
  } = props;

  const [displayedSearch, setDisplayedSearch] = useState('');
  const [downloadsAnchorEl, setDownloadsAnchorEl] = React.useState(null);

  const exportServerUrl = useSelector(state => state.urls.exportServerUrl)

  //debouncing & event contention
  const isDownloading = useRef(false);

  const handleDownloadsIconClick = event => {
    setDownloadsAnchorEl(event.currentTarget);
    isDownloading.current = false;
  };

  const handleDownloadsMenuClose = () => {
    setDownloadsAnchorEl(null);
  };

  return (
    <Toolbar className={classes.root}>
      <Grid container>
        <Grid item xs={12}>
          <Grid container justify='space-between' alignItems='center' wrap='wrap'>

            {/* Title + ToggleButtons */}
            <Grid item>
              <Grid container justify="flex-start" spacing={2} alignItems='center' wrap='wrap'>

                {/* Title */}
                <Grid item>
                  <Typography variant="h6">
                    Role_to_users
                  </Typography>
                </Grid>

                {/*
                  Conditional rendering: ToggleButtons
                */}
                {(showToggleButtons) && (
                  <Grid item>
                    <ToggleButtonGroup size="small"
                      value={toggleButtonValue}
                      exclusive
                      onChange={handleToggleButtonValueChange}
                    >
                      <Tooltip title={ t('modelPanels.table', "Table") }>
                        <ToggleButton value="table">
                          <TableIcon fontSize="small" />
                        </ToggleButton>
                      </Tooltip>
                      <Tooltip title={ t('modelPanels.plot', "Plot") }>
                        <ToggleButton value="plot">
                          <ChartIcon fontSize="small" />
                        </ToggleButton>
                      </Tooltip>
                    </ToggleButtonGroup>
                  </Grid>
                )}
              </Grid>
            </Grid>

            {/* Actions */}
            <Grid item>

              <Fade in={(toggleButtonValue==="table")}>
                {/* Container: Search field + Actions */}
                <Grid container>
                  <Grid item xs={12}>
                    <Grid container justify="flex-end" alignItems='center' wrap='wrap'>

                      {/* Reload Icon */}
                      <Grid item>
                        <Tooltip title={ t('modelPanels.reloadList', "Reload list") }>
                          <IconButton
                            id='RoleToUserEnhancedTableToolbar-iconButton-reloadTable'
                            color='inherit'
                            onClick={(event) => {
                              onReloadClick();
                            }}
                          >
                            <Reload color="inherit" fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Grid>

                      <Grid item>

                        {/* Search field */}
                        <TextField
                          id='RoleToUserEnhancedTableToolbar-textField-search'
                          value={displayedSearch}
                          placeholder={ t('modelPanels.search') }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Tooltip title={ t('modelPanels.search') }>
                                  <IconButton
                                    id='RoleToUserEnhancedTableToolbar-iconButton-search'
                                    color='inherit'
                                    onClick={() => {
                                      onSearchEnter(displayedSearch);
                                    }}
                                  >
                                    <Search color="inherit" fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <Tooltip title={ t('modelPanels.clearSearch') }>
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
                                        id='RoleToUserEnhancedTableToolbar-iconButton-clearSearch'
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
                              {/* Add */}
                              {
                                /* acl check */
                                (permissions&&permissions.role_to_user&&Array.isArray(permissions.role_to_user)
                                &&(permissions.role_to_user.includes('create') || permissions.role_to_user.includes('*')))
                                &&(
                                  <Grid item>
                                    <Tooltip title={t('modelPanels.addNew') + " role_to_user"}>
                                      <IconButton
                                        id='RoleToUserEnhancedTableToolbar-button-add'
                                        color="primary"
                                        onClick={(event) => { handleAddClicked(event) }}
                                      >
                                        <Add />
                                      </IconButton>
                                    </Tooltip>
                                  </Grid>
                                )
                              }
                              {/* Upload */}
                              {
                                /* acl check */
                                (permissions&&permissions.role_to_user&&Array.isArray(permissions.role_to_user)
                                &&(permissions.role_to_user.includes('update') || permissions.role_to_user.includes('*')))
                                &&(
                                  <Grid item>
                                    <Tooltip title={ t('modelPanels.importCSV') }>
                                      <IconButton
                                        id='RoleToUserEnhancedTableToolbar-button-import'
                                        color="primary"
                                        onClick={(event) => { handleBulkImportClicked(event) }}
                                      >
                                        <Import />
                                      </IconButton>
                                    </Tooltip>
                                  </Grid>
                                )
                              }
                              {/* Download.menu */}
                              {
                                /* acl check */
                                (permissions&&permissions.role_to_user&&Array.isArray(permissions.role_to_user)
                                &&(permissions.role_to_user.includes('read') || permissions.role_to_user.includes('*')))
                                &&(
                                  <div>
                                    {/* Downloads.icon */}
                                    <Grid item>
                                      <Tooltip title={ t('modelPanels.downloadsOptions', 'Download options') }>
                                        <IconButton
                                          id='RoleToUserEnhancedTableToolbar-button-downloadOptions'
                                          color="primary"
                                          onClick={handleDownloadsIconClick}
                                        >
                                          <Export />
                                        </IconButton>
                                      </Tooltip>
                                    </Grid>
                                    {/* Downloads.menu */}
                                    <Menu
                                      className={classes.downloadsMenu}
                                      anchorEl={downloadsAnchorEl}
                                      keepMounted
                                      open={Boolean(downloadsAnchorEl)}
                                      onClose={handleDownloadsMenuClose}
                                    >
                                      {/* Downloads.op1 - Export data to CSV file */}
                                      <Grid item xs={12}>
                                        <Grid container justify='flex-start'>
                                          <form className={classes.formButton} action={exportServerUrl}>
                                          <input type="hidden" name="model" value='role_to_user' />
                                            <ButtonBase
                                              id='RoleToUserEnhancedTableToolbar-button-exportData'
                                              className={classes.textButton}
                                              color="default"
                                              type="submit"
                                              onClick={(event)=>{
                                                if(!isDownloading.current) {
                                                  isDownloading.current = true;
                                                  handleDownloadsMenuClose();
                                                } else {
                                                  event.preventDefault();
                                                }
                                              }}
                                            >
                                              <span>
                                                <Typography component="span" variant="subtitle1" display='block' noWrap={true}>
                                                  {t('modelPanels.downloadsOp1', 'Export data to CSV file')}
                                                </Typography>
                                              </span>
                                            </ButtonBase>
                                          </form>
                                        </Grid>
                                      </Grid>

                                      {/* Downloads.op2 - Download table template to CSV file */}
                                      <Grid item xs={12}>
                                        <Grid container justify='flex-start'>
                                          <ButtonBase
                                            id='RoleToUserEnhancedTableToolbar-button-exportTemplate'
                                            className={classes.textButton}
                                            color="default"
                                            onClick={()=>{
                                              if(!isDownloading.current) {
                                                isDownloading.current = true;
                                                handleCsvTemplateClicked();
                                                handleDownloadsMenuClose();
                                              }
                                            }}
                                          >
                                            <span>
                                              <Typography component="span" variant="subtitle1" display='block' noWrap={true}>
                                                {t('modelPanels.downloadsOp2', 'Download table template to CSV file')}
                                              </Typography>
                                            </span>
                                          </ButtonBase>
                                        </Grid>
                                      </Grid>

                                      {/* Close.button */}
                                      <Grid item xs={12}>
                                        <Grid container justify='flex-end'>
                                          <Button
                                            id='RoleToUserEnhancedTableToolbar-button-closeDownloadOptions'
                                            className={classes.actionButton}
                                            color="primary"
                                            onClick={handleDownloadsMenuClose}
                                          >
                                            {t('modelPanels.close', 'Close')}
                                          </Button>
                                        </Grid>
                                      </Grid>
                                    </Menu>
                                  </div>
                              )}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Fade>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Toolbar>
  );
};
RoleToUserEnhancedTableToolbar.propTypes = {
  search: PropTypes.string.isRequired,
  showToggleButtons: PropTypes.bool.isRequired,
  toggleButtonValue: PropTypes.string.isRequired,
  onSearchEnter: PropTypes.func.isRequired,
  onReloadClick: PropTypes.func.isRequired,
  handleAddClicked: PropTypes.func.isRequired,
  handleBulkImportClicked: PropTypes.func.isRequired,
  handleCsvTemplateClicked: PropTypes.func.isRequired,
  handleToggleButtonValueChange: PropTypes.func.isRequired,
};
