import NextLink from 'next/link';
import {
  Breadcrumbs as MuiBreadcrumbs,
  Link as MuiLink,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import { SvgIconType } from '@/types/elements';
import clsx from 'clsx';

export interface Breadcrumb {
  href?: string;
  icon?: SvgIconType;
  text: string;
}

interface BreadcrumbsProps {
  className?: string;
  crumbs: Breadcrumb[];
  id: string;
}

export default function Breadcrumbs(
  props: BreadcrumbsProps
): React.ReactElement {
  const classes = useStyles();
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.only('xs'));
  return (
    <MuiBreadcrumbs
      aria-label="breadcrumb"
      className={props.className}
      maxItems={mobile ? 2 : undefined}
    >
      {props.crumbs.map(({ href, icon: Icon, text }) =>
        href ? (
          <NextLink key={text} href={href} passHref>
            <MuiLink
              className={clsx(classes.crumb, classes.link)}
              underline="none"
              color="inherit"
            >
              {Icon && <Icon className={classes.icon} fontSize="inherit" />}
              <span>{text}</span>
            </MuiLink>
          </NextLink>
        ) : (
          <Typography key={text} className={classes.crumb} color="inherit">
            {Icon && <Icon className={classes.icon} fontSize="inherit" />}
            {text}
          </Typography>
        )
      )}
    </MuiBreadcrumbs>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    crumb: {
      display: 'flex',
      alignItems: 'center',
      fontSize: theme.spacing(4),
      textTransform: 'uppercase',
    },
    link: {
      color: theme.palette.primary.main,
      '&:hover': {
        textDecoration: 'underline',
      },
    },
    icon: {
      marginRight: theme.spacing(2),
    },
  })
);
