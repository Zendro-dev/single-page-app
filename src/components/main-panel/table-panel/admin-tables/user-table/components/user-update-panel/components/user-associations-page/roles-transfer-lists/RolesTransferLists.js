import React, { Suspense, lazy } from 'react';
import { retry } from '../../../../../../../../../../utils.js';
import PropTypes from 'prop-types';
import ErrorBoundary from '../../../../../../../../../pages/ErrorBoundary';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
//lazy loading
const RolesToAddTransferView = lazy(() => retry(() => import(/* webpackChunkName: "Create-TransferLists-ToAdd-Roles" */ './roles-to-add-transfer-view/RolesToAddTransferView')));
const RolesToRemoveTransferView = lazy(() => retry(() => import(/* webpackChunkName: "Create-TransferLists-ToRemove-Roles" */ './roles-to-remove-transfer-view/RolesToRemoveTransferView')));

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
  },
  container: {
    margin: theme.spacing(0),
  },
  div: {
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(0),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  divider: {
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(0),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(0),
  },
}));

export default function RolesTransferLists(props) {
  const classes = useStyles();
  const { t } = useTranslation();

  const {
    item,
    idsToAdd,
    idsToRemove,
    handleTransferToAdd,
    handleUntransferFromAdd,
    handleTransferToRemove,
    handleUntransferFromRemove,
    handleClickOnRoleRow,
  } = props;
  
  return (
    <div id='RolesTransferLists-div-root' className={classes.root}>
      <Fade in={true} timeout={500}>
        <Grid
          className={classes.container} 
          container 
          justify='center'
          alignItems='flex-start'
          spacing={0}
        > 
          <Grid item xs={12}>
            <div className={classes.div}>
              <Typography variant="body2" display='inline'>
                { t('modelPanels.toAddHelperA', "Please select ") }
              </Typography>
              <Typography variant="body2" display='inline'>
                {  t('modelPanels.theRecords', "the records ") }
              </Typography>
              <Typography variant="body2" display='inline'>
                { t('modelPanels.toAddHelperB', " that you want to be associated with this ") }
              </Typography>
              <Typography variant="body2" display='inline'>
                <b>{ 'User.' }</b>
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Suspense fallback={<div />}><ErrorBoundary showMessage={true} belowToolbar={true}>
              <RolesToAddTransferView
                item={item}
                idsToAdd={idsToAdd}
                handleTransfer={handleTransferToAdd}
                handleUntransfer={handleUntransferFromAdd}
                handleClickOnRoleRow={handleClickOnRoleRow}
              />
            </ErrorBoundary></Suspense>
          </Grid>

          <Grid item xs={12}>
            <div className={classes.divider}>
              <Divider />
            </div>
          </Grid>
          
          <Grid item xs={12}>
            <div className={classes.div}>
              <Typography variant="body2" display='inline'>
                { t('modelPanels.toRemoveHelperA', "Please select ") }
              </Typography>

              <Typography variant="body2" display='inline'>
                {  t('modelPanels.theRecords', "the records ") }
              </Typography>

              <Typography variant="body2" display='inline'>
                { t('modelPanels.toRemoveHelperB', " that you no longer want to be associated with this ") }
              </Typography>
              <Typography variant="body2" display='inline'>
                <b>{ 'User.' }</b>
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Suspense fallback={<div />}><ErrorBoundary showMessage={true} belowToolbar={true}>
              <RolesToRemoveTransferView
                item={item}
                idsToRemove={idsToRemove}
                handleTransfer={handleTransferToRemove}
                handleUntransfer={handleUntransferFromRemove}
                handleClickOnRoleRow={handleClickOnRoleRow}
              />
            </ErrorBoundary></Suspense>
          </Grid>

        </Grid>
      </Fade>
    </div>
  );
}
RolesTransferLists.propTypes = {
  item: PropTypes.object.isRequired,
  idsToAdd: PropTypes.array.isRequired,
  idsToRemove: PropTypes.array.isRequired,
  handleTransferToAdd: PropTypes.func.isRequired,
  handleUntransferFromAdd: PropTypes.func.isRequired,
  handleTransferToRemove: PropTypes.func.isRequired,
  handleUntransferFromRemove: PropTypes.func.isRequired,
  handleClickOnRoleRow: PropTypes.func.isRequired,    
};