import { Link as RouterLink } from 'react-router-dom';

import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  TypographyProps,
} from '@mui/material';

import { SvgIconType } from '@/types/elements';

export interface NavLinkProps {
  className?: string;
  href: string;
  icon?: SvgIconType;
  text: string;
  textProps?: TypographyProps;
}

export default function NavLink({
  className,
  href,
  icon: Icon,
  text,
  textProps,
}: NavLinkProps): React.ReactElement {
  return (
    <ListItem className={className ?? ''} component={RouterLink} to={href} button>
      {Icon && (
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
      )}
      <ListItemText primary={<Typography {...textProps}>{text}</Typography>} />
    </ListItem>
  );
}
