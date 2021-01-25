import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Grow from '@material-ui/core/Grow';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

const useStyles = makeStyles(theme => ({
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
    margin: {
      height: 32,
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    formControl: {
      minWidth: 80,
    },
}));

export default function NoAssocCursorPagination(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const {
    count,
    rowsPerPage,
    rowsPerPageOptions,
    labelRowsPerPage,
    hasNextPage,
    hasPreviousPage,
    handleFirstPageButtonClick,
    handleLastPageButtonClick,
    handleNextButtonClick,
    handleBackButtonClick,
    handleChangeRowsPerPage,
  } = props;

  return (
    <div>
    <Toolbar className={classes.root}>
      <Grid container>
        <Grid item xs={12}>
          <Grid container justify='space-between' alignItems='center' alignContent='center' wrap='nowrap' spacing={1}>
            
              <Grid item xs={4}>
                <Grid container justify='flex-start' wrap='nowrap' spacing={2}>
                  
                  {/* Row Selector */}
                  <Grow in={rowsPerPageOptions.length > 0}>
                    <Grid item>
                      <FormControl className={classes.formControl}>
                        <InputLabel>{labelRowsPerPage}</InputLabel>
                        <Select
                          value={rowsPerPage}
                          onChange={handleChangeRowsPerPage}
                        >
                          {rowsPerPageOptions.map((rowValue, index) => (
                            <MenuItem value={rowValue} key={index}>{rowValue}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grow>

                  {/* Count */}
                  <Grow in={count > -1}>
                    <Grid item>
                      <div>
                        <InputLabel shrink>{ t('modelPanels.count', "Count") }</InputLabel>
                        <InputBase
                          className={classes.margin}
                          value={count > -1 ? count : ''}
                          disabled ={true}
                        />
                      </div>
                    </Grid>
                  </Grow>

                </Grid>
              </Grid>

            {/* Navigation Icons */}
            <Grid item xs={8}>
              <Grid container justify='flex-end' alignItems='center' wrap='nowrap'>

                <Grid item>
                  <Tooltip title={ t('modelPanels.goToFirstPage', "First page") }>
                    <span><IconButton
                      onClick={handleFirstPageButtonClick}
                      disabled={!hasPreviousPage}
                    >
                      <FirstPageIcon />
                    </IconButton></span>
                  </Tooltip>
                </Grid>

                <Grid item>
                  <Tooltip title={ t('modelPanels.goToPreviousPage', "Previous page") }>
                    <span><IconButton
                      onClick={handleBackButtonClick}
                      disabled={!hasPreviousPage}
                    >
                      <KeyboardArrowLeft />
                    </IconButton></span>
                  </Tooltip>
                </Grid>

                <Grid item>
                  <Tooltip title={ t('modelPanels.goToNextPage', "Next page") }>
                    <span><IconButton
                      onClick={handleNextButtonClick}
                      disabled={!hasNextPage}
                    >
                      <KeyboardArrowRight />
                    </IconButton></span>
                  </Tooltip>
                </Grid>

                <Grid item>
                  <Tooltip title={ t('modelPanels.goToLastPage', "Last page") }>
                    <span><IconButton
                      onClick={handleLastPageButtonClick}
                      disabled={!hasNextPage}
                    >
                      <LastPageIcon />
                    </IconButton></span>
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

NoAssocCursorPagination.propTypes = {
  count: PropTypes.number.isRequired,
  rowsPerPageOptions: PropTypes.array.isRequired,
  labelRowsPerPage: PropTypes.string.isRequired,
  hasNextPage: PropTypes.bool.isRequired,
  hasPreviousPage: PropTypes.bool.isRequired,
  handleFirstPageButtonClick: PropTypes.func.isRequired,
  handleLastPageButtonClick: PropTypes.func.isRequired,
  handleNextButtonClick: PropTypes.func.isRequired,
  handleBackButtonClick: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
};
