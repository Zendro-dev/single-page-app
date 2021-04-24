import NextLink from 'next/link';
import {
  Breadcrumbs as MuiBreadcrumbs,
  createStyles,
  Link as MuiLink,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { SvgIconType } from '@/types/elements';
import clsx from 'clsx';

interface Breadcrumb {
  href?: string;
  icon?: SvgIconType;
  text: string;
}

interface BreadcrumbsProps {
  id: string;
  crumbs: Breadcrumb[];
}

export default function Breadcrumbs(
  props: BreadcrumbsProps
): React.ReactElement {
  const classes = useStyles();
  return (
    <MuiBreadcrumbs aria-label="breadcrumb">
      {props.crumbs.map(({ href, icon: Icon, text }) =>
        href ? (
          <NextLink key={text} href={href} passHref>
            <MuiLink
              className={clsx(classes.crumb, classes.link)}
              underline="none"
              color="inherit"
            >
              {Icon && <Icon sx={{ mr: 0.5 }} fontSize="inherit" />}
              {text}
            </MuiLink>
          </NextLink>
        ) : (
          <Typography key={text} className={classes.crumb} color="inherit">
            {Icon && <Icon sx={{ mr: 0.5 }} fontSize="inherit" />}
            {text}
          </Typography>
        )
      )}
    </MuiBreadcrumbs>
  );
}

const useStyles = makeStyles((theme) =>
  createStyles({
    crumb: {
      display: 'flex',
      alignItems: 'center',
      textTransform: 'capitalize',
      fontSize: theme.spacing(5),
    },
    link: {
      '&:hover': {
        color: theme.palette.primary.main,
      },
    },
  })
);
