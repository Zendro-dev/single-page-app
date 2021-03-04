import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Divider, List } from '@material-ui/core';

import AssociationLink from './list-link';
import { ParsedAssociation } from '@/types/models';

export interface AssociationListProps {
  associations: ParsedAssociation[];
  modelName: string;
}

export default function AssociationsList({
  associations,
  modelName,
}: AssociationListProps): React.ReactElement {
  const classes = useStyles();

  return (
    <List className={classes.root} disablePadding>
      {associations.map((assoc) => {
        console.log({ assoc });
        return (
          <AssociationLink
            key={`${assoc.name}-assoc-list`}
            href={`/${assoc.target}?filter=${modelName}`}
            association={assoc}
          />
        );
      })}
    </List>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      padding: theme.spacing(0, 2),
    },
  })
);
