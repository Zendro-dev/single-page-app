import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import EnhancedTable from '../components/enhancedtable/EnhancedTable';
import TableToolBar from '../components/tableToolBar/tableToolBar';

const attributes = ['attr1', 'attr2', 'attr3'];

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 72,
    height: `calc(100vh - 72px - 48px)`,
  },
}));

export default function TableLayout() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <TableToolBar />
    </div>
  );
}
