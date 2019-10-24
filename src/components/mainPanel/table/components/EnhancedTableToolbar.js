import React from 'react';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

/*
  Material-UI components
*/
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

/*
  Icons
*/
import Add from '@material-ui/icons/AddBox';
import Import from '@material-ui/icons/UnarchiveOutlined';
import Export from '@material-ui/icons/SaveAlt';
import Clear from '@material-ui/icons/Clear';
import Delete from '@material-ui/icons/DeleteOutline';
import Search from '@material-ui/icons/Search';

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
    titleSection: {
        flex: '1 1 100%',
    },
    noTitleSection: {
        flex: '.8 1 100%',
    },
    actionsSection: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
    }
}));

/*
  Component
*/
export default function EnhancedTableToolbar(props) {
    /*
      Properties
    */
    const classes = useToolbarStyles();
    const { 
        numSelected, 
        search,
        onSearchChanged,
    } = props;

    /*
      
    */

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            {/* TITLE */}
            {numSelected > 0 ? 
            (
                /*
                  On selection
                */
                <Typography className={classes.titleSection} color="inherit" variant="subtitle1">
                    {numSelected} selected
                </Typography>
            ) : 
            (
                /*
                  On no-selection
                */
                <Typography className={classes.titleSection} variant="h6">
                    Users
                </Typography>
            )}

            {/* ACTIONS */}
            {numSelected > 0 ?
                (
                    /*
                      On selection
                    */
                    <Tooltip title="Delete">
                        <IconButton aria-label="delete">
                            <Delete />
                        </IconButton>
                    </Tooltip>
                ) :
                (
                    /*
                      On no-selection
                    */
                    <div className={classes.noTitle}>
                        <Box className={classes.actionsBox}>
                            
                            {/* Search field */}
                            <Box>
                                <TextField
                                    id="search-field"
                                    value={search}
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
                                                    <IconButton
                                                    disabled={!search}
                                                    onClick={() => onSearchChanged('')}
                                                    >
                                                        <Clear color="inherit" fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </InputAdornment>
                                        ),
                                    }}
                                    onChange={event => onSearchChanged(event.target.value)}
                                />
                            </Box>

                            {/*
                                Actions on: no selection
                                - Add
                                - Import
                                - Export
                            */}
                            <Box>
                                <Tooltip title="Add new user">
                                    <IconButton color="primary" aria-label="add">
                                        <Add />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Box>
                                <Tooltip title="Import from CSV">
                                    <IconButton color="primary" aria-label="import">
                                        <Import />
                                    </IconButton>
                                </Tooltip>
                            </Box>

                            <Box>
                                <Tooltip title="Export to CSV">
                                    <IconButton color="primary" aria-label="export">
                                        <Export />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    </div>
                )}
        </Toolbar>
    );
};

/*
  PropTypes
*/
EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
    search: PropTypes.string.isRequired,
    onSearchChanged: PropTypes.func.isRequired,
};
