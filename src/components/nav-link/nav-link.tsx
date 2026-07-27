import Link from 'next/link';

import {
  ListItemButton,
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
  // next/link's Link renders its own <a> directly (no more passHref +
  // manual-child-<a> pattern) - delegating ListItemButton's own root
  // rendering to it via `component` keeps this to a single <a>, instead of
  // nesting one inside the other and triggering a hydration error.
  return (
    <ListItemButton className={className ?? ''} component={Link} href={href}>
      {Icon && (
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
      )}
      <ListItemText primary={<Typography {...textProps}>{text}</Typography>} />
    </ListItemButton>
  );
}
