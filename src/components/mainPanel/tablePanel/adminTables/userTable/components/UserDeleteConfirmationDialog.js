import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DetailPanel from '../../detailPanel/DetailPanel'
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
}));

export default function UserDeleteConfirmationDialog(props) {
  const classes = useStyles();
  const {
    item,
    handleAccept,
    handleReject,
  } = props;
  const [open, setOpen] = useState(true);
 
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
      onClose={handleCancel}
    >
      
      <DialogTitle>
        Are you sure you want to delete this item?
      </DialogTitle>

      <DialogContent dividers>
        <DetailPanel 
          item={item}
          dialog={false}
        />
      </DialogContent>

      <DialogActions>
        <Button className={classes.button} onClick={handleCancel} color="primary">
          DO NOT DELETE
        </Button>
        <Button className={classes.button} onClick={handleOk} variant="contained" color="secondary">
          YES, DELETE
        </Button>
      </DialogActions>

    </Dialog>
  );
}
UserDeleteConfirmationDialog.propTypes = {
  item: PropTypes.object.isRequired,
  handleAccept: PropTypes.func.isRequired,
  handleReject: PropTypes.func.isRequired
};