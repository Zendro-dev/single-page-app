import { React } from 'react';
import {
  Table,
  TableBody,
  makeStyles,
  Paper,
  TableContainer,
} from '@material-ui/core';
import EnhancedTableHead from './EnhancedTableHead';
import EnhancedTableRow from './EnhancedTableRow';
import useSWR from 'swr';
import { useSelector } from 'react-redux';
import { authSelector } from '@/store/auth-slice';
import { readMany } from '@/utils/requests';

const useStyles = makeStyles(() => ({
  tableWrapper: {
    height: `calc(100vh - 72px - 48px - 128px - 80px)`,
    minWidth: 570,
    overflow: 'auto',
    position: 'relative',
  },
  paper: {
    overflow: 'auto',
    height: `calc(100vh - 72px  - 48px)`,
    minWidth: '50%',
  },
}));

// ! Hardcoded for now. The component will get the variables from its children
const variables = { pagination: { first: 10 } };

export default function EnhancedTable({ modelName, attributes, query }) {
  // ? To accomodate associations will need to recive the operation as well
  const classes = useStyles();

  const auth = useSelector(authSelector);

  const { data, error } = useSWR(
    [query, variables, auth.user.token],
    readMany(modelName)
  );

  return (
    // ? root Table container. Inside the paper add Toolbar and pagination components.
    // ? Consider "un-nesting" this
    <TableContainer component={Paper} className={classes.paper}>
      <div>TOOLBAR</div>
      <div className={classes.tableWrapper}>
        <Table stickyHeader size="small">
          <EnhancedTableHead attributes={attributes} />
          {data && (
            <TableBody>
              {data.map((record, index) => (
                // TODO key should use primaryKey
                <EnhancedTableRow
                  attributes={attributes}
                  record={record}
                  key={`${record[0]}-${index}`}
                />
              ))}
            </TableBody>
          )}
        </Table>
      </div>
      <div style={{ textAlign: 'right' }}>PAGINATION</div>
    </TableContainer>
  );
}
