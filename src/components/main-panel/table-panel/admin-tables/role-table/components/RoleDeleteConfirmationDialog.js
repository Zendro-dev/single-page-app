import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import { retry } from '../../../../../../utils';
import PropTypes from 'prop-types';
import ErrorBoundary from '../../../../../pages/ErrorBoundary';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import DeletedWarning from '@material-ui/icons/DeleteForeverOutlined';
import UpdateOk from '@material-ui/icons/CheckCircleOutlined';
import { red, green } from '@material-ui/core/colors';
//lazy loading
const RoleDetailPanel = lazy(() => retry(() => import(/* webpackChunkName: "Delete-DetailRole" */ './role-detail-panel/RoleDetailPanel')));


const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  warningCard: {
    width: '100%',
    minHeight: 130,
  },
}));

export default function RoleDeleteConfirmationDialog(props) {
  const classes = useStyles();
  const {
    permissions,
    item,
    handleAccept,
    handleReject,
  } = props;
  const [open, setOpen] = useState(true);
  const { t } = useTranslation();
  const lastFetchTime = useRef(Date.now());

  const [updated, setUpdated] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const lastModelChanged = useSelector(state => state.changes.lastModelChanged);
  const lastChangeTimestamp = useSelector(state => state.changes.lastChangeTimestamp);

  //debouncing & event contention
  const isDeleting = useRef(false);
  const isCanceling = useRef(false);

  useEffect(() => {
    /*
     * Handle changes 
     */

    /*
     * Checks
     */
    if(!lastModelChanged) {
      return;
    }
    if(!lastChangeTimestamp || !lastFetchTime.current) {
      return;
    }
    let isNewChange = (lastFetchTime.current<lastChangeTimestamp);
    if(!isNewChange) {
      return;
    }

    /*
     * Update timestamps
     */
    lastFetchTime.current = Date.now();

    /*
     * Case 1: 
     * This item was updated, either in his attributes or in his associations, or was deleted.
     * 
     * Conditions:
     * A: the item was modified.
     * B: the item was deleted.
     * 
     * Actions:
     * if A:
     * - set 'updated' alert
     * - return
     * 
     * if B:
     * - set 'deleted' alert
     * - return
     */

    //check if this.item changed
    if(lastModelChanged&&
      lastModelChanged.role&&
      lastModelChanged.role[String(item.id)]) {

        //updated item
        if(lastModelChanged.role[String(item.id)].op === "update"&&
            lastModelChanged.role[String(item.id)].newItem) {
              //show alert
              setUpdated(true);
        } else {
          //deleted item
          if(lastModelChanged.role[String(item.id)].op === "delete") {
              //show alert
              setDeleted(true);
          }
        }
    }//end: Case 1
  }, [lastModelChanged, lastChangeTimestamp, item.id]);

  useEffect(() => {
    if(deleted&&updated) {
      setUpdated(false);
    }
  }, [deleted, updated]);
 
  const handleCancel = (event) => {
    setOpen(false);
    handleReject(event);
  }

  const handleOk = (event) => {
    setOpen(false);
    handleAccept(event, item);
  }

  return (
    <Dialog
      open={open}
      fullWidth={true}
      maxWidth='lg'
      onClose={(event) => {
        if(!isCanceling.current){
          isCanceling.current = true;
          handleCancel(event);
        }
      }}
    >
      
      <DialogTitle>
        { t('modelPanels.deleteMsg') }
      </DialogTitle>

      <Grid container justify='center' alignItems='flex-start' alignContent='flex-start' spacing={0}>
        <Grid item xs={12}>
          {/* Delete warning */}
          <Box
            width="100%"
            p={0}
            position="relative"
            top={8}
            left={0}
            zIndex="speedDial"
          >
            <Collapse in={deleted}>
              <Card className={classes.warningCard} square={true}>
                <CardHeader
                  avatar={
                    <DeletedWarning style={{ color: red[700] }} />
                  }
                  title={ t('modelPanels.deletedWarning', "This item no longer exists. It was deleted elsewhere.") }
                  subheader="Deleted"
                />
              </Card>
            </Collapse>
          </Box>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        {/* Update warning */}
        <Box
          width="100%"
          p={0}
          position="relative"
          top={8}
          left={0}
          zIndex="speedDial"
        >
          <Collapse in={updated}>
            <Card className={classes.warningCard} square={true}>
              <CardHeader
                avatar={
                  <UpdateOk style={{ color: green[700] }} />
                }
                title={ t('modelPanels.updatedWarning', "This item was updated elsewhere.") }
                subheader="Updated"
              />
              <CardActions>
                <Button size="small" color="primary" onClick={()=>{setUpdated(false)}}>
                  Got it
                </Button>
              </CardActions>
            </Card>
          </Collapse>
        </Box>
      </Grid>

      <DialogContent dividers>
        <Suspense fallback={<div />}><ErrorBoundary showMessage={true} belowToolbar={true}>
          <RoleDetailPanel 
            permissions={permissions}
            item={item}
            dialog={false}
            handleClose={handleCancel}
          />
        </ErrorBoundary></Suspense>
      </DialogContent>

      {(!deleted) && (
        <DialogActions>
          <Button 
          id='RoleDeleteConfirmationDialog-button-reject'
          className={classes.button} color="primary"
            onClick={(event) => {
              if(!isCanceling.current){
                isCanceling.current = true;
                handleCancel(event);
              }
            }}
          >
              { t('modelPanels.deleteReject') }
          </Button>
          <Button 
          id='RoleDeleteConfirmationDialog-button-accept'
          className={classes.button} variant="contained" color="secondary"
            onClick={(event) => {
              if(!isDeleting.current){
                isDeleting.current = true;
                handleOk(event);
              }
            }}
          >
              { t('modelPanels.deleteAccept') }
          </Button>
        </DialogActions>
      )}

      {(deleted) && (
        <DialogActions>
          <Button className={classes.button} color="primary"
            onClick={(event) => {
              if(!isCanceling.current){
                isCanceling.current = true;
                handleCancel(event);
              }
            }}
          >
              { t('modelPanels.close', "Close") }
          </Button>
        </DialogActions>
      )}

    </Dialog>
  );
}
RoleDeleteConfirmationDialog.propTypes = {
  permissions: PropTypes.object,
  item: PropTypes.object.isRequired,
  handleAccept: PropTypes.func.isRequired,
  handleReject: PropTypes.func.isRequired,
};