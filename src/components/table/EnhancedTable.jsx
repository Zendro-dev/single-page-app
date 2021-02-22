import { React } from 'react';
import { Table, TableBody, makeStyles, Paper } from '@material-ui/core';
import EnhancedTableHead from './EnhancedTableHead';
import EnhancedTableRow from './EnhancedTableRow';
import useSWR from 'swr';
// import { useSelector } from 'react-redux';
// import { authSelector } from '@/store/auth-slice';
import { GRAPHQL_SERVER_URL } from '@/config/globals';
import axios from 'axios';

const useStyles = makeStyles(() => ({
  tableWrapper: {
    height: `calc(100vh - 72px - 48px - 128px - 80px)`,
    minWidth: 570,
    overflow: 'auto',
    position: 'relative',
  },
  root: {
    marginTop: 72,
    height: `calc(100vh - 72px - 48px)`,
  },
  paper: {
    overflow: 'auto',
    height: `calc(100vh - 72px  - 48px)`,
    minWidth: '50%',
  },
}));

const fetcher = async (query, token) => {
  let response;
  try {
    response = await axios({
      url: GRAPHQL_SERVER_URL,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        common: {
          Authorization: token ? `Bearer ${token}` : null,
        },
      },
      data: {
        query,
        // variables,
      },
    });
  } catch (error) {
    return {
      errors: [error],
    };
  }

  return {
    data: response.data.data.no_assocs,
    errors: response.data.errors,
    status: response.status,
    statusText: response.statusText,
  };
};

export default function EnhancedTable({ attributes }) {
  // ? To accomodate associations will need to recive the operation as well
  const classes = useStyles();

  // const auth = useSelector(authSelector);

  const { data, errors } = useSWR(
    `{
      no_assocs(pagination:{limit:10}){
        idField
        stringField
        intField
        floatField
        datetimeField
        booleanField
        stringArrayField
        intArrayField
        floatArrayField
        datetimeArrayField
        booleanArrayField
      }
    }`,
    fetcher
  );

  console.log(data);
  console.log(errors);

  return (
    // TODO attribute props
    // ? since the TableHead is static it can directly recieve the attributes.
    // ? Be aware that depending on the datamodel id needs to be added

    // ? root Table container. Inside the paper add Toolbar and pagination components
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <div className={classes.tableWrapper}>
          <Table stickyHeader size="small">
            <EnhancedTableHead attributes={attributes} />
            <TableBody>
              {data &&
                data.data.map((record, index) => (
                  // TODO key should use primaryKey
                  <EnhancedTableRow
                    attributes={attributes}
                    record={record}
                    key={`${record[0]}-${index}`}
                  />
                ))}
            </TableBody>
          </Table>
        </div>
      </Paper>
    </div>
  );
}
