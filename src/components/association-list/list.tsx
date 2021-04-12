import { createStyles, makeStyles } from '@material-ui/core/styles';
import { List, ListItem, Typography } from '@material-ui/core';
import { useToastNotification, useZendroClient } from '@/hooks';
import { ParsedAssociation, ParsedAttribute } from '@/types/models';
import { useState } from 'react';
import useSWR from 'swr';

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
  const { showSnackbar } = useToastNotification();
  const [selected, setSelected] = useState<string>(associations[0].target);
  const classes = useStyles();
  const zendro = useZendroClient();

  useSWR(
    zendro.queries[modelName].assoc[selected].query,
    (query: string) =>
      zendro.request(query, {
        search: undefined,
        order: undefined,
        pagination: { first: 25 },
        assocPagination: { first: 10 },
      }),
    {
      onSuccess: (data) => {
        console.log({ data });
      },
      onError: (error) => {
        showSnackbar('There was an error', 'error', error);
      },
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  const handleOnAssociationClick = (
    target: string
  ) => async (): Promise<void> => {
    setSelected(target);

    const { query, transform } = zendro.queries[modelName].assoc[selected];

    if (transform) {
      const res = await zendro
        .metaRequest<any>(query, {
          jq: transform,
          variables: {
            pagination: { first: 25 },
          },
        })
        .catch((error) => {
          showSnackbar('There was an error', 'error', error);
        });
      console.log({ res });
    }
  };

  const handleOnAssociationKeyDown = (): void => {
    //
  };

  return (
    <>
      {/* <ModelTable
        className={classes.table}
        attributes={attributes}
        modelName={modelName}
        requests={{
          count: zendro.queries[modelName].countAll,
          delete: zendro.queries[modelName].deleteOne,
          read: zendro.queries[modelName].assoc[selected],
        }}
        associationView="details"
      /> */}
      <List className={classes.nav}>
        {associations.map((association) => (
          <ListItem
            key={`${association.name}-assoc-list`}
            className={classes.navItem}
            button
            onClick={handleOnAssociationClick(association.target)}
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
    table: {
      padding: theme.spacing(2, 4),
    },
    nav: {
      // display: 'none',
      display: 'block',
      padding: 0,
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
      },
    },
  })
);
