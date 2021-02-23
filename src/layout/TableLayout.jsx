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
  const modelName = 'User';

  const onSearch = (value) => {
    /** Code for searching records goes here */
    console.log('Search and display records with filter: ', value);
  };

  const onReload = () => {
    /** Code for reload goes here */
    console.log('Reload records, considering the search value');
  };

  const onAdd = () => {
    /** Code for adding (redirecting to create) a record goes here */
    console.log('Add record');
  };

  return (
    <div className={classes.root}>
      <TableToolBar
        modelName={modelName}
        onAdd={onAdd}
        onReload={onReload}
        onSearch={onSearch}
      />
    </div>
  );
}
