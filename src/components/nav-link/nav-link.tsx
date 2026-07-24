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
  return (
    <Link href={href} passHref>
      <ListItemButton className={className ?? ''} component="a">
        {Icon && (
          <ListItemIcon>
            <Icon />
          </ListItemIcon>
        )}
        <ListItemText
          primary={<Typography {...textProps}>{text}</Typography>}
        />
      </ListItemButton>
    </Link>
  );
}
