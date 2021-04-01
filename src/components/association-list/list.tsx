import { createStyles, makeStyles } from '@material-ui/core/styles';
import { List, ListItem, Typography } from '@material-ui/core';
import ModelTable from '@/components/records-table';
import { useZendroClient } from '@/hooks';
import { ParsedAssociation, ParsedAttribute } from '@/types/models';

interface AssociationListProps {
  associations: ParsedAssociation[];
  attributes: ParsedAttribute[];
  modelName: string;
  recordId?: string;
}

export default function AssociationsList({
  associations,
  attributes,
  modelName,
  recordId,
}: AssociationListProps): React.ReactElement {
  const classes = useStyles();
  const zendro = useZendroClient();

  const handleOnAssociationClick = (): void => {
    //
  };

  const handleOnAssociationKeyDown = (): void => {
    //
  };

  return (
    <>
      <div className={classes.root}>
        <ModelTable
          className={classes.table}
          attributes={attributes}
          modelName={modelName}
          requests={{
            count: zendro.queries[modelName].countAll,
            delete: zendro.queries[modelName].deleteOne,
            read: zendro.queries[modelName].readAll,
          }}
          associationView="details"
        />
      </div>
      <List className={classes.nav}>
        {associations.map((association) => (
          <ListItem
            key={`${association.name}-assoc-list`}
            className={classes.navItem}
            button
            onClick={handleOnAssociationClick}
            onKeyDown={handleOnAssociationKeyDown}
          >
            <Typography component="p" fontSize={15} fontWeight="bold">
              {association.name.toUpperCase()}
            </Typography>
            <Typography component="p" variant="subtitle1" color="GrayText">
              {association.type}
            </Typography>
          </ListItem>
        ))}
      </List>
    </>
  );
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexGrow: 1,
      width: '100%',
    },
    table: {
      padding: theme.spacing(2, 4),
    },
    nav: {
      // display: 'none',
      display: 'block',
      padding: theme.spacing(0, 0, 0, 0),
      borderLeft: '1px solid',
      borderLeftColor: theme.palette.grey[300],
      // [theme.breakpoints.up('md')]: {
      // },
    },
    navItem: {
      position: 'relative',
      display: 'block',
      padding: theme.spacing(4, 8),
      '&:not(:first-child)': {
        borderTop: '1px solid',
        borderTopColor: theme.palette.grey[300],
        // content: '""',
        // // display: 'block',
        // position: 'absolute',
        // width: '100%',
        // height: 1,
        // top: 0,
        // clear: 'both',
        // backgroundColor: theme.palette.grey[300],
      },
    },
  })
);
