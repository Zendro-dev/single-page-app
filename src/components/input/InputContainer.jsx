import { createStyles, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

export default function StringField({
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  ...props
}) {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, props.className ?? '')}>
      {LeftIcon ? (
        <LeftIcon className={clsx(classes.icon, classes.leftIcon)} />
      ) : (
        <span className={classes.iconPlaceholder} />
      )}
      {props.children}
      {RightIcon ? (
        <RightIcon className={clsx(classes.icon, classes.rightIcon)} />
      ) : (
        <span className={classes.iconPlaceholder} />
      )}
    </div>
  );
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    iconPlaceholder: {
      width: theme.spacing(9.5),
    },
    icon: {
      marginTop: theme.spacing(8),
      width: theme.spacing(5),
      height: theme.spacing(5),
    },
    leftIcon: {
      marginRight: theme.spacing(4),
    },
    rightIcon: {
      marginLeft: theme.spacing(4),
    },
  })
);
