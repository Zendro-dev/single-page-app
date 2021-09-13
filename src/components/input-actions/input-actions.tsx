import clsx from 'clsx';
import { ReactElement, ReactNode, PropsWithChildren } from 'react';
import { Theme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';

interface InputActionsProps {
  className?: string;
  actionBottom?: ReactNode;
  actionLeft?: ReactNode;
  actionRight?: ReactNode;
  actionTop?: ReactNode;
}

export type WithActions<T> = T &
  Pick<
    InputActionsProps,
    'actionBottom' | 'actionLeft' | 'actionRight' | 'actionTop'
  >;

export default function InputActions({
  actionBottom: bottomIcon,
  actionLeft: LeftIcon,
  actionRight: RightIcon,
  actionTop: topIcon,
  ...props
}: PropsWithChildren<InputActionsProps>): ReactElement {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, props.className ?? '')}>
      {topIcon && (
        <div className={clsx(classes.actionY, classes.actionYTop)}>
          {topIcon}
        </div>
      )}

      {
        <div className={clsx(classes.actionXLeft, classes.actionX)}>
          {LeftIcon || <svg />}
        </div>
      }

      {props.children}

      {
        <div className={clsx(classes.actionXRight, classes.actionX)}>
          {RightIcon || <svg />}
        </div>
      }

      {bottomIcon && (
        <div className={clsx(classes.actionY, classes.actionYBottom)}>
          {bottomIcon}
        </div>
      )}
    </div>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      display: 'flex',
      margin: theme.spacing(5, 0, 6, 0),
    },
    actionX: {
      '& > svg': {
        marginTop: theme.spacing(4),
        width: theme.spacing(5),
        height: theme.spacing(5),
      },
      '& > button': {
        marginTop: theme.spacing(3),
      },
      '& > button svg': {
        width: theme.spacing(5),
        height: theme.spacing(5),
      },
    },
    actionXLeft: {
      marginRight: theme.spacing(4),
    },
    actionXRight: {
      marginLeft: theme.spacing(4),
    },
    actionY: {
      position: 'absolute',
      zIndex: 1,
    },
    actionYBottom: {
      backgroundColor: theme.palette.background.default,
      bottom: '-11px',
      left: '45%',
      '& > svg, button': {
        margin: 0,
        height: theme.spacing(5),
        width: theme.spacing(5),
      },
    },
    actionYTop: {
      backgroundColor: theme.palette.background.default,
      top: '-12.5px',
      left: '45%',
      '& > svg, button': {
        margin: 0,
        height: theme.spacing(5),
        width: theme.spacing(5),
      },
    },
  })
);
